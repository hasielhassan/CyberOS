import { useState, useEffect, useMemo } from 'react';
import { Camera, Settings, MapPin, Loader, Info, Filter, X } from 'lucide-react';
import { getCams } from './cams_data';
import { useMissions } from '../missions/MissionsContext';
import { useLanguage } from '../../core/registry';

// Types
interface CamFeed {
    id: string;
    url: string;
    name: string;
    location: string;
    category: string;
    description: string;
    isLive: boolean;
    player?: {
        day: string;
        month: string;
        year: string;
        lifetime: string;
    };
}

interface FilterOption {
    id: string;
    name: string;
}

const CamGrid = () => {
    const { t } = useLanguage();
    const [apiKey, setApiKey] = useState(localStorage.getItem('windy_api_key') || '');
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(false);
    const [useLive, setUseLive] = useState(localStorage.getItem('surveillance_use_live') === 'true');
    const [liveCams, setLiveCams] = useState<CamFeed[]>([]);
    const [liveError, setLiveError] = useState<string | null>(null);
    const [selectedCam, setSelectedCam] = useState<CamFeed | null>(null);
    const [playerTime, setPlayerTime] = useState<'day' | 'month' | 'year' | 'lifetime'>('day');

    // Filtering & Pagination
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [activeLocation, setActiveLocation] = useState('ALL'); // Country ID
    const [offset, setOffset] = useState(0);
    const LIMIT = 16;

    // Dynamic Filter Options
    const [apiCategories, setApiCategories] = useState<FilterOption[]>([]);
    const [apiCountries, setApiCountries] = useState<FilterOption[]>([]);

    const { activeMission } = useMissions();

    // Process Fallback Data
    const fallbackCams: CamFeed[] = useMemo(() => {
        let missionCams: CamFeed[] = [];
        if (activeMission && activeMission.moduleData?.Surveillance?.cams) {
            missionCams = activeMission.moduleData.Surveillance.cams.map((cam: any) => ({
                ...cam,
                isLive: false
            }));
        }

        const camsData = getCams(t);
        const defaultCams = camsData.map((cam, i) => ({
            id: `FB_${i}`,
            url: cam.url,
            name: cam.name,
            location: cam.location,
            category: cam.category,
            description: cam.description,
            isLive: false
        }));

        return [...missionCams, ...defaultCams];
    }, [activeMission, t]);

    // Persist useLive state
    useEffect(() => {
        localStorage.setItem('surveillance_use_live', String(useLive));
    }, [useLive]);

    // Fetch Filter Options on Init (if API key exists)
    useEffect(() => {
        if (apiKey && useLive) {
            fetchFilterOptions();
        }
    }, [apiKey, useLive]);

    const fetchFilterOptions = async () => {
        try {
            const baseUrl = import.meta.env.DEV ? '/api/windy' : 'https://api.windy.com';
            const headers = { 'x-windy-api-key': apiKey };

            const [catRes, countryRes] = await Promise.all([
                fetch(`${baseUrl}/webcams/api/v3/categories?lang=en`, { headers }),
                fetch(`${baseUrl}/webcams/api/v3/countries?lang=en`, { headers })
            ]);

            if (catRes.ok) {
                const cats = await catRes.json();
                setApiCategories(cats.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            }
            if (countryRes.ok) {
                const countries = await countryRes.json();
                // Map API response to FilterOption (API likely uses 'code' or 'id')
                const mappedCountries = countries.map((c: any) => ({
                    id: c.id || c.code, // Handle potential missing 'id'
                    name: c.name
                }));
                setApiCountries(mappedCountries.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            }

        } catch (err) {
            console.error("Failed to fetch filter options", err);
        }
    };

    // Reset offset when filters change
    useEffect(() => {
        setOffset(0);
    }, [activeCategory, activeLocation]);

    // Fetch Live Cams
    useEffect(() => {
        if (useLive && apiKey) {
            fetchLiveCams();
        } else {
            setLiveError(null);
        }
    }, [useLive, apiKey, activeCategory, activeLocation, offset]);

    const fetchLiveCams = async () => {
        setLoading(true);
        setLiveError(null);
        try {
            const baseUrl = import.meta.env.DEV ? '/api/windy' : 'https://api.windy.com';

            // Build Query Params
            const params = new URLSearchParams({
                limit: String(LIMIT),
                offset: String(offset),
                include: 'images,location,categories,player',
            });

            if (activeCategory !== 'ALL') params.append('categories', activeCategory);
            if (activeLocation !== 'ALL') params.append('countries', activeLocation);

            const res = await fetch(`${baseUrl}/webcams/api/v3/webcams?${params.toString()}`, {
                headers: { 'x-windy-api-key': apiKey }
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error(t('surv.err.invalid_key'));
                if (res.status === 403) throw new Error(t('surv.err.access_denied'));
                if (res.status === 429) throw new Error(t('surv.err.rate_limit'));
                throw new Error(t('surv.err.api_error', { status: String(res.status) }));
            }

            const data = await res.json();
            if (data.webcams) {
                const mappedCams: CamFeed[] = data.webcams.map((cam: any) => ({
                    id: cam.webcamId,
                    url: cam.images?.current?.preview || cam.images?.current?.thumbnail || '',
                    name: cam.title,
                    location: `${cam.location?.city || 'Unknown'}, ${cam.location?.country || ''}`,
                    category: cam.categories?.[0]?.name || 'Live Feed',
                    description: `Live feed from ${cam.title}. Status: ${cam.status || 'Active'}.`,
                    isLive: true,
                    player: cam.player ? {
                        day: cam.player.day,
                        month: cam.player.month,
                        year: cam.player.year,
                        lifetime: cam.player.lifetime
                    } : undefined
                })).filter((c: CamFeed) => c.url !== '');

                setLiveCams(mappedCams);
            } else {
                setLiveCams([]); // Clear cams if no results
            }
        } catch (err: any) {
            console.error("Failed to fetch cams", err);
            setLiveError(t('surv.err.connection_failed', { error: err.message || 'UNKNOWN ERROR' }));
        }
        setLoading(false);
    };

    const saveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('windy_api_key', key);
    };

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next') setOffset(prev => prev + LIMIT);
        if (direction === 'prev') setOffset(prev => Math.max(0, prev - LIMIT));
    };

    // Combined Data Source
    const displayCams = useLive && !liveError ? liveCams : fallbackCams;

    // Filter Logic (Only for Fallback data)
    const filteredCams = useMemo(() => {
        if (useLive) return displayCams;

        return displayCams.filter(cam => {
            const matchCat = activeCategory === 'ALL' || cam.category === activeCategory;
            const matchLoc = activeLocation === 'ALL' || cam.location.includes(activeLocation);
            return matchCat && matchLoc;
        });
    }, [displayCams, activeCategory, activeLocation, useLive]);

    // Fallback Filters
    const fallbackCategories = useMemo(() => ['ALL', ...new Set(fallbackCams.map(c => c.category))].sort(), [fallbackCams]);
    const fallbackLocations = useMemo(() => ['ALL', ...new Set(fallbackCams.map(c => c.location.split(',')[0]))].sort(), [fallbackCams]);

    return (
        <div className="h-full flex flex-col p-2 gap-2 relative">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-black/60 border border-green-900 p-2 shrink-0">
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                    <Camera size={16} /> {t('surv.grid_title')}
                    {liveError && <span className="text-[10px] text-red-500 animate-pulse ml-2">[{liveError}]</span>}
                </div>
                <div className="flex gap-2 items-center">
                    {useLive && (
                        <div className="flex items-center gap-1 mr-2">
                            <button onClick={() => handlePageChange('prev')} disabled={offset === 0} className="px-2 py-1 border border-green-900 text-green-500 disabled:opacity-30 hover:bg-green-900/30 text-[10px]">{t('surv.prev')}</button>
                            <span className="text-[10px] text-green-700">{t('surv.page')} {Math.floor(offset / LIMIT) + 1}</span>
                            <button onClick={() => handlePageChange('next')} className="px-2 py-1 border border-green-900 text-green-500 hover:bg-green-900/30 text-[10px]">{t('surv.next')}</button>
                        </div>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-2 py-1 text-[10px] border flex items-center gap-1 ${showFilters ? 'bg-green-900/40 border-green-500 text-green-400' : 'border-green-900 text-green-700'}`}
                    >
                        <Filter size={10} /> {t('surv.filters')}
                    </button>
                    <button
                        onClick={() => setUseLive(!useLive)}
                        className={`px-2 py-1 text-[10px] border ${useLive ? 'bg-red-900/50 border-red-500 text-red-500' : 'bg-green-900/20 border-green-700 text-green-700'}`}
                    >
                        {useLive ? t('surv.live_feed') : t('surv.simulation')}
                    </button>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:text-green-400">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden gap-2 relative">

                {/* Filter Panel (Side) */}
                {showFilters && (
                    <div className="w-48 bg-black/90 border-r border-green-900 flex flex-col p-2 gap-4 backdrop-blur-sm z-10 transition-all h-full">
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className="text-[10px] font-bold text-green-500 mb-1 shrink-0">{t('surv.category')}</h3>
                            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 border-b border-green-900/30 pb-2 mb-2">
                                <button
                                    onClick={() => setActiveCategory('ALL')}
                                    className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeCategory === 'ALL' ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                >
                                    {t('surv.all')}
                                </button>
                                {useLive ? (
                                    apiCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeCategory === cat.id ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))
                                ) : (
                                    fallbackCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeCategory === cat ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className="text-[10px] font-bold text-green-500 mb-1 shrink-0">{t('surv.location_country')}</h3>
                            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                                <button
                                    onClick={() => setActiveLocation('ALL')}
                                    className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeLocation === 'ALL' ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                >
                                    {t('surv.all')}
                                </button>
                                {useLive ? (
                                    apiCountries.map(loc => (
                                        <button
                                            key={loc.id}
                                            onClick={() => setActiveLocation(loc.id)}
                                            className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeLocation === loc.id ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                        >
                                            {loc.name}
                                        </button>
                                    ))
                                ) : (
                                    fallbackLocations.map(loc => (
                                        <button
                                            key={loc}
                                            onClick={() => setActiveLocation(loc)}
                                            className={`text-[9px] text-left px-2 py-1 border shrink-0 ${activeLocation === loc ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                        >
                                            {loc}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 overflow-y-auto custom-scrollbar relative">
                    {loading && (
                        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
                            <div className="text-green-500 flex flex-col items-center gap-2">
                                <Loader className="animate-spin" />
                                <span className="text-xs animate-pulse">{t('surv.establishing')}</span>
                            </div>
                        </div>
                    )}

                    {filteredCams.map((cam) => (
                        <div key={cam.id} className="relative border border-green-900/50 bg-black group overflow-hidden w-full h-0 pb-[56.25%]">
                            {/* Image */}
                            <img
                                src={cam.url}
                                alt={cam.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity filter sepia-[.5] hue-rotate-[50deg]"
                            />

                            {/* Scanlines */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>

                            {/* Info Button */}
                            <button
                                onClick={() => setSelectedCam(cam)}
                                className="absolute top-1 right-1 z-20 text-green-700 hover:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Info size={14} />
                            </button>

                            {/* Metadata Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/80 p-1 flex justify-between items-center border-t border-green-900/50">
                                <div className="overflow-hidden">
                                    <div className="text-[9px] font-bold text-green-400 truncate">{cam.name}</div>
                                    <div className="text-[8px] text-green-700 flex items-center gap-1 truncate">
                                        <MapPin size={8} /> {cam.location}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[8px] text-red-500 font-bold">{t('surv.rec')}</span>
                                </div>
                            </div>

                            {/* Corner Markers */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/50 z-10"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500/50 z-10"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute top-12 right-2 z-30 bg-black border border-green-500 p-4 w-64 shadow-lg">
                    <h3 className="text-xs font-bold mb-2 text-green-400">{t('surv.api_config')}</h3>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => saveKey(e.target.value)}
                        placeholder={t('surv.enter_key')}
                        className="w-full bg-green-900/20 border border-green-700 p-2 text-[10px] text-green-400 mb-2"
                    />
                    <div className="text-[9px] text-green-700">
                        {t('surv.get_key')}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="mt-2 w-full bg-green-900/30 border border-green-600 text-[10px] py-1 hover:bg-green-500 hover:text-black">
                        {t('surv.close')}
                    </button>
                </div>
            )}

            {/* Info/Player Modal */}
            {selectedCam && (
                <div className="absolute inset-0 z-40 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-black border border-green-500 p-4 max-w-4xl w-full relative shadow-[0_0_20px_rgba(0,255,65,0.2)] flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => setSelectedCam(null)}
                            className="absolute top-2 right-2 text-green-700 hover:text-green-400 z-50"
                        >
                            <X size={16} />
                        </button>

                        {/* Player Section */}
                        <div className="w-full md:w-2/3 flex flex-col gap-2">
                            <div className="aspect-video border border-green-900 bg-black relative overflow-hidden">
                                {selectedCam.isLive && selectedCam.player ? (
                                    <iframe
                                        src={selectedCam.player[playerTime]}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <img src={selectedCam.url} className="w-full h-full object-cover filter sepia-[.5] hue-rotate-[50deg]" />
                                )}
                            </div>

                            {/* Player Controls */}
                            {selectedCam.isLive && selectedCam.player && (
                                <div className="flex gap-2 justify-center">
                                    {['day', 'month', 'year', 'lifetime'].map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setPlayerTime(time as any)}
                                            className={`px-3 py-1 text-[10px] border ${playerTime === time ? 'bg-green-500 text-black border-green-500' : 'border-green-900 text-green-600 hover:border-green-700'}`}
                                        >
                                            {time.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 flex flex-col">
                            <h2 className="text-lg font-bold text-green-400 mb-1">{selectedCam.name}</h2>
                            <div className="text-xs text-green-600 mb-4 flex items-center gap-1">
                                <MapPin size={10} /> {selectedCam.location}
                            </div>

                            <div className="space-y-2 text-xs font-code flex-1">
                                <div className="flex justify-between border-b border-green-900/50 pb-1">
                                    <span className="text-green-700">{t('surv.category')}</span>
                                    <span className="text-green-300">{selectedCam.category}</span>
                                </div>
                                <div className="flex justify-between border-b border-green-900/50 pb-1">
                                    <span className="text-green-700">STATUS:</span>
                                    <span className="text-green-300">{selectedCam.isLive ? t('surv.status.live') : t('surv.status.archived')}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-green-700 block mb-1">{t('surv.description')}</span>
                                    <p className="text-green-400 leading-relaxed">{selectedCam.description}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-[9px] text-green-800 border-t border-green-900 pt-2">
                                {t('surv.data_source')}<br />
                                {t('surv.encryption')}<br />
                                {t('surv.uplink_secure')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CamGrid;
