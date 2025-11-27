import { useState, useEffect, useRef } from 'react';
import { X, Key, Activity, Aperture, Search, Crosshair, Lock, Unlock, ShieldAlert, Terminal, MapPin } from 'lucide-react';
import { SatelliteData, ObjectType } from '../types';
import { NASA_BASE_URL, IMAGE_ASSETS, CATEGORY_COLORS } from '../constants';

// --- GENERIC MODAL ---
export const Modal = ({ title, onClose, children, danger = false, wide = false, full = false }: any) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className={`w-full ${full ? 'h-full max-h-[90vh]' : ''} ${wide || full ? 'max-w-4xl' : 'max-w-md'} bg-[#030605] border ${danger ? 'border-red-900/60 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-green-900/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]'} rounded-lg overflow-hidden flex flex-col`}>
            <div className={`px-4 py-3 border-b ${danger ? 'border-red-900/30 bg-red-900/10' : 'border-green-900/30 bg-green-900/10'} flex justify-between items-center flex-shrink-0`}>
                <h3 className={`font-mono text-sm font-bold ${danger ? 'text-red-400' : 'text-green-400'}`}>{title}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-0 flex-1 overflow-auto bg-black/50">
                {children}
            </div>
        </div>
    </div>
);

// --- AUTH MODAL ---
export const AuthModal = ({ title, onClose, onSuccess, danger = false, validationKey }: { title: string, onClose: () => void, onSuccess: () => void, danger?: boolean, validationKey?: string }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validKeys = ['ADMIN', 'OVERRIDE'];
        if (validationKey) validKeys.push(validationKey);

        if (validKeys.includes(code)) {
            onSuccess();
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <Modal title={title} onClose={onClose} danger={danger}>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div className={`text-xs font-mono ${danger ? 'text-red-400' : 'text-green-400'}`}>
                    SECURE CLEARANCE REQUIRED. ENTER AUTHORIZATION CODE.
                </div>
                <div className="relative">
                    <Lock className={`absolute left-3 top-2.5 w-4 h-4 ${danger ? 'text-red-700' : 'text-green-700'}`} />
                    <input
                        autoFocus
                        type="password"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`w-full bg-black border ${error ? 'border-red-500 animate-shake' : (danger ? 'border-red-900/50' : 'border-green-900/50')} pl-10 pr-4 py-2 text-xs ${danger ? 'text-red-100 focus:border-red-500' : 'text-green-100 focus:border-green-500'} focus:outline-none rounded font-mono tracking-widest`}
                        placeholder="ACCESS CODE"
                    />
                </div>
                <button type="submit" className={`w-full py-2 ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-2`}>
                    {danger ? <ShieldAlert size={14} /> : <Unlock size={14} />}
                    AUTHENTICATE
                </button>
            </form>
        </Modal>
    );
};

// --- PROGRESS MODAL ---
export const ProgressModal = ({ title, action, duration = 3000, onComplete, danger = false }: { title: string, action: string, duration?: number, onComplete: () => void, danger?: boolean }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(onComplete, 500);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [duration, onComplete]);

    return (
        <Modal title={title} onClose={() => { }} danger={danger}>
            <div className="p-8 flex flex-col items-center gap-6">
                <div className={`relative w-24 h-24 flex items-center justify-center`}>
                    <div className={`absolute inset-0 border-4 ${danger ? 'border-red-900/30 border-t-red-500' : 'border-green-900/30 border-t-green-500'} rounded-full animate-spin`} />
                    <div className={`text-xl font-bold font-mono ${danger ? 'text-red-500' : 'text-green-500'}`}>{Math.floor(progress)}%</div>
                </div>
                <div className="w-full space-y-2">
                    <div className={`text-xs font-mono text-center ${danger ? 'text-red-400 animate-pulse' : 'text-green-400 animate-pulse'}`}>
                        {action}...
                    </div>
                    <div className={`w-full h-1 bg-gray-900 rounded-full overflow-hidden`}>
                        <div className={`h-full ${danger ? 'bg-red-600' : 'bg-green-600'} transition-all duration-75`} style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="font-mono text-[10px] text-gray-500">
                    DO NOT CLOSE TERMINAL
                </div>
            </div>
        </Modal>
    );
};

