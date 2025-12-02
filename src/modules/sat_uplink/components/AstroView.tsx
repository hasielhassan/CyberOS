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
    const [showTelemetry, setShowTelemetry] = useState(false);

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
                    });

                    setAladinInstance(aladin);

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
                }).catch((err: any) => {
                    console.error("Init Error:", err);
                    setStatusMsg("ERR: LINK FAILURE");
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
                }
            }, 100);
        }
    };

    // Handle Search
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!aladinInstance) return;

        setStatusMsg(`SEARCH PROTOCOL: "${targetInput.toUpperCase()}"`);

        aladinInstance.gotoObject(targetInput, {
            success: (pos: any) => {
                setStatusMsg(`TARGET ACQUIRED: ${targetInput.toUpperCase()}`);
                setCoords({ ra: pos[0].toFixed(4), dec: pos[1].toFixed(4) });
            },
            error: () => {
                setStatusMsg(`ERR: TARGET NOT FOUND`);
            }
        });
    };

    // Handle Survey Change
    const handleSurveyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const surveyId = e.target.value;
        setCurrentSurvey(surveyId);
        if (aladinInstance) {
            aladinInstance.setImageSurvey(surveyId);
            const surveyName = AVAILABLE_SURVEYS.find(s => s.id === surveyId)?.name;
            setStatusMsg(`FILTER SWITCH: ${surveyName}`);
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
                }
            }
        } else {
            if (overlayLayerRef.current) {
                overlayLayerRef.current.removeAll();
                setStatusMsg("HUD OVERLAY: OFFLINE");
            }
        }
    };

    return (
        <div className="flex h-full w-full bg-[#020403] text-green-500 overflow-hidden relative font-mono">
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>

            {/* Main Content Area */}
            <div className="flex-1 flex relative">

                {/* The Map (Aladin) */}
                <div className="flex-1 relative border-r border-green-900/30">
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

                {/* Right Sidebar - Analysis Panel */}
                <div className="w-72 bg-[#030605] flex flex-col z-20 border-l border-green-900/30">
                    <div className="p-4 border-b border-green-900/30 flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-green-500 pb-1 text-green-400">Target Analysis</h2>
                        <div className="text-xs text-green-600"><i className="fa-solid fa-lock"></i></div>
                    </div>

                    <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">

                        {/* Search / Target Input */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-1">Target Designation</div>
                            <form onSubmit={handleSearch} className="flex items-center border border-green-900/50 bg-black group focus-within:border-green-500 transition-colors">
                                <span className="pl-3 text-xs text-green-500/70">&gt;</span>
                                <input
                                    type="text"
                                    value={targetInput}
                                    onChange={(e) => setTargetInput(e.target.value)}
                                    className="bg-transparent border-none text-green-500 text-xs p-2 w-full focus:outline-none placeholder-green-900/50 uppercase font-mono"
                                    placeholder="ENTER COORDINATES"
                                />
                                <button type="submit" className="px-3 hover:text-white transition-colors text-green-500">
                                    [SCAN]
                                </button>
                            </form>
                        </div>

                        {/* Coordinates Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-[10px] text-green-500/50 uppercase">Right Asc</div>
                                <div className="text-sm text-green-400">{coords.ra}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-green-500/50 uppercase">Declination</div>
                                <div className="text-sm text-green-400">{coords.dec}</div>
                            </div>
                        </div>

                        {/* Filter / Instrument */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-2">Instrument // Filter</div>
                            <div className="relative border border-green-900/50">
                                <select
                                    value={currentSurvey}
                                    onChange={handleSurveyChange}
                                    className="w-full bg-black text-green-500 text-xs p-2 uppercase appearance-none focus:outline-none cursor-pointer"
                                >
                                    {AVAILABLE_SURVEYS.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-2 pointer-events-none text-green-500">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <div className="text-[10px] text-green-500/50 uppercase mb-2">Available Actions</div>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={toggleFootprints}
                                    className={`w-full border border-green-500 p-2 text-xs uppercase tracking-wider transition-all hover:bg-green-500 hover:text-black flex justify-between items-center ${showFootprints ? 'bg-green-500/20' : ''}`}
                                >
                                    <span>REFRESH SENSOR</span>
                                    <span className="text-[10px]">⚡</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (aladinInstance) {
                                            const currentFov = aladinInstance.getFov()[0];
                                            aladinInstance.setFov(currentFov * 0.8);
                                        }
                                    }}
                                    className="w-full border border-green-500 p-2 text-xs uppercase tracking-wider transition-all hover:bg-green-500 hover:text-black flex justify-between items-center"
                                >
                                    <span>ENHANCE ZOOM</span>
                                    <span className="text-[10px]">+</span>
                                </button>

                                {/* Telemetry Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowTelemetry(!showTelemetry)}
                                    className={`w-full border p-2 text-xs uppercase tracking-wider transition-all flex justify-between items-center ${showTelemetry ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-green-900/50 text-green-500 hover:border-green-500'}`}
                                >
                                    <span>DOWNLOAD TELEMETRY</span>
                                    <span className="text-[10px]">{showTelemetry ? '▲' : '▼'}</span>
                                </button>

                                {/* Telemetry Expansion Panel */}
                                {showTelemetry && (
                                    <div className="border border-t-0 border-green-900/30 bg-green-900/10 p-3 space-y-2 animate-pulse">
                                        <div className="text-[10px] text-green-400">
                                            DOWNLINKING PACKETS...
                                            <br />
                                            {missionOverride?.meta || "NO ANOMALIES DETECTED"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Encryption Key Decoration */}
                        <div className="pt-4 border-t border-green-900/20 text-[8px] text-green-500/40 break-all font-mono leading-3">
                            0x4F 0x9A 0x12 0xBB 0x7C 0x88 0x00 ... END OF STREAM
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstroView;
