import { useState, useEffect } from 'react';
import {
    Globe, Settings, List, Crosshair, Eye, Database, ShieldAlert,
    ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useMissions } from '../contracts/MissionsContext';
import CyberGlobe3D from './components/CyberGlobe3D';
import { SettingsModal, SensorFeedModal, TelemetryModal, CatalogModal } from './components/Modals';
import { SatelliteData, NEOData, SpaceWeather, ObjectType } from './types';
import { CATEGORY_COLORS, DEFAULT_API_KEY, NASA_BASE_URL, EONET_URL } from './constants';
import fallbackData from './data/fallbackData.json';

export default function SatUplink() {
    const { activeMission } = useMissions();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedNeo, setSelectedNeo] = useState<NEOData | null>(null);
    const [filters, setFilters] = useState<ObjectType[]>(['CIVIL', 'MILITARY', 'DEBRIS', 'STATION', 'TELESCOPE', 'WILDFIRE', 'STORM']);
    const [modalType, setModalType] = useState<'SENSOR' | 'CATALOG' | 'TELEMETRY' | 'SETTINGS' | 'APOD' | null>(null);
    const [neos, setNeos] = useState<NEOData[]>([]);
    const [spaceWeather, setSpaceWeather] = useState<SpaceWeather[]>([]);
    const [loadingNeos, setLoadingNeos] = useState(false);
    const [neoPage, setNeoPage] = useState(0);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('nasa_api_key') || DEFAULT_API_KEY);
    const [activeTab, setActiveTab] = useState<'NEO' | 'WEATHER'>('NEO');

    // Initialize with fallback data
    const [satellites, setSatellites] = useState<Record<string, SatelliteData>>(() => {
        const data = fallbackData.satellites as Record<string, SatelliteData>;
        console.log('[DEBUG] SatUplink: Initializing satellites from fallback:', Object.keys(data).length, 'satellites');
        return data;
    });

    const handleSetApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('nasa_api_key', key);
    };

    // Merge Mission Data
    useEffect(() => {
        if (activeMission?.moduleData?.Satellite) {
            const missionData = activeMission.moduleData.Satellite;
            if (missionData.satellites) {
                console.log('[DEBUG] SatUplink: Merging mission data:', Object.keys(missionData.satellites).length);
                setSatellites(prev => ({ ...prev, ...missionData.satellites }));
            }
        }
    }, [activeMission]);

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
                console.log(`[DEBUG] SatUplink: EONET data processed. Hazards: ${Object.keys(newHazards).length}`);
                setSatellites(prev => ({ ...prev, ...newHazards }));
            } catch (e) { console.log("[DEBUG] SatUplink: EONET Fetch failed, using fallback", e); }
        };
        fetchEvents();
    }, []);

    // 2. DONKI Integration (Space Weather)
    useEffect(() => {
        const fetchWeather = async () => {
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
                console.log(`[DEBUG] SatUplink: DONKI data received. Weather events: ${weather.length}`);
                setSpaceWeather(weather);
            } catch (e) {
                console.log("[DEBUG] SatUplink: DONKI Fetch failed, using fallback", e);
                setSpaceWeather(fallbackData.spaceWeather as SpaceWeather[]);
            }
        };
        fetchWeather();
    }, [apiKey]);

    // 3. NeoWs Integration (Asteroids)
    useEffect(() => {
        const fetchNEOs = async () => {
            setLoadingNeos(true);
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
                setNeos(processed);
            } catch (e) {
                setNeos(fallbackData.neos as NEOData[]);
            } finally {
                setLoadingNeos(false);
            }
        };
        fetchNEOs();
    }, [apiKey]);

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

    return (
        <div className="w-full h-full bg-[#020403] text-emerald-500 font-sans selection:bg-emerald-900 selection:text-white overflow-hidden flex">

            {modalType === 'SENSOR' && (selectedSat || neoAsSat) && (
                <SensorFeedModal satellite={selectedSat || neoAsSat!} onClose={() => setModalType(null)} apiKey={apiKey} />
            )}
            {modalType === 'CATALOG' && (
                <CatalogModal onClose={() => setModalType(null)} onTrack={(id) => { setSelectedId(id); setSelectedNeo(null); }} satellites={satellites} />
            )}
            {modalType === 'TELEMETRY' && <TelemetryModal onClose={() => setModalType(null)} />}
            {modalType === 'SETTINGS' && <SettingsModal onClose={() => setModalType(null)} apiKey={apiKey} setApiKey={handleSetApiKey} />}

            {/* CENTER + RIGHT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#020403]">
                <header className="h-16 border-b border-emerald-900/30 flex items-center justify-between px-6 bg-[#030605] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Globe className="w-6 h-6 text-emerald-400 animate-pulse" />
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-wider text-emerald-100 leading-none">SAT UPLINK</h1>
                            <span className="text-[9px] text-emerald-700 tracking-[0.2em]">ORBITAL NEXUS v10.1</span>
                        </div>
                        <div className="h-4 w-px bg-emerald-900/50 mx-2"></div>
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                        <h2 className="text-sm font-medium tracking-widest text-emerald-400">LIVE TRACKING // {Object.keys(satellites).length} ASSETS ACTIVE</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setModalType('SETTINGS')} className="p-2 hover:bg-emerald-900/30 rounded text-emerald-400"><Settings size={16} /></button>
                        <button onClick={() => setModalType('CATALOG')} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/20 border border-emerald-900/50 rounded text-xs font-bold text-emerald-400"><List size={14} /> CATALOG</button>
                    </div>
                </header>

                {/* WORKSPACE */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* GLOBE */}
                    <div className="flex-1 relative p-4 flex flex-col min-w-0">
                        <div className="flex-1 border border-emerald-900/30 rounded-lg relative overflow-hidden bg-[#030504]">
                            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm p-3 rounded border border-emerald-900/30">
                                <h3 className="text-[10px] font-bold text-emerald-600 mb-2">LAYER_VISIBILITY</h3>
                                <div className="space-y-1 text-[10px] font-mono select-none">
                                    {['CIVIL', 'MILITARY', 'TELESCOPE', 'STATION', 'DEBRIS', 'WILDFIRE', 'STORM'].map(t => (
                                        <div key={t} onClick={() => setFilters(p => p.includes(t as any) ? p.filter(f => f !== t) : [...p, t as any])} className={`flex items-center gap-2 cursor-pointer ${filters.includes(t as any) ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t] || '#fff' }}></div>{t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute inset-0">
                                <CyberGlobe3D filters={filters} onObjectSelect={(id) => { setSelectedId(id); setSelectedNeo(null); }} selectedId={selectedId} satellites={satellites} />
                            </div>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-emerald-700 bg-black/40 px-2 rounded pointer-events-none">
                                MIDDLE MOUSE DRAG: ROTATE // CLICK: SELECT // SCROLL: ZOOM
                            </div>
                        </div>
                    </div>

                    {/* DETAILS PANEL */}
                    <div className="w-80 flex-shrink-0 border-l border-emerald-900/30 bg-[#030605] flex flex-col p-4 gap-4 overflow-y-auto z-10">
                        <div className="border border-emerald-900/30 rounded p-4 bg-[#040806] min-h-[220px]">
                            <h3 className="text-xs font-bold text-emerald-600 mb-4 border-b border-emerald-900/30 pb-2 flex justify-between">
                                TARGET_ANALYSIS {(selectedId || selectedNeo) && <span className="animate-pulse text-emerald-400">● LOCKED</span>}
                            </h3>

                            {selectedSat ? (
                                <>
                                    <div className="text-sm font-bold text-emerald-100 mb-1">{selectedSat.name}</div>
                                    <div className="text-[10px] text-emerald-600 mb-4 italic">{selectedSat.description}</div>
                                    <div className="space-y-2 text-[11px] font-mono text-emerald-500 bg-emerald-900/5 p-2 rounded">
                                        <div className="flex justify-between"><span className="opacity-60">OWNER:</span> <span className="text-emerald-300">{selectedSat.owner}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">TYPE:</span> <span>{selectedSat.type}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">ALT:</span> <span>{selectedSat.alt}</span></div>
                                    </div>
                                </>
                            ) : selectedNeo ? (
                                <>
                                    <div className="text-sm font-bold text-red-100 mb-1">{selectedNeo.name}</div>
                                    <div className="text-[10px] text-red-400 mb-4 italic">Potentially Hazardous Asteroid.</div>
                                    <div className="space-y-2 text-[11px] font-mono text-red-500 bg-red-900/10 p-2 rounded">
                                        <div className="flex justify-between"><span className="opacity-60">MISS DIST:</span> <span>{selectedNeo.missDistance} km</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">VELOCITY:</span> <span>{selectedNeo.velocity} km/h</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">MAG:</span> <span>{selectedNeo.magnitude}</span></div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-emerald-800 opacity-50 py-10">
                                    <Crosshair className="w-10 h-10 mb-2" />
                                    <span className="text-xs">SELECT ASSET OR ASTEROID</span>
                                </div>
                            )}
                        </div>

                        <div className={`border border-emerald-900/30 rounded p-4 bg-[#040806] ${(!selectedSat && !selectedNeo) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <h3 className="text-xs font-bold text-emerald-600 mb-3 border-b border-emerald-900/30 pb-2">AVAILABLE_ACTIONS</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => setModalType('SENSOR')} className="w-full py-2 px-3 text-xs font-bold border border-emerald-900/50 bg-emerald-900/10 text-emerald-400 hover:bg-emerald-900/30 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> {selectedNeo ? 'VISUAL TRACKING' : 'ACTIVATE SENSOR'}</span><span className="text-[9px] border border-emerald-800 px-1">EXE</span>
                                </button>
                                <button onClick={() => setModalType('TELEMETRY')} className="w-full py-2 px-3 text-xs font-bold border border-emerald-900/50 bg-emerald-900/10 text-emerald-400 hover:bg-emerald-900/30 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Database className="w-3 h-3" /> DOWNLOAD TELEMETRY</span><span className="text-[9px] border border-emerald-800 px-1">EXE</span>
                                </button>
                                {selectedSat?.type === 'MILITARY' && (
                                    <button className="w-full py-2 px-3 text-xs font-bold border border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/30 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><ShieldAlert className="w-3 h-3" /> SIGNAL JAMMER</span><span className="text-[9px] border border-red-800 px-1">EXE</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* EVENT HORIZON */}
                <div className="h-40 border-t border-emerald-900/30 bg-[#030504] p-4 relative flex flex-col flex-shrink-0 z-20">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-4 items-center">
                            <h3 className="text-xs font-bold text-emerald-600">EVENT_HORIZON //</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveTab('NEO')} className={`text-[10px] px-2 py-0.5 rounded ${activeTab === 'NEO' ? 'bg-emerald-600 text-black' : 'border border-emerald-900/50 text-emerald-600'}`}>NEO WATCH</button>
                                <button onClick={() => setActiveTab('WEATHER')} className={`text-[10px] px-2 py-0.5 rounded ${activeTab === 'WEATHER' ? 'bg-emerald-600 text-black' : 'border border-emerald-900/50 text-emerald-600'}`}>SPACE WEATHER</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] text-emerald-800 font-mono">DATA SOURCE: NASA API</span>
                            {activeTab === 'NEO' && (
                                <div className="flex gap-1">
                                    <button onClick={() => setNeoPage(p => Math.max(0, p - 1))} disabled={neoPage === 0} className="p-1 hover:bg-emerald-900/30 disabled:opacity-30 rounded"><ChevronLeft size={14} /></button>
                                    <span className="text-[10px] font-mono w-12 text-center">{neoPage + 1} / {maxPage + 1}</span>
                                    <button onClick={() => setNeoPage(p => Math.min(maxPage, p + 1))} disabled={neoPage === maxPage} className="p-1 hover:bg-emerald-900/30 disabled:opacity-30 rounded"><ChevronRight size={14} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <div className="flex gap-4 h-full items-center">
                            {activeTab === 'NEO' ? (
                                loadingNeos ? (
                                    <div className="text-xs font-mono animate-pulse text-emerald-700">SCANNING DEEP SPACE NETWORK...</div>
                                ) : visibleNeos.map(neo => (
                                    <div key={neo.id} onClick={() => { setSelectedNeo(neo); setSelectedId(null); }} className={`flex-shrink-0 w-56 border cursor-pointer hover:bg-emerald-900/20 transition-all ${selectedNeo?.id === neo.id ? 'border-emerald-400 bg-emerald-900/30' : (neo.isHazardous ? 'border-red-900/50 bg-red-900/10' : 'border-emerald-900/30')} rounded p-2 flex flex-col gap-1`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-bold ${neo.isHazardous ? 'text-red-400' : 'text-emerald-300'}`}>{neo.name}</span>
                                            {neo.isHazardous && <AlertTriangle size={10} className="text-red-500 animate-pulse" />}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-emerald-600">
                                            <div>{(parseInt(neo.missDistance) / 1000000).toFixed(1)}M km</div>
                                            <div>{(parseInt(neo.velocity)).toLocaleString()} km/h</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                spaceWeather.length === 0 ? <div className="text-xs text-emerald-800">NO ACTIVE ALERTS FROM DONKI...</div> :
                                    spaceWeather.map(w => (
                                        <div key={w.id} className="flex-shrink-0 w-64 border border-emerald-900/30 bg-emerald-900/5 rounded p-2 flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-emerald-300">{w.type} ALERT</span>
                                                <span className="text-[9px] text-emerald-700">{new Date(w.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-[9px] text-emerald-600 opacity-80 truncate">{w.note}</div>
                                            <a href={w.link} target="_blank" rel="noreferrer" className="text-[9px] text-emerald-500 hover:text-white underline">READ REPORT</a>
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