// --- RESTART MODAL ---
export const RestartModal = ({ onClose, onComplete, isMissionTarget = false }: { onClose: () => void, onComplete: () => void, isMissionTarget?: boolean }) => {
    const [stage, setStage] = useState(0);
    const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETE'>('IDLE');
    const [progress, setProgress] = useState(0);

    const STAGES = [
        { name: 'SYSTEM DIAGNOSTICS', action: 'RUN DIAGNOSTICS', duration: 2000 },
        { name: 'FIRMWARE PATCH', action: 'UPLOAD PATCH', duration: 3000 },
        { name: 'REBOOT SEQUENCE', action: 'INITIATE REBOOT', duration: 4000 }
    ];

    const runStage = () => {
        setStatus('RUNNING');
        setProgress(0);
        const duration = STAGES[stage].duration;
        const start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setProgress(p);

            if (p >= 100) {
                clearInterval(interval);
                setStatus('COMPLETE');
                if (stage === STAGES.length - 1) {
                    if (isMissionTarget) {
                        // Special success message for mission
                        setStatus('COMPLETE'); // Keep it complete to show the message
                        setTimeout(onComplete, 2000);
                    } else {
                        setTimeout(onComplete, 1000);
                    }
                } else {
                    setTimeout(() => {
                        setStage(s => s + 1);
                        setStatus('IDLE');
                        setProgress(0);
                    }, 500);
                }
            }
        }, 50);
    };

    return (
        <Modal title="SYSTEM RESTORATION SEQUENCE" onClose={onClose} wide>
            <div className="p-6 flex flex-col gap-6 h-full">
                <div className="grid grid-cols-3 gap-4">
                    {STAGES.map((s, i) => (
                        <div key={i} className={`p-3 border rounded flex flex-col items-center gap-2 transition-colors ${i === stage ? 'bg-green-900/20 border-green-500' : (i < stage ? 'bg-green-900/10 border-green-900/30 opacity-50' : 'bg-black border-gray-800 opacity-30')}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${i === stage ? 'border-green-500 text-green-500' : (i < stage ? 'bg-green-500 text-black border-green-500' : 'border-gray-700 text-gray-700')}`}>
                                {i < stage ? '✓' : i + 1}
                            </div>
                            <div className={`text-[10px] font-bold ${i === stage ? 'text-green-400' : 'text-gray-500'}`}>{s.name}</div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 bg-black border border-green-900/30 rounded p-4 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                    {status === 'RUNNING' && (
                        <div className="absolute inset-0 bg-green-900/5 flex flex-col items-center justify-center z-0">
                            <div className="w-full max-w-md space-y-2 px-8">
                                <div className="flex justify-between text-[10px] font-mono text-green-500">
                                    <span>EXECUTING {STAGES[stage].name}...</span>
                                    <span>{Math.floor(progress)}%</span>
                                </div>
                                <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="z-10 text-center space-y-4">
                        <div className="text-sm font-mono text-green-400">
                            {status === 'IDLE' ? `READY TO ${STAGES[stage].action}` : (status === 'RUNNING' ? 'PROCESSING...' : (isMissionTarget && stage === 2 ? 'ORBIT STABILIZED // MISSION OBJECTIVE COMPLETE' : 'STAGE COMPLETE'))}
                        </div>
                        {status === 'IDLE' && (
                            <button onClick={runStage} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold text-xs rounded transition-colors flex items-center gap-2 mx-auto">
                                <Activity size={14} /> {STAGES[stage].action}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// --- SETTINGS MODAL ---
export const SettingsModal = ({ onClose, apiKey, setApiKey }: { onClose: () => void, apiKey: string, setApiKey: (key: string) => void }) => {
    const [inputKey, setInputKey] = useState(apiKey);
    return (
        <Modal title="SYSTEM CONFIGURATION // API KEYS" onClose={onClose}>
            <div className="p-6 space-y-4">
                <div className="text-xs text-green-500 font-mono">
                    Valid API key required for real-time Deep Space Network telemetry.
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-green-600 tracking-wider">NASA OPEN API KEY</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Key className="absolute left-3 top-2.5 w-4 h-4 text-green-700" />
                            <input
                                type="text"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                className="w-full bg-black border border-green-900/50 pl-10 pr-4 py-2 text-xs text-green-100 focus:outline-none focus:border-green-500 rounded font-mono"
                                placeholder="DEMO_KEY"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-green-900/10 border border-green-900/30 rounded text-[10px] text-green-400 leading-relaxed">
                    Don't have a key? <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className="underline text-green-300 hover:text-white">Generate one here</a>.
                    <br />Using 'DEMO_KEY' has strict limits (30 req/hour) and may cause data failures.
                </div>
                <button onClick={() => { setApiKey(inputKey); onClose(); }} className="w-full py-2 bg-green-600 hover:bg-green-500 text-black font-bold text-xs rounded transition-colors">
                    SAVE CONFIGURATION
                </button>
            </div>
        </Modal>
    );
};

// --- SENSOR FEED MODAL ---
export const SensorFeedModal = ({ onClose, satellite, apiKey, missionImage, missionMeta }: { onClose: () => void, satellite: SatelliteData, apiKey: string, missionImage?: string, missionMeta?: string }) => {
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
            if (missionImage) {
                // Mission Override
                await new Promise(r => setTimeout(r, 1500)); // Cinematic delay
                setImageUrl(missionImage);
                setMeta(missionMeta || "MISSION TARGET IDENTIFIED");
            } else if (mode === 'EPIC') {
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
                    <div className="p-3 bg-green-900/10 border border-green-900/30 rounded">
                        <div className="text-[10px] text-green-600 font-bold mb-2">TARGETING_PARAMETERS</div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[9px] text-green-500 block mb-1">PRIMARY TARGET</label>
                                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-black border border-green-900/50 text-green-400 text-xs p-2 rounded focus:outline-none focus:border-green-500">
                                    {satellite.supportedTargets.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] text-green-500 block mb-1">SENSOR MODE</label>
                                <div className="grid grid-cols-2 gap-1">
                                    {['OPTICAL', 'INFRARED', 'RADAR', 'EPIC'].map(m => (
                                        <button key={m} onClick={() => setMode(m as any)} className={`text-[9px] border py-1 transition-all ${mode === m ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-green-600 border-green-900/30 hover:border-green-500'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={executeCapture} disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-2">
                        {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Aperture className="w-4 h-4" />}
                        {loading ? 'ACQUIRING SIGNAL...' : 'EXECUTE CAPTURE'}
                    </button>
                </div>
                <div className="w-full md:w-2/3 aspect-video bg-black border border-green-900/30 relative overflow-hidden flex items-center justify-center rounded group">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 border-4 border-green-900/30 border-t-green-500 rounded-full animate-spin"></div>
                            <div className="text-xs font-mono text-green-500 animate-pulse mt-2">DECRYPTING DOWNLINK...</div>
                        </div>
                    ) : imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Satellite Feed" className={`w-full h-full object-cover transition-all duration-500 ${mode === 'INFRARED' ? 'contrast-[1.5] brightness-75 hue-rotate-180 invert sepia' : ''}`} />
                            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 animate-pulse">LIVE FEED</div>
                                    <div className="text-[10px] font-mono text-green-400 bg-black/60 px-1">{meta}</div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                    <div className="w-24 h-24 border border-green-400/50 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-green-500 rounded-full"></div></div>
                                    <div className="w-full h-px bg-green-400/20 absolute"></div>
                                    <div className="h-full w-px bg-green-400/20 absolute"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-10"></div>
                        </>
                    ) : (
                        <div className="text-center opacity-30">
                            <Search className="w-16 h-16 mx-auto mb-2" />
                            <div className="text-xs font-mono">WAITING FOR TARGET ASSIGNMENT</div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// --- TELEMETRY MODAL ---
export const TelemetryModal = ({ onClose, missionTelemetry, satellite }: { onClose: () => void, missionTelemetry?: any[], satellite?: SatelliteData }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [step, setStep] = useState<'STREAM' | 'AUTH' | 'DECRYPTING' | 'DECRYPTED'>('STREAM');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPaused || step !== 'STREAM') return;

        const interval = setInterval(() => {
            if (missionTelemetry && Math.random() > 0.7) {
                // Inject mission telemetry
                const log = missionTelemetry[Math.floor(Math.random() * missionTelemetry.length)];
                setLines(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${log}`]);
            } else {
                const hex = Array(4).fill(0).map(() => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')).join(' ');
                setLines(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] RECV: ${hex}`]);
            }
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 150);
        return () => clearInterval(interval);
    }, [isPaused, step, missionTelemetry]);

    if (step === 'AUTH') {
        return <AuthModal title="DECRYPTION AUTHORIZATION" onClose={() => setStep('STREAM')} onSuccess={() => setStep('DECRYPTING')} validationKey={satellite?.telemetryKey} />;
    }

    if (step === 'DECRYPTING') {
        return <ProgressModal title="DECRYPTING LOGS" action="CRACKING ENCRYPTION KEY" onComplete={() => setStep('DECRYPTED')} />;
    }

    if (step === 'DECRYPTED') {
        return (
            <Modal title="DECRYPTED TELEMETRY DATA" onClose={onClose} wide>
                <div className="p-6 grid grid-cols-2 gap-6 h-full">
                    <div className="space-y-4">
                        <div className="bg-green-900/10 border border-green-900/30 p-4 rounded">
                            <h4 className="text-xs font-bold text-green-500 mb-3 flex items-center gap-2"><MapPin size={14} /> GEOLOCATION DATA</h4>
                            <div className="space-y-2 font-mono text-[10px] text-green-300">
                                <div className="flex justify-between border-b border-green-900/30 pb-1"><span>LATITUDE</span><span>34.0522° N</span></div>
                                <div className="flex justify-between border-b border-green-900/30 pb-1"><span>LONGITUDE</span><span>118.2437° W</span></div>
                                <div className="flex justify-between border-b border-green-900/30 pb-1"><span>ALTITUDE</span><span>408.2 KM</span></div>
                                <div className="flex justify-between"><span>VELOCITY</span><span>7.66 KM/S</span></div>
                            </div>
                        </div>
                        <div className="bg-green-900/10 border border-green-900/30 p-4 rounded">
                            <h4 className="text-xs font-bold text-green-500 mb-3 flex items-center gap-2"><Activity size={14} /> SYSTEM STATUS</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/40 p-2 rounded text-center border border-green-900/20">
                                    <div className="text-[9px] text-gray-500">TEMP</div>
                                    <div className="text-green-400 font-mono font-bold">245 K</div>
                                </div>
                                <div className="bg-black/40 p-2 rounded text-center border border-green-900/20">
                                    <div className="text-[9px] text-gray-500">POWER</div>
                                    <div className="text-green-400 font-mono font-bold">98%</div>
                                </div>
                            </div>
                            {satellite?.collisionTarget && (
                                <div className="mt-4 pt-4 border-t border-green-900/30">
                                    <h4 className="text-xs font-bold text-red-500 mb-2 flex items-center gap-2 animate-pulse"><Crosshair size={14} /> COLLISION TARGET</h4>
                                    <div className="bg-red-900/10 border border-red-900/30 p-2 rounded text-center">
                                        <div className="text-xl font-mono font-bold text-red-500">{satellite.collisionTarget}</div>
                                        <div className="text-[9px] text-red-400 mt-1">IMPACT TRAJECTORY CONFIRMED</div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-black/40 p-2 rounded text-center border border-green-900/20">
                                    <div className="text-[9px] text-gray-500">SIGNAL</div>
                                    <div className="text-green-400 font-mono font-bold">-82 dBm</div>
                                </div>
                                <div className="bg-black/40 p-2 rounded text-center border border-green-900/20">
                                    <div className="text-[9px] text-gray-500">UPTIME</div>
                                    <div className="text-green-400 font-mono font-bold">412D</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full">
                        <h4 className="text-xs font-bold text-green-500 mb-3 flex items-center gap-2"><Terminal size={14} /> ACCESS LOGS</h4>
                        <div className="flex-1 bg-black border border-green-900/30 rounded p-3 font-mono text-[10px] overflow-y-auto space-y-2">
                            {[
                                { time: '12:44:01', user: 'ADMIN', action: 'AUTH_HANDSHAKE', ip: '192.168.4.22' },
                                { time: '12:44:05', user: 'SYSTEM', action: 'ORBIT_CORRECTION', ip: 'INTERNAL' },
                                { time: '12:45:12', user: 'UNKNOWN', action: 'PORT_SCAN_DETECTED', ip: '45.22.19.112', alert: true },
                                { time: '12:45:13', user: 'FIREWALL', action: 'CONNECTION_REFUSED', ip: '45.22.19.112' },
                                { time: '12:50:00', user: 'SYSTEM', action: 'TELEMETRY_SYNC', ip: 'INTERNAL' },
                                { time: '12:55:30', user: 'USER_1', action: 'DATA_REQUEST', ip: '10.0.0.5' },
                            ].map((log, i) => (
                                <div key={i} className={`flex gap-2 ${log.alert ? 'text-red-400' : 'text-green-400/80'}`}>
                                    <span className="opacity-50">[{log.time}]</span>
                                    <span className="font-bold">{log.user}</span>
                                    <span className="flex-1">{log.action}</span>
                                    <span className="opacity-50">{log.ip}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep('STREAM')} className="mt-4 w-full py-2 bg-green-900/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500 hover:text-black transition-colors text-xs font-bold">
                            RETURN TO RAW STREAM
                        </button>
                    </div>
                </div>
            </Modal >
        );
    }

    return (
        <Modal title="RAW TELEMETRY STREAM" onClose={onClose}>
            <div className="flex flex-col h-full bg-black p-4 font-mono text-xs">
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 text-green-500 mb-4 h-64 border border-green-900/30 p-2">
                    {lines.map((l, i) => <div key={i}>{l}</div>)}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsPaused(!isPaused)} className={`flex-1 py-2 border rounded transition-colors ${isPaused ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-500' : 'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black'}`}>
                        {isPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}
                    </button>
                    <button onClick={() => setStep('AUTH')} className="flex-1 py-2 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors">
                        DECRYPT LOGS
                    </button>
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
                <div className="flex flex-col md:flex-row gap-4 p-4 bg-green-900/10 border border-green-900/30 rounded">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-green-600" />
                        <input type="text" placeholder="SEARCH ID, NAME, OR OWNER..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black border border-green-900/50 pl-10 pr-4 py-2 text-xs text-green-100 focus:outline-none focus:border-green-500 rounded" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {['ALL', 'CIVIL', 'MILITARY', 'TELESCOPE', 'STATION', 'DEBRIS', 'WILDFIRE', 'STORM'].map(f => (
                            <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-2 text-[10px] font-bold border rounded transition-colors ${filter === f ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-green-600 border-green-900/50 hover:border-green-500'}`}>{f}</button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-green-600 px-4 border-b border-green-900/30 pb-2">
                    <div className="col-span-3">DESIGNATION</div>
                    <div className="col-span-2">TYPE</div>
                    <div className="col-span-2">OWNER</div>
                    <div className="col-span-2">ORBIT</div>
                    <div className="col-span-3 text-right">ACTION</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                    {filtered.map(sat => (
                        <div key={sat.id} className="grid grid-cols-12 gap-2 p-3 bg-black/40 border border-green-900/20 hover:border-green-500/50 hover:bg-green-900/10 rounded items-center transition-all group">
                            <div className="col-span-3 font-mono text-xs text-green-100 font-bold">{sat.name}</div>
                            <div className="col-span-2">
                                <span className="text-[9px] px-1.5 py-0.5 border rounded" style={{
                                    color: CATEGORY_COLORS[sat.type] || '#fff',
                                    borderColor: (CATEGORY_COLORS[sat.type] || '#fff') + '80'
                                }}>
                                    {sat.type}
                                </span>
                            </div>
                            <div className="col-span-2 text-[10px] text-green-500">{sat.owner}</div>
                            <div className="col-span-2 text-[10px] text-green-600 font-mono">{sat.orbit}</div>
                            <div className="col-span-3 flex justify-end gap-2">
                                <button onClick={() => { onTrack(sat.id); onClose(); }} className="flex items-center gap-1 px-3 py-1 bg-green-900/20 hover:bg-green-500 hover:text-black text-green-400 border border-green-900/50 text-[10px] rounded transition-colors"><Crosshair size={10} /> TRACK</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
