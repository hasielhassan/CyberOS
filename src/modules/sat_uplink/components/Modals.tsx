import { useState, useEffect, useRef } from 'react';
import { X, Key, Activity, Aperture, Globe, Search, Crosshair } from 'lucide-react';
import { SatelliteData, ObjectType } from '../types';
import { NASA_BASE_URL, IMAGE_ASSETS, CATEGORY_COLORS } from '../constants';

// --- GENERIC MODAL ---
export const Modal = ({ title, onClose, children, danger = false, wide = false, full = false }: any) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className={`w-full ${full ? 'h-full max-h-[90vh]' : ''} ${wide || full ? 'max-w-4xl' : 'max-w-md'} bg-[#030605] border ${danger ? 'border-red-900/60 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-emerald-900/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]'} rounded-lg overflow-hidden flex flex-col`}>
            <div className={`px-4 py-3 border-b ${danger ? 'border-red-900/30 bg-red-900/10' : 'border-emerald-900/30 bg-emerald-900/10'} flex justify-between items-center flex-shrink-0`}>
                <h3 className={`font-mono text-sm font-bold ${danger ? 'text-red-400' : 'text-emerald-400'}`}>{title}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-0 flex-1 overflow-auto bg-black/50">
                {children}
            </div>
        </div>
    </div>
);

// --- SETTINGS MODAL ---
export const SettingsModal = ({ onClose, apiKey, setApiKey }: { onClose: () => void, apiKey: string, setApiKey: (key: string) => void }) => {
    const [inputKey, setInputKey] = useState(apiKey);
    return (
        <Modal title="SYSTEM CONFIGURATION // API KEYS" onClose={onClose}>
            <div className="p-6 space-y-4">
                <div className="text-xs text-emerald-500 font-mono">
                    Valid API key required for real-time Deep Space Network telemetry.
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-600 tracking-wider">NASA OPEN API KEY</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Key className="absolute left-3 top-2.5 w-4 h-4 text-emerald-700" />
                            <input
                                type="text"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                className="w-full bg-black border border-emerald-900/50 pl-10 pr-4 py-2 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500 rounded font-mono"
                                placeholder="DEMO_KEY"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-emerald-900/10 border border-emerald-900/30 rounded text-[10px] text-emerald-400 leading-relaxed">
                    Don't have a key? <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className="underline text-emerald-300 hover:text-white">Generate one here</a>.
                    <br />Using 'DEMO_KEY' has strict limits (30 req/hour) and may cause data failures.
                </div>
                <button onClick={() => { setApiKey(inputKey); onClose(); }} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition-colors">
                    SAVE CONFIGURATION
                </button>
            </div>
        </Modal>
    );
};

