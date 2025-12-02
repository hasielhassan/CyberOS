import React, { useState, useEffect, useRef } from 'react';
import { SatelliteData } from '../types';

interface AstroViewProps {
    satellite: SatelliteData;
    missionOverride?: {
        image?: string;
        meta?: string;
    };
}

const AVAILABLE_SURVEYS = [
    { id: "P/DSS2/color", name: "OPTICAL // DSS2 COLOR", type: "OPTICAL" },
    { id: "P/PanSTARRS/DR1/color-z-zg-g", name: "OPTICAL // PANSTARRS DR1", type: "OPTICAL" },
    { id: "P/2MASS/color", name: "INFRARED // 2MASS", type: "INFRARED" },
    { id: "P/allWISE/color", name: "INFRARED // ALLWISE", type: "INFRARED" },
    { id: "P/GALEXGR6/AIS/color", name: "UV // GALEX AIS", type: "UV" },
    { id: "P/XMM/PN/color", name: "X-RAY // XMM NEWTON", type: "X-RAY" },
];

const AstroView: React.FC<AstroViewProps> = ({ satellite, missionOverride }) => {
    const [aladinInstance, setAladinInstance] = useState<any>(null);
    const [targetInput, setTargetInput] = useState(satellite.supportedTargets[0] || "CARINA NEBULA");
    const [currentSurvey, setCurrentSurvey] = useState(AVAILABLE_SURVEYS[0].id);
    const [fov, setFov] = useState(0.5);
    const [coords, setCoords] = useState({ ra: "00.0000", dec: "+00.0000" });
    const [statusMsg, setStatusMsg] = useState("SYSTEM INITIALIZED");
    const [showFootprints, setShowFootprints] = useState(false);

    const [logs, setLogs] = useState<{ msg: string, type: string, time: string }[]>([]);

    const addLog = (msg: string, type: 'log-ok' | 'log-err' | 'log-warn' | 'log-sys' = 'log-ok') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [{ msg, type, time }, ...prev].slice(0, 50));
    };

    const aladinContainerRef = useRef<HTMLDivElement>(null);
    const overlayLayerRef = useRef<any>(null);

    // Load Aladin Lite Script
    useEffect(() => {
        const scriptId = 'aladin-lite-script';
        const cssId = 'aladin-lite-css';

        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.min.css';
            document.head.appendChild(link);
        }

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';
            script.async = true;
            script.onload = () => initAladin();
            document.body.appendChild(script);
        } else {
            initAladin();
        }

        return () => {
            // Cleanup if needed
        };
    }, []);

    const initAladin = () => {
        let attempts = 0;
        const maxAttempts = 50;

        const tryInit = () => {
            if ((window as any).A && (window as any).A.init) {
                (window as any).A.init.then(() => {
                    if (!aladinContainerRef.current) return;

                    const aladin = (window as any).A.aladin(aladinContainerRef.current, {
                        survey: currentSurvey,
                        fov: fov,
                        target: targetInput,
                        cooFrame: 'J2000',
                        showReticle: true,
                        showZoomControl: false,
                        showFullscreenControl: false,
                        showLayersControl: false,
                        showGotoControl: false,
                        showFrameControl: false,
                        showCooGridControl: false,
                        showSimbadPointerControl: false,
                        showShareControl: false,
                    });

                    setAladinInstance(aladin);
                    addLog("SYSTEM BOOT. CONNECTING...", 'log-sys');

                    aladin.on('positionChanged', (position: any) => {
                        if (position) {
                            setCoords({
                                ra: position.ra.toFixed(4),
                                dec: position.dec.toFixed(4)
                            });
                        }
                    });

                    aladin.on('zoomChanged', (newFov: number) => {
                        setFov(newFov);
                    });

                    setStatusMsg("SATELLITE LINK ESTABLISHED");
                    addLog("LINK ESTABLISHED. READY.", 'log-ok');
                }).catch((err: any) => {
                    console.error("Init Error:", err);
                    setStatusMsg("ERR: LINK FAILURE");
                    addLog("LINK FAILURE", 'log-err');
                });
                return true;
            }
            return false;
        };

        if (!tryInit()) {
            const intervalId = setInterval(() => {
                attempts++;
                if (tryInit()) {
                    clearInterval(intervalId);
                } else if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    setStatusMsg("ERR: TIMEOUT");
                    addLog("CONNECTION TIMEOUT", 'log-err');
                }
            }, 100);
        }
    };

    // Handle Search
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!aladinInstance) return;

        setStatusMsg(`SEARCH PROTOCOL: "${targetInput.toUpperCase()}"`);
        addLog(`SEARCH: ${targetInput.toUpperCase()}`, 'log-sys');

        aladinInstance.gotoObject(targetInput, {
            success: (pos: any) => {
                setStatusMsg(`TARGET ACQUIRED: ${targetInput.toUpperCase()}`);
                addLog(`LOCK ACQUIRED: ${pos[0].toFixed(4)}, ${pos[1].toFixed(4)}`, 'log-ok');
                setCoords({ ra: pos[0].toFixed(4), dec: pos[1].toFixed(4) });
            },
            error: () => {
                setStatusMsg(`ERR: TARGET NOT FOUND`);
                addLog("TARGET NOT FOUND", 'log-err');
            }
        });
    };

    // Handle Survey Change
    const handleSurveyChange = (surveyId: string) => {
        setCurrentSurvey(surveyId);
        if (aladinInstance) {
            aladinInstance.setImageSurvey(surveyId);
            const surveyName = AVAILABLE_SURVEYS.find(s => s.id === surveyId)?.name;
            setStatusMsg(`FILTER SWITCH: ${surveyName}`);
            addLog(`FILTER: ${surveyName}`, 'log-sys');
        }
    };

    // Toggle Footprints (HUD Overlay)
    const toggleFootprints = () => {
        if (!aladinInstance) return;
        const newState = !showFootprints;
        setShowFootprints(newState);

        if (newState) {
            if (!overlayLayerRef.current) {
                if ((window as any).A && (window as any).A.graphicOverlay) {
                    overlayLayerRef.current = (window as any).A.graphicOverlay({ color: '#4ade80', lineWidth: 1, name: "HST_HUD" });
                    aladinInstance.addOverlay(overlayLayerRef.current);
                }
            }

            if (overlayLayerRef.current) {
                const center = aladinInstance.getRaDec();
                const offset = 0.05;
                if ((window as any).A && (window as any).A.polygon) {
                    // Draw a "reticle" box
                    const footprint = (window as any).A.polygon([
                        [center[0] - offset, center[1] - offset],
                        [center[0] + offset, center[1] - offset],
                        [center[0] + offset, center[1] + offset],
                        [center[0] - offset, center[1] + offset]
                    ]);
                    overlayLayerRef.current.add(footprint);
                    setStatusMsg("HUD OVERLAY: ACTIVE");
                    addLog("HUD OVERLAY ACTIVATED", 'log-sys');
                }
            }
        } else {
            if (overlayLayerRef.current) {
                overlayLayerRef.current.removeAll();
                setStatusMsg("HUD OVERLAY: OFFLINE");
                addLog("HUD OVERLAY DEACTIVATED", 'log-sys');
            }
        }
    };

    // --- DATA I/O ---
    const downloadState = () => {
        if (!aladinInstance) return;
        const state = {
            target: targetInput,
            fov: fov,
            survey: currentSurvey,
            coords: aladinInstance.getRaDec()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `ASTRO_CONFIG_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        addLog("CONFIG EXPORTED SUCCESSFULLY");
    };

    const applyConfiguration = (cfg: any) => {
        if (!aladinInstance) return;

        setTargetInput(cfg.target);
        setFov(cfg.fov);
        handleSurveyChange(cfg.survey);

        aladinInstance.gotoRaDec(cfg.coords[0], cfg.coords[1]);
        aladinInstance.setFov(cfg.fov);

        addLog("CONFIG IMPORTED SUCCESSFULLY", 'log-ok');
    };

    const downloadSnapshot = () => {
        if (!aladinInstance) return;
        addLog("CAPTURING VISUAL FEED...", 'log-sys');

        // Aladin Lite v3 canvas capture
        const canvas = aladinContainerRef.current?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `ASTRO_VISUAL_${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL();
            link.click();
            addLog("SNAPSHOT DOWNLOADED");
        } else {
            addLog("CAPTURE FAILED: NO FEED", 'log-err');
        }
    };

    const handleZoom = (delta: number) => {
        if (!aladinInstance) return;
        const newFov = fov * delta;
        aladinInstance.setFov(newFov);
        setFov(newFov);
        addLog(`ZOOM: ${newFov.toFixed(4)}`, 'log-sys');
    };

    return (
        <div className="flex h-full w-full bg-[#020403] text-green-500 overflow-hidden relative font-mono">
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>

            {/* Main Content Area */}
            <div className="flex-1 flex relative">

                {/* The Map (Aladin) */}
                <div className="flex-1 relative border-r border-green-900/30">

                    {/* Top Left - Target & Zoom */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-none">
                        <div className="bg-black/80 border border-green-500/30 p-2 text-xs pointer-events-auto flex items-center gap-2">
                            <span className="font-bold">TARGET_LOCK:</span>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    value={targetInput}
                                    onChange={(e) => setTargetInput(e.target.value)}
                                    className="bg-transparent border-b border-green-500 text-green-500 w-48 focus:outline-none uppercase"
                                    placeholder="ENTER COORDINATES..."
                                />
                            </form>
                        </div>
                        <div className="flex flex-col gap-0.5 pointer-events-auto">
                            <button onClick={() => handleZoom(0.8)} className="bg-black/80 border border-green-500/30 w-8 h-8 flex items-center justify-center hover:bg-green-500 hover:text-black transition-colors text-lg font-bold">+</button>
                            <button onClick={() => handleZoom(1.2)} className="bg-black/80 border border-green-500/30 w-8 h-8 flex items-center justify-center hover:bg-green-500 hover:text-black transition-colors text-lg font-bold">-</button>
                        </div>
                    </div>

                    {/* Top Right - Coordinates */}
                    <div className="absolute top-4 right-16 z-20 bg-black/80 border border-green-500/30 p-2 text-xs text-green-400 font-mono pointer-events-none">
                        RA: {coords.ra} | DEC: {coords.dec}
                    </div>

                    {/* Crosshairs Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-green-500"></div>
                        <div className="absolute left-1/2 top-0 h-full w-px bg-green-500"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-green-500"></div>
                    </div>

                    {/* Status Overlay on Map */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 border-t border-green-900/30 p-2 text-[10px] flex gap-4 font-mono z-20">
                        <span className="text-green-500/60">&gt; SYSTEM LOG:</span>
                        <span className="text-green-500">{statusMsg}</span>
                        <span className="ml-auto text-green-500/60">FOV: {fov.toFixed(2)}°</span>
                    </div>

                    {missionOverride?.image ? (
                        <div className="w-full h-full relative">
                            <img src={missionOverride.image} alt="Mission Target" className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-red-900/80 text-white text-xs px-2 py-1 rounded animate-pulse">
                                MISSION OVERRIDE ACTIVE
                            </div>
                        </div>
                    ) : (
                        <div ref={aladinContainerRef} className="w-full h-full cursor-crosshair bg-black grayscale-[20%] contrast-125"></div>
                    )}
                </div>

                {/* Right Sidebar - Controls */}
                <div className="w-72 bg-[#030605] flex flex-col z-20 border-l border-green-900/30">
                    <div className="p-3 border-b border-green-900/30">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-green-500 pb-1 text-green-400">Sensor Feed</h2>
                    </div>

                    <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-4">

                        {/* Instruments / Filters */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Instrument // Filter</div>
                            <div className="space-y-0.5 max-h-48 overflow-y-auto">
                                {AVAILABLE_SURVEYS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleSurveyChange(s.id)}
                                        className={`w-full text-left p-1.5 text-[10px] border transition-all flex justify-between items-center ${currentSurvey === s.id ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-green-500 border-green-900/30 hover:border-green-500'}`}
                                    >
                                        <span>{s.name.split('//')[1].trim()}</span>
                                        <span className="opacity-60">{s.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Available Actions</div>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={toggleFootprints}
                                    className={`w-full border p-1.5 text-[10px] uppercase tracking-wider transition-all flex justify-between items-center ${showFootprints ? 'bg-green-500 text-black border-green-500' : 'border-green-900/50 text-green-500 hover:border-green-500'}`}
                                >
                                    <span>HUD OVERLAY</span>
                                    <span>{showFootprints ? 'ON' : 'OFF'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Data I/O */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Data Uplink / Downlink</div>
                            <div className="flex gap-1 mb-1">
                                <button onClick={downloadState} className="flex-1 border border-green-500 p-1 text-[10px] hover:bg-green-500 hover:text-black transition-colors">[SAVE CFG]</button>
                                <button onClick={() => document.getElementById('astro-cfg-upload')?.click()} className="flex-1 border border-green-500 p-1 text-[10px] hover:bg-green-500 hover:text-black transition-colors">[LOAD CFG]</button>
                                <input type="file" id="astro-cfg-upload" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            try {
                                                const cfg = JSON.parse(ev.target?.result as string);
                                                applyConfiguration(cfg);
                                            } catch (err) { addLog("IMPORT ERROR", 'log-err'); }
                                        };
                                        reader.readAsText(file);
                                    }
                                }} />
                            </div>
                            <button onClick={downloadSnapshot} className="w-full border border-green-500 p-1 text-[10px] hover:bg-green-500 hover:text-black transition-colors">[CAPTURE VISUAL]</button>
                        </div>

                        {/* Diagnostics */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">System Diagnostics</div>
                            <div className="flex-1 border-t border-dashed border-green-900/50 overflow-y-auto h-32 text-[9px] font-mono p-1 flex flex-col-reverse">
                                {logs.map((log, i) => (
                                    <div key={i} className={`mb-0.5 ${log.type === 'log-err' ? 'text-red-500' : log.type === 'log-warn' ? 'text-yellow-500' : log.type === 'log-sys' ? 'text-blue-400' : 'text-green-500'}`}>
                                        <span className="opacity-50">[{log.time}]</span> {log.msg}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstroView;
