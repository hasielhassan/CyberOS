import { useState, useEffect } from 'react';
import {
    Settings, List, Crosshair, Eye, Database, ShieldAlert,
    ChevronLeft, ChevronRight, AlertTriangle, Activity
} from 'lucide-react';
import { useMissions } from '../missions/MissionsContext';
import { missionEventBus } from '../missions/MissionEventBus';
import { useMissionState } from '../../hooks/useMissionState';
import { useLanguage } from '../../core/registry';
import CyberGlobe3D from './components/CyberGlobe3D';
import { SettingsModal, SensorFeedModal, TelemetryModal, CatalogModal, AuthModal, ProgressModal, RestartModal } from './components/Modals';
import { SatelliteData, NEOData, SpaceWeather, ObjectType } from './types';
import { CATEGORY_COLORS, DEFAULT_API_KEY, NASA_BASE_URL, EONET_URL } from './constants';
import fallbackData from './data/fallbackData.json';

export default function SatUplink() {
    const { t } = useLanguage();
    const { activeMission } = useMissions();
    const { completeTask, isTaskCompleted } = useMissionState();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedNeo, setSelectedNeo] = useState<NEOData | null>(null);
    const [filters, setFilters] = useState<ObjectType[]>(['CIVIL', 'MILITARY', 'DEBRIS', 'STATION', 'TELESCOPE', 'WILDFIRE', 'STORM']);
    const [modalType, setModalType] = useState<'SENSOR' | 'CATALOG' | 'TELEMETRY' | 'SETTINGS' | 'APOD' | 'JAMMER' | 'RESTART' | null>(null);
    const [neos, setNeos] = useState<NEOData[]>([]);
    const [spaceWeather, setSpaceWeather] = useState<SpaceWeather[]>([]);
    const [loadingNeos, setLoadingNeos] = useState(false);
    const [neoPage, setNeoPage] = useState(0);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('nasa_api_key') || DEFAULT_API_KEY);
    const [activeTab, setActiveTab] = useState<'NEO' | 'WEATHER'>('NEO');

    // Initialize with fallback data
    const [satellites, setSatellites] = useState<Record<string, SatelliteData>>(() => {
        const data = fallbackData.satellites as Record<string, SatelliteData>;
        return data;
    });

    const handleSetApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('nasa_api_key', key);
    };

    // --- DATA MERGING HELPER ---
    const getMissionSatellites = (baseSats: Record<string, SatelliteData>) => {
        if (!activeMission?.moduleData?.Satellite?.satellites) return baseSats;

        const missionSatellites = activeMission.moduleData.Satellite.satellites;
        const merged = mergeMissionData(baseSats, missionSatellites);

        // Check for persisted completion state
        Object.entries(missionSatellites).forEach(([id, data]: [string, any]) => {
            if (data.tasksUpdate && data.resetData) {
                // Check if any of the tasks that trigger this update are completed
                const shouldReset = activeMission && Object.keys(data.tasksUpdate).some(taskId => isTaskCompleted(activeMission.id, taskId));
                if (shouldReset) {
                    merged[id] = { ...merged[id], ...data.resetData };
                }
            }
        });

        return merged;
    };

    // Merge Mission Data & Apply Persistence
    useEffect(() => {
        const missionSatellites = activeMission?.moduleData?.Satellite?.satellites;
        if (missionSatellites) {
            setSatellites(prev => getMissionSatellites(prev));
        }
    }, [activeMission, isTaskCompleted]);

    // --- DEEP MERGE UTILITY ---
    const mergeMissionData = (baseSats: Record<string, SatelliteData>, missionSats: Record<string, any>) => {
        const merged = { ...baseSats };
        Object.entries(missionSats).forEach(([id, data]) => {
            if (merged[id]) {
                // Deep merge existing
                merged[id] = { ...merged[id], ...data };
            } else {
                // Add new
                merged[id] = data as SatelliteData;
            }
        });
        return merged;
    };

    // 1. EONET Integration (Direct URL)
    useEffect(() => {
        const fetchEvents = async () => {
            console.log('[DEBUG] SatUplink: Fetching EONET data...');
            try {
                const res = await fetch(`${EONET_URL}?limit=10&status=open`);
                const data = await res.json();
                const newHazards: Record<string, SatelliteData> = {};

                if (data.events) {
                    data.events.forEach((evt: any) => {
                        if (evt.geometry && evt.geometry.length > 0) {
                            const id = `hz-${evt.id}`;
                            let coords = evt.geometry[0].coordinates;
                            // Drill down to find the first [lon, lat] pair if it's a Polygon/MultiPolygon
                            while (Array.isArray(coords[0])) {
                                coords = coords[0];
                            }
                            const isFire = evt.categories[0].id === 'wildfires';
                            const isStorm = evt.categories[0].id === 'severeStorms';
                            const type: ObjectType = isFire ? 'WILDFIRE' : isStorm ? 'STORM' : 'HAZARD';

                            newHazards[id] = {
                                id,
                                name: evt.title.toUpperCase(),
                                type: type,
                                owner: 'NATURE',
                                orbit: 'SURFACE',
                                alt: '0 km',
                                inclination: 0,
                                period: 0,
                                fuel: 0,
                                status: 'ACTIVE ALERT',
                                color: CATEGORY_COLORS[type] || '#ffffff',
                                description: `EONET ID: ${evt.id}. Type: ${evt.categories[0].title}.`,
                                supportedTargets: ['HURRICANE'], // Fallback image
                                apiQueryType: 'EARTH',
                                isHazard: true,
                                coordinates: coords
                            };
                        }
                    });
                }

                setSatellites(prev => {
                    const withHazards = { ...prev, ...newHazards };
                    return getMissionSatellites(withHazards);
                });
            } catch (e) { console.log("[DEBUG] SatUplink: EONET Fetch failed, using fallback", e); }
        };
        fetchEvents();
    }, [activeMission, isTaskCompleted]);

    // 2. DONKI Integration (Space Weather)
    useEffect(() => {
        const fetchWeather = async () => {
            // Check for mission override
            if (activeMission?.moduleData?.Satellite?.spaceWeather) {
                setSpaceWeather(activeMission.moduleData.Satellite.spaceWeather);
                return;
            }

            console.log('[DEBUG] SatUplink: Fetching DONKI data...');
            try {
                const res = await fetch(`${NASA_BASE_URL}/DONKI/notifications?type=GST,FLR&api_key=${apiKey}`);
                const data = await res.json();
                const weather: SpaceWeather[] = Array.isArray(data) ? data.slice(0, 10).map((w: any) => ({
                    id: w.messageID,
                    type: w.messageType,
                    startTime: w.messageIssueTime,
                    link: w.messageURL,
                    note: w.messageBody.substring(0, 100) + "..."
                })) : [];
                setSpaceWeather(weather);
            } catch (e) {
                setSpaceWeather(fallbackData.spaceWeather as SpaceWeather[]);
            }
        };
        fetchWeather();
    }, [apiKey, activeMission]);

    // 3. NeoWs Integration (Asteroids)
    useEffect(() => {
        const fetchNEOs = async () => {
            setLoadingNeos(true);

            // Check for mission override
            let missionNeos: NEOData[] = [];
            if (activeMission?.moduleData?.Satellite?.neos) {
                missionNeos = activeMission.moduleData.Satellite.neos;
            }

            try {
                const today = new Date().toISOString().split('T')[0];
                const res = await fetch(`${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`);
                const data = await res.json();
                const rawObjects = data.near_earth_objects[today] || [];
                const processed: NEOData[] = rawObjects.map((o: any) => ({
                    id: o.id,
                    name: o.name,
                    missDistance: parseFloat(o.close_approach_data[0].miss_distance.kilometers).toFixed(0),
                    velocity: parseFloat(o.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0),
                    isHazardous: o.is_potentially_hazardous_asteroid,
                    time: o.close_approach_data[0].close_approach_date_full.split(' ')[1] || '00:00',
                    magnitude: o.absolute_magnitude_h
                })).sort((a: NEOData, b: NEOData) => (a.isHazardous === b.isHazardous ? 0 : a.isHazardous ? -1 : 1));

                setNeos([...missionNeos, ...processed]);
            } catch (e) {
                setNeos([...missionNeos, ...(fallbackData.neos as NEOData[])]);
            } finally {
                setLoadingNeos(false);
            }
        };
        fetchNEOs();
    }, [apiKey, activeMission]);

    const selectedSat = selectedId ? satellites[selectedId] : null;

    const neoAsSat: SatelliteData | null = selectedNeo ? {
        id: selectedNeo.id, name: selectedNeo.name, type: 'DEBRIS',
        owner: 'N/A', orbit: 'SOLAR', alt: `${selectedNeo.missDistance} km`, inclination: 0, period: 0,
        fuel: 0, status: 'APPROACHING EARTH', color: selectedNeo.isHazardous ? '#ef4444' : '#9ca3af',
        description: `Near Earth Object. Mag: ${selectedNeo.magnitude}. Vel: ${selectedNeo.velocity} km/h`,
        supportedTargets: ['ASTEROID'], apiQueryType: 'SPACE', isNeo: true
    } : null;

    const visibleNeos = neos.slice(neoPage * 5, (neoPage + 1) * 5);
    const maxPage = Math.ceil(neos.length / 5) - 1;

    const [jammedSats, setJammedSats] = useState<string[]>([]);
    const [jammingStep, setJammingStep] = useState<'AUTH' | 'PROGRESS' | 'COMPLETE'>('AUTH');
    const [restartStep, setRestartStep] = useState<'AUTH' | 'PROCESS'>('AUTH');

    const handleJammingComplete = () => {
        if (selectedSat) {
            setJammedSats(prev => [...prev, selectedSat.id]);
            setJammingStep('COMPLETE');
            missionEventBus.emit('SAT_JAM', { target: selectedSat.id });
            setTimeout(() => {
                setModalType(null);
                setJammingStep('AUTH');
            }, 2000);
        }
    };

    const handleRestoreComplete = () => {
        if (selectedSat) {
            setJammedSats(prev => prev.filter(id => id !== selectedSat.id));

            // Mark tasks as completed
            if (selectedSat.tasksUpdate && activeMission) {
                Object.entries(selectedSat.tasksUpdate).forEach(([taskId, shouldComplete]) => {
                    if (shouldComplete) completeTask(activeMission.id, taskId);
                });
            }

            // Apply reset data if available (Mission Success State)
            if (selectedSat.resetData) {
                setSatellites(prev => ({
                    ...prev,
                    [selectedSat.id]: {
                        ...prev[selectedSat.id],
                        ...selectedSat.resetData
                    }
                }));
            }

            missionEventBus.emit('SAT_RESTORE', { target: selectedSat.id });
            setModalType(null);
            setRestartStep('AUTH');
        }
    };

    return (
        <div className="w-full h-full bg-[#020403] text-green-500 font-sans selection:bg-green-900 selection:text-white overflow-hidden flex">

            {modalType === 'SENSOR' && (selectedSat || neoAsSat) && (
                <SensorFeedModal
                    satellite={selectedSat || neoAsSat!}
                    onClose={() => setModalType(null)}
                    missionImage={activeMission?.moduleData?.Satellite?.sensorFeed?.[selectedSat?.id || '']?.image}
                    missionMeta={activeMission?.moduleData?.Satellite?.sensorFeed?.[selectedSat?.id || '']?.meta}
                />
            )}
            {modalType === 'CATALOG' && (
                <CatalogModal onClose={() => setModalType(null)} onTrack={(id) => { setSelectedId(id); setSelectedNeo(null); }} satellites={satellites} />
            )}
            {modalType === 'TELEMETRY' && <TelemetryModal onClose={() => setModalType(null)} missionTelemetry={activeMission?.moduleData?.Satellite?.telemetry?.[selectedSat?.id || '']} satellite={selectedSat || undefined} />}
            {modalType === 'SETTINGS' && <SettingsModal onClose={() => setModalType(null)} apiKey={apiKey} setApiKey={handleSetApiKey} />}

            {modalType === 'JAMMER' && (
                jammingStep === 'AUTH' ? (
                    <AuthModal
                        title={t('sat.weapon_auth')}
                        onClose={() => setModalType(null)}
                        onSuccess={() => setJammingStep('PROGRESS')}
                        validationKey={selectedSat?.jammerKey}
                        danger
                    />
                ) : (
                    <ProgressModal
                        title={t('sat.jamming_sequence')}
                        action={t('sat.overwhelming')}
                        duration={4000}
                        onComplete={handleJammingComplete}
                        danger
                    />
                )
            )}

            {modalType === 'RESTART' && (
                restartStep === 'AUTH' ? (
                    <AuthModal
                        title={t('sat.reboot_auth')}
                        onClose={() => setModalType(null)}
                        onSuccess={() => setRestartStep('PROCESS')}
                        validationKey={selectedSat?.rebootKey}
                    />
                ) : (
                    <RestartModal
                        onClose={() => setModalType(null)}
                        onComplete={handleRestoreComplete}
                        isMissionTarget={!!activeMission?.moduleData?.Satellite?.satellites?.[selectedSat?.id || '']}
                        satellite={selectedSat || undefined}
                    />
                )
            )}

            {/* CENTER + RIGHT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#020403]">
                <header className="h-16 border-b border-green-900/30 flex items-center justify-between px-6 bg-[#030605] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                        <h2 className="text-sm font-medium tracking-widest text-green-400">{t('sat.live_tracking', { count: Object.keys(satellites).length })}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setModalType('SETTINGS')} className="p-2 hover:bg-green-900/30 rounded text-green-400"><Settings size={16} /></button>
                        <button onClick={() => setModalType('CATALOG')} className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-900/50 rounded text-xs font-bold text-green-400"><List size={14} /> {t('sat.catalog')}</button>
                    </div>
                </header>

                {/* WORKSPACE */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* GLOBE */}
                    <div className="flex-1 relative p-4 flex flex-col min-w-0">
                        <div className="flex-1 border border-green-900/30 rounded-lg relative overflow-hidden bg-[#030504]">
                            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm p-3 rounded border border-green-900/30">
                                <h3 className="text-[10px] font-bold text-green-600 mb-2">{t('sat.layer_visibility')}</h3>
                                <div className="space-y-1 text-[10px] font-mono select-none">
                                    {['CIVIL', 'MILITARY', 'TELESCOPE', 'STATION', 'DEBRIS', 'WILDFIRE', 'STORM'].map(t => (
                                        <div key={t} onClick={() => setFilters(p => p.includes(t as any) ? p.filter(f => f !== t) : [...p, t as any])} className={`flex items-center gap-2 cursor-pointer ${filters.includes(t as any) ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t] || '#fff' }}></div>{t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute inset-0">
                                <CyberGlobe3D filters={filters} onObjectSelect={(id) => { setSelectedId(id); setSelectedNeo(null); }} selectedId={selectedId} satellites={satellites} jammedSats={jammedSats} />
                            </div>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-green-700 bg-black/40 px-2 rounded pointer-events-none">
                                {t('sat.middle_mouse')}
                            </div>
                        </div>
                    </div>

                    {/* DETAILS PANEL */}
                    <div className="w-80 flex-shrink-0 border-l border-green-900/30 bg-[#030605] flex flex-col p-4 gap-4 overflow-y-auto z-10">
                        <div className="border border-green-900/30 rounded p-4 bg-[#040806] min-h-[220px]">
                            <h3 className="text-xs font-bold text-green-600 mb-4 border-b border-green-900/30 pb-2 flex justify-between">
                                {t('sat.target_analysis')} {(selectedId || selectedNeo) && <span className="animate-pulse text-green-400">● {t('sat.locked')}</span>}
                            </h3>

                            {selectedSat ? (
                                <>
                                    <div className="text-sm font-bold text-green-100 mb-1 flex justify-between">
                                        {selectedSat.name}
                                        {jammedSats.includes(selectedSat.id) && <span className="text-red-500 text-[10px] border border-red-500 px-1 rounded bg-red-900/20">{t('sat.offline')}</span>}
                                    </div>
                                    <div className="text-[10px] text-green-600 mb-4 italic">{selectedSat.description}</div>
                                    <div className={`space-y-2 text-[11px] font-mono ${jammedSats.includes(selectedSat.id) ? 'text-gray-500 opacity-50' : 'text-green-500'} bg-green-900/5 p-2 rounded`}>
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.owner')}:</span> <span className="text-green-300">{selectedSat.owner}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.type')}:</span> <span>{selectedSat.type}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.alt')}:</span> <span>{selectedSat.alt}</span></div>
                                    </div>
                                </>
                            ) : selectedNeo ? (
                                <>
                                    <div className="text-sm font-bold text-red-100 mb-1">{selectedNeo.name}</div>
                                    <div className="text-[10px] text-red-400 mb-4 italic">Potentially Hazardous Asteroid.</div>
                                    <div className="space-y-2 text-[11px] font-mono text-red-500 bg-red-900/10 p-2 rounded">
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.miss_dist')}:</span> <span>{selectedNeo.missDistance} km</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.velocity')}:</span> <span>{selectedNeo.velocity} km/h</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">{t('sat.mag')}:</span> <span>{selectedNeo.magnitude}</span></div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-green-800 opacity-50 py-10">
                                    <Crosshair className="w-10 h-10 mb-2" />
                                    <span className="text-xs">{t('sat.select_asset')}</span>
                                </div>
                            )}
                        </div>

                        <div className={`border border-green-900/30 rounded p-4 bg-[#040806] ${(!selectedSat && !selectedNeo) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <h3 className="text-xs font-bold text-green-600 mb-3 border-b border-green-900/30 pb-2">{t('sat.available_actions')}</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => setModalType('SENSOR')} className="w-full py-2 px-3 text-xs font-bold border border-green-900/50 bg-green-900/10 text-green-400 hover:bg-green-900/30 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> {selectedNeo ? t('sat.visual_tracking') : t('sat.activate_sensor')}</span><span className="text-[9px] border border-green-800 px-1">EXE</span>
                                </button>
                                <button onClick={() => setModalType('TELEMETRY')} className="w-full py-2 px-3 text-xs font-bold border border-green-900/50 bg-green-900/10 text-green-400 hover:bg-green-900/30 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Database className="w-3 h-3" /> {t('sat.download_telemetry')}</span><span className="text-[9px] border border-green-800 px-1">EXE</span>
                                </button>
                                {(selectedSat?.type === 'MILITARY' || selectedSat?.realType === 'MILITARY') && !jammedSats.includes(selectedSat.id) && (
                                    <button onClick={() => setModalType('JAMMER')} className="w-full py-2 px-3 text-xs font-bold border border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/30 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><ShieldAlert className="w-3 h-3" /> {t('sat.signal_jammer')}</span><span className="text-[9px] border border-red-800 px-1">EXE</span>
                                    </button>
                                )}
                                {selectedSat && jammedSats.includes(selectedSat.id) && (
                                    <button onClick={() => setModalType('RESTART')} className="w-full py-2 px-3 text-xs font-bold border border-green-900/50 bg-green-900/20 text-green-400 hover:bg-green-900/40 flex items-center justify-between animate-pulse">
                                        <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> {t('sat.system_reboot')}</span><span className="text-[9px] border border-green-800 px-1">EXE</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* EVENT HORIZON */}
                <div className="h-40 border-t border-green-900/30 bg-[#030504] p-4 relative flex flex-col flex-shrink-0 z-20">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-4 items-center">
                            <h3 className="text-xs font-bold text-green-600">{t('sat.event_horizon')}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveTab('NEO')} className={`text-[10px] px-2 py-0.5 rounded ${activeTab === 'NEO' ? 'bg-green-600 text-black' : 'border border-green-900/50 text-green-600'}`}>{t('sat.neo_watch')}</button>
                                <button onClick={() => setActiveTab('WEATHER')} className={`text-[10px] px-2 py-0.5 rounded ${activeTab === 'WEATHER' ? 'bg-green-600 text-black' : 'border border-green-900/50 text-green-600'}`}>{t('sat.space_weather')}</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] text-green-800 font-mono">{t('sat.data_source')}</span>
                            {activeTab === 'NEO' && (
                                <div className="flex gap-1">
                                    <button onClick={() => setNeoPage(p => Math.max(0, p - 1))} disabled={neoPage === 0} className="p-1 hover:bg-green-900/30 disabled:opacity-30 rounded"><ChevronLeft size={14} /></button>
                                    <span className="text-[10px] font-mono w-12 text-center">{neoPage + 1} / {maxPage + 1}</span>
                                    <button onClick={() => setNeoPage(p => Math.min(maxPage, p + 1))} disabled={neoPage === maxPage} className="p-1 hover:bg-green-900/30 disabled:opacity-30 rounded"><ChevronRight size={14} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <div className="flex gap-4 h-full items-center">
                            {activeTab === 'NEO' ? (
                                loadingNeos ? (
                                    <div className="text-xs font-mono animate-pulse text-green-700">{t('sat.scanning')}</div>
                                ) : visibleNeos.map(neo => (
                                    <div key={neo.id} onClick={() => { setSelectedNeo(neo); setSelectedId(null); }} className={`flex-shrink-0 w-56 border cursor-pointer hover:bg-green-900/20 transition-all ${selectedNeo?.id === neo.id ? 'border-green-400 bg-green-900/30' : (neo.isHazardous ? 'border-red-900/50 bg-red-900/10' : 'border-green-900/30')} rounded p-2 flex flex-col gap-1`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-bold ${neo.isHazardous ? 'text-red-400' : 'text-green-300'}`}>{neo.name}</span>
                                            {neo.isHazardous && <AlertTriangle size={10} className="text-red-500 animate-pulse" />}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-green-600">
                                            <div>{(parseInt(neo.missDistance) / 1000000).toFixed(1)}M km</div>
                                            <div>{(parseInt(neo.velocity)).toLocaleString()} km/h</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                spaceWeather.length === 0 ? <div className="text-xs text-green-800">{t('sat.no_alerts')}</div> :
                                    spaceWeather.map(w => (
                                        <div key={w.id} className="flex-shrink-0 w-64 border border-green-900/30 bg-green-900/5 rounded p-2 flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-green-300">{w.type} {t('sat.alert')}</span>
                                                <span className="text-[9px] text-green-700">{new Date(w.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-[9px] text-green-600 opacity-80 truncate">{w.note}</div>
                                            <a href={w.link} target="_blank" rel="noreferrer" className="text-[9px] text-green-500 hover:text-white underline">{t('sat.read_report')}</a>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