// --- SENSOR FEED MODAL ---
export const SensorFeedModal = ({ onClose, satellite, apiKey }: { onClose: () => void, satellite: SatelliteData, apiKey: string }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [target, setTarget] = useState<string>(satellite.supportedTargets[0]);
    const [mode, setMode] = useState<'OPTICAL' | 'INFRARED' | 'RADAR' | 'EPIC'>('OPTICAL');
    const [meta, setMeta] = useState<string>('');

    const executeCapture = async () => {
        setLoading(true);
        setImageUrl(null);
        setMeta('');

        try {
            if (mode === 'EPIC') {
                const res = await fetch(`${NASA_BASE_URL}/EPIC/api/natural/images?api_key=${apiKey}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    const img = data[0];
                    const date = img.date.split(' ')[0].replaceAll('-', '/');
                    const url = `https://api.nasa.gov/EPIC/archive/natural/${date}/png/${img.image}.png?api_key=${apiKey}`;
                    setImageUrl(url);
                    setMeta(`DSCOVR SATELLITE // ${img.date}`);
                } else { throw new Error("No EPIC data"); }
            } else if (satellite.type === 'TELESCOPE' || satellite.apiQueryType === 'SPACE') {
                const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(target)}&media_type=image`);
                const data = await res.json();
                const items = data.collection.items;
                if (items.length > 0) {
                    setImageUrl(items[0].links[0].href);
                    setMeta(items[0].data[0].title);
                } else { throw new Error("No NASA Library data"); }
            } else {
                // Fallback static dictionary or satellite specific image
                await new Promise(r => setTimeout(r, 1000));
                const fallback = satellite.imageUrl || IMAGE_ASSETS[target.toUpperCase()] || IMAGE_ASSETS['DEFAULT_EARTH'];
                setImageUrl(fallback);
                setMeta(`TARGET: ${target.toUpperCase()}`);
            }
        } catch (e) {
            console.log("Sensor Feed Error, using fallback", e);
            const fallback = satellite.imageUrl || (satellite.apiQueryType === 'SPACE' ? IMAGE_ASSETS['DEFAULT_SPACE'] : IMAGE_ASSETS['DEFAULT_EARTH']);
            setImageUrl(fallback);
            setMeta("SIGNAL DEGRADED // ARCHIVE FOOTAGE");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title={`SENSOR FEED LINK // ${satellite.name}`} onClose={onClose} wide>
            <div className="flex flex-col md:flex-row gap-4 h-full p-6">
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="p-3 bg-emerald-900/10 border border-emerald-900/30 rounded">
                        <div className="text-[10px] text-emerald-600 font-bold mb-2">TARGETING_PARAMETERS</div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[9px] text-emerald-500 block mb-1">PRIMARY TARGET</label>
                                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-black border border-emerald-900/50 text-emerald-400 text-xs p-2 rounded focus:outline-none focus:border-emerald-500">
                                    {satellite.supportedTargets.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] text-emerald-500 block mb-1">SENSOR MODE</label>
                                <div className="grid grid-cols-2 gap-1">
                                    {['OPTICAL', 'INFRARED', 'RADAR', 'EPIC'].map(m => (
                                        <button key={m} onClick={() => setMode(m as any)} className={`text-[9px] border py-1 transition-all ${mode === m ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-600 border-emerald-900/30 hover:border-emerald-500'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={executeCapture} disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-2">
                        {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Aperture className="w-4 h-4" />}
                        {loading ? 'ACQUIRING SIGNAL...' : 'EXECUTE CAPTURE'}
                    </button>
                </div>
                <div className="w-full md:w-2/3 aspect-video bg-black border border-emerald-900/30 relative overflow-hidden flex items-center justify-center rounded group">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 border-4 border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin"></div>
                            <div className="text-xs font-mono text-emerald-500 animate-pulse mt-2">DECRYPTING DOWNLINK...</div>
                        </div>
                    ) : imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Satellite Feed" className={`w-full h-full object-cover transition-all duration-500 ${mode === 'INFRARED' ? 'contrast-[1.5] brightness-75 hue-rotate-180 invert sepia' : ''}`} />
                            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 animate-pulse">LIVE FEED</div>
                                    <div className="text-[10px] font-mono text-emerald-400 bg-black/60 px-1">{meta}</div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                    <div className="w-24 h-24 border border-emerald-400/50 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div></div>
                                    <div className="w-full h-px bg-emerald-400/20 absolute"></div>
                                    <div className="h-full w-px bg-emerald-400/20 absolute"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-10"></div>
                        </>
                    ) : (
                        <div className="text-center opacity-30">
                            <Globe className="w-16 h-16 mx-auto mb-2" />
                            <div className="text-xs font-mono">WAITING FOR TARGET ASSIGNMENT</div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// --- TELEMETRY MODAL ---
export const TelemetryModal = ({ onClose }: { onClose: () => void }) => {
    const [lines, setLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const hex = Array(4).fill(0).map(() => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')).join(' ');
            setLines(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] RECV: ${hex}`]);
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <Modal title="RAW TELEMETRY STREAM" onClose={onClose}>
            <div className="flex flex-col h-full bg-black p-4 font-mono text-xs">
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 text-emerald-500 mb-4 h-64 border border-emerald-900/30 p-2">
                    {lines.map((l, i) => <div key={i}>{l}</div>)}
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 rounded hover:bg-emerald-500 hover:text-black transition-colors">PAUSE STREAM</button>
                    <button className="flex-1 py-2 bg-emerald-600 text-black font-bold rounded hover:bg-emerald-500 transition-colors">DECRYPT LOGS</button>
                </div>
            </div>
        </Modal>
    );
}

// --- CATALOG MODAL ---
export const CatalogModal = ({ onClose, onTrack, satellites }: { onClose: () => void, onTrack: (id: string) => void, satellites: Record<string, SatelliteData> }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<ObjectType | 'ALL'>('ALL');

    const filtered = Object.values(satellites).filter(sat => {
        const matchesSearch = sat.name.toLowerCase().includes(search.toLowerCase()) || sat.owner.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || sat.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <Modal title="GLOBAL ASSET DATABASE" onClose={onClose} full>
            <div className="flex flex-col h-full gap-4 p-6">
                <div className="flex flex-col md:flex-row gap-4 p-4 bg-emerald-900/10 border border-emerald-900/30 rounded">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
                        <input type="text" placeholder="SEARCH ID, NAME, OR OWNER..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black border border-emerald-900/50 pl-10 pr-4 py-2 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500 rounded" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {['ALL', 'CIVIL', 'MILITARY', 'TELESCOPE', 'STATION', 'DEBRIS', 'WILDFIRE', 'STORM'].map(f => (
                            <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-2 text-[10px] font-bold border rounded transition-colors ${filter === f ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-600 border-emerald-900/50 hover:border-emerald-500'}`}>{f}</button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-emerald-600 px-4 border-b border-emerald-900/30 pb-2">
                    <div className="col-span-3">DESIGNATION</div>
                    <div className="col-span-2">TYPE</div>
                    <div className="col-span-2">OWNER</div>
                    <div className="col-span-2">ORBIT</div>
                    <div className="col-span-3 text-right">ACTION</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                    {filtered.map(sat => (
                        <div key={sat.id} className="grid grid-cols-12 gap-2 p-3 bg-black/40 border border-emerald-900/20 hover:border-emerald-500/50 hover:bg-emerald-900/10 rounded items-center transition-all group">
                            <div className="col-span-3 font-mono text-xs text-emerald-100 font-bold">{sat.name}</div>
                            <div className="col-span-2">
                                <span className="text-[9px] px-1.5 py-0.5 border rounded" style={{
                                    color: CATEGORY_COLORS[sat.type] || '#fff',
                                    borderColor: (CATEGORY_COLORS[sat.type] || '#fff') + '80'
                                }}>
                                    {sat.type}
                                </span>
                            </div>
                            <div className="col-span-2 text-[10px] text-emerald-500">{sat.owner}</div>
                            <div className="col-span-2 text-[10px] text-emerald-600 font-mono">{sat.orbit}</div>
                            <div className="col-span-3 flex justify-end gap-2">
                                <button onClick={() => { onTrack(sat.id); onClose(); }} className="flex items-center gap-1 px-3 py-1 bg-emerald-900/20 hover:bg-emerald-500 hover:text-black text-emerald-400 border border-emerald-900/50 text-[10px] rounded transition-colors"><Crosshair size={10} /> TRACK</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
