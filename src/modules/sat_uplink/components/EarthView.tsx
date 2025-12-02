import React, { useState, useEffect, useRef } from 'react';
import { SatelliteData } from '../types';

interface EarthViewProps {
    satellite: SatelliteData;
    missionOverride?: {
        image?: string;
        meta?: string;
    };
}

const LAYERS = [
    {
        id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        name: 'VISIBLE EARTH', sat: 'VIIRS/SNPP', latency: 1, type: 'standard'
    },
    {
        id: 'VIIRS_SNPP_DayNightBand_At_Sensor_Radiance',
        name: 'NIGHT LIGHTS', sat: 'VIIRS/DNB', latency: 2, type: 'night'
    },
    {
        id: 'GPW_Population_Density_2020',
        name: 'HUMAN DENSITY', sat: 'GPW/CENSUS', latency: 0, type: 'chem'
    },
    {
        id: 'ASTER_GDEM_Color_Shaded_Relief',
        name: 'TERRAIN SCOUT', sat: 'ASTER/GDEM', latency: 0, type: 'relief'
    },
    {
        id: 'MODIS_Terra_NDVI_8Day',
        name: 'BIO-VIGOR (NDVI)', sat: 'MODIS/TERRA', latency: 8, type: 'chem'
    },
    {
        id: 'MODIS_Terra_Land_Surface_Temp_Day',
        name: 'LAND TEMP', sat: 'MODIS/TERRA', latency: 1, type: 'chem'
    },
    {
        id: 'MODIS_Terra_CorrectedReflectance_Bands721',
        name: 'FALSE COLOR', sat: 'MODIS/TERRA', latency: 1, type: 'standard'
    },
    {
        id: 'OMPS_Ozone_Total_Column',
        name: 'OZONE', sat: 'OMPS/NPP', latency: 2, type: 'chem'
    },
    {
        id: 'VIIRS_SNPP_L2_Chlorophyll_A',
        name: 'CHLOROPHYLL', sat: 'VIIRS/OCEAN', latency: 2, type: 'chem'
    },
    {
        id: 'MODIS_Terra_NDSI_Snow_Cover',
        name: 'SNOW COVER', sat: 'MODIS/TERRA', latency: 1, type: 'standard'
    },
    {
        id: 'IMERG_Precipitation_Rate',
        name: 'PRECIPITATION', sat: 'GPM/IMERG', latency: 2, type: 'chem'
    },
    {
        id: 'MODIS_Terra_Cloud_Top_Temp_Day',
        name: 'CLOUD TEMP', sat: 'MODIS/TERRA', latency: 1, type: 'chem'
    },
    {
        id: 'MODIS_Terra_Aerosol',
        name: 'AEROSOLS', sat: 'MODIS/TERRA', latency: 1, type: 'chem'
    }
];

const GIBS_WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi';

const EarthView: React.FC<EarthViewProps> = ({ satellite, missionOverride }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [olMap, setOlMap] = useState<any>(null);
    const [activeLayerConfig, setActiveLayerConfig] = useState(LAYERS[0]);
    const [overlays, setOverlays] = useState({ roads: false, grid: false });
    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
    });
    const [visualMode, setVisualMode] = useState('mode-standard');
    const [logs, setLogs] = useState<{ msg: string, type: string, time: string }[]>([]);
    const [coords, setCoords] = useState({ lat: '00.0000', lon: '00.0000' });
    const [targetInput, setTargetInput] = useState('');

    // Timeline State
    const [isSequenceMode, setIsSequenceMode] = useState(false);
    const [scrubberValue, setScrubberValue] = useState(13);
    const [isPersistent, setIsPersistent] = useState(false);
    const sequenceLayersRef = useRef<any[]>([]);
    const timerRef = useRef<any>(null);

    const addLog = (msg: string, type: 'log-ok' | 'log-err' | 'log-warn' | 'log-sys' = 'log-ok') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [{ msg, type, time }, ...prev].slice(0, 50));
    };

    // Load OpenLayers
    useEffect(() => {
        const scriptId = 'ol-script';
        const cssId = 'ol-css';

        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css';
            document.head.appendChild(link);
        }

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js';
            script.async = true;
            script.onload = () => initMap();
            document.body.appendChild(script);
        } else {
            initMap();
        }

        return () => {
            if (olMap) olMap.setTarget(null);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const initMap = () => {
        if (!mapRef.current || !(window as any).ol) return;
        const ol = (window as any).ol;

        const view = new ol.View({
            center: ol.proj.fromLonLat(satellite.coordinates || [0, 0]),
            zoom: 4, minZoom: 3, maxZoom: 12
        });

        const map = new ol.Map({
            target: mapRef.current,
            layers: [],
            view: view,
            controls: ol.control.defaults.defaults({ attribution: false, zoom: true, rotate: false })
                .extend([new ol.control.ScaleLine()]),
        });

        // Base Layer
        const baseLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: GIBS_WMS,
                crossOrigin: 'anonymous',
                params: { 'LAYERS': 'BlueMarble_NextGeneration', 'FORMAT': 'image/jpeg', 'TRANSPARENT': false }
            }),
            zIndex: 0
        });
        map.addLayer(baseLayer);

        // Roads Overlay
        const roadsLayer = new ol.layer.Tile({
            className: 'tactical-layer',
            source: new ol.source.TileWMS({
                url: GIBS_WMS,
                crossOrigin: 'anonymous',
                params: { 'LAYERS': 'Reference_Features_15m', 'FORMAT': 'image/png', 'TRANSPARENT': true }
            }),
            zIndex: 1000,
            visible: false
        });
        roadsLayer.set('id', 'roads');
        map.addLayer(roadsLayer);

        // Graticule
        const graticule = new ol.layer.Graticule({
            className: 'tactical-layer',
            strokeStyle: new ol.style.Stroke({ color: 'rgba(0, 255, 0, 0.9)', width: 2, lineDash: [10, 10] }),
            showLabels: true,
            zIndex: 1001,
            visible: false
        });
        graticule.set('id', 'grid');
        map.addLayer(graticule);

        // Pointer Move
        map.on('pointermove', (evt: any) => {
            const coords = ol.proj.toLonLat(evt.coordinate);
            setCoords({ lat: coords[1].toFixed(4), lon: coords[0].toFixed(4) });
        });

        setOlMap(map);
        addLog("SYSTEM BOOT. CONNECTING...", 'log-sys');
        loadStaticLayer(map, LAYERS[0], currentDate);
    };

    const createGibsLayer = (config: any, date: Date, visible = true) => {
        const ol = (window as any).ol;
        const dateStr = date.toISOString().split('T')[0];

        const source = new ol.source.TileWMS({
            url: GIBS_WMS,
            crossOrigin: 'anonymous',
            params: {
                'LAYERS': config.id,
                'FORMAT': 'image/png',
                'TIME': dateStr,
                'TRANSPARENT': true
            },
        });

        const layer = new ol.layer.Tile({
            source: source,
            className: 'science-layer',
            zIndex: 10,
            visible: visible
        });
        layer.set('isScience', true);
        return layer;
    };

    const loadStaticLayer = (map: any, layerConfig: any, date: Date) => {
        if (!map) return;

        if (!isPersistent) {
            // Clear existing science layers
            const toRemove: any[] = [];
            map.getLayers().forEach((l: any) => {
                if (l.get('isScience')) toRemove.push(l);
            });
            toRemove.forEach(l => map.removeLayer(l));
        }

        const layer = createGibsLayer(layerConfig, date, true);
        map.addLayer(layer);

        // Update Visual Mode
        setVisualMode(`mode-${layerConfig.type}`);
        addLog(`REQUEST: ${layerConfig.name} [${date.toISOString().split('T')[0]}]`, 'log-sys');
    };

    const handleLayerChange = (config: any) => {
        setActiveLayerConfig(config);

        // Latency Logic
        let newDate = new Date(currentDate);
        if (config.latency > 0) {
            const today = new Date();
            const safeDate = new Date();
            safeDate.setDate(today.getDate() - config.latency);
            newDate = safeDate;
            setCurrentDate(newDate);
            addLog(`SWITCH: ${config.name}. LATENCY: ${config.latency}d`, 'log-sys');
        } else {
            addLog(`SWITCH: ${config.name}. (STATIC LAYER)`, 'log-sys');
        }

        if (isSequenceMode) stopPlayback();
        loadStaticLayer(olMap, config, newDate);
    };

    const toggleOverlay = (type: 'roads' | 'grid') => {
        const newState = !overlays[type];
        setOverlays(prev => ({ ...prev, [type]: newState }));

        if (olMap) {
            olMap.getLayers().forEach((l: any) => {
                if (l.get('id') === type) l.setVisible(newState);
            });
            addLog(newState ? `OVERLAY: ${type.toUpperCase()} ACTIVE` : `OVERLAY: ${type.toUpperCase()} DISABLED`, 'log-sys');
        }
    };

    // --- TIMELINE LOGIC ---
    const buildSequenceStack = () => {
        if (!olMap) return;
        if (!isPersistent) {
            const toRemove: any[] = [];
            olMap.getLayers().forEach((l: any) => {
                if (l.get('isScience')) toRemove.push(l);
            });
            toRemove.forEach(l => olMap.removeLayer(l));
        }

        addLog("INITIALIZING TIMELAPSE STACK...", 'log-sys');
        sequenceLayersRef.current = [];

        for (let i = 0; i < 14; i++) {
            let tempDate = new Date(currentDate);
            tempDate.setDate(tempDate.getDate() - i);
            let layer = createGibsLayer(activeLayerConfig, tempDate, false);
            layer.setZIndex(100);
            olMap.addLayer(layer);
            sequenceLayersRef.current.push(layer);
        }
    };

    const updateTimelineVisuals = (val: number) => {
        if (!sequenceLayersRef.current.length) return;
        const arrayIndex = (14 - 1) - val;
        sequenceLayersRef.current.forEach((layer, i) => {
            layer.setVisible(i === arrayIndex);
        });

        let displayDate = new Date(currentDate);
        displayDate.setDate(displayDate.getDate() - arrayIndex);
        // We don't update main currentDate state to avoid re-renders loop, just visual feedback if needed
    };

    const startPlayback = () => {
        setIsSequenceMode(true);
        if (sequenceLayersRef.current.length === 0) buildSequenceStack();

        timerRef.current = setInterval(() => {
            setScrubberValue(prev => {
                let next = prev + 1;
                if (next >= 14) next = 0;
                updateTimelineVisuals(next);
                return next;
            });
        }, 800);
    };

    const stopPlayback = () => {
        setIsSequenceMode(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const toggleTimelapse = () => {
        if (isSequenceMode) stopPlayback();
        else startPlayback();
    };

    const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setScrubberValue(val);
        if (!isSequenceMode) {
            setIsSequenceMode(true); // Enter sequence mode state but paused
            buildSequenceStack();
        }
        stopPlayback(); // Ensure not auto-playing
        updateTimelineVisuals(val);
    };

    // --- SEARCH ---
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetInput || !olMap) return;

        addLog(`SEARCH: ${targetInput}`, 'log-sys');
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(targetInput)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const ol = (window as any).ol;
                olMap.getView().animate({ center: ol.proj.fromLonLat([lon, lat]), zoom: 9, duration: 2000 });
                addLog(`LOCK: ${lat.toFixed(2)}, ${lon.toFixed(2)}`);
            } else {
                addLog("SECTOR NOT FOUND", 'log-err');
            }
        } catch (err) {
            addLog("SEARCH FAILED", 'log-err');
        }
    };

    // --- DATA I/O ---
    const downloadState = () => {
        if (!olMap) return;
        const ol = (window as any).ol;
        const center = ol.proj.toLonLat(olMap.getView().getCenter());
        const state = {
            lat: center[1],
            lon: center[0],
            zoom: olMap.getView().getZoom(),
            date: currentDate.toISOString().split('T')[0],
            activeLayerId: activeLayerConfig.id,
            overlays
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `SAT_CONFIG_${state.date}.json`;
        a.click();
        addLog("CONFIG EXPORTED SUCCESSFULLY");
    };

    const downloadSnapshot = () => {
        if (!olMap) return;
        addLog("CAPTURING VISUAL FEED...", 'log-sys');
        olMap.once('rendercomplete', () => {
            const mapCanvas = document.createElement('canvas');
            const size = olMap.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            const mapContext = mapCanvas.getContext('2d');
            if (!mapContext) return;

            // Apply filters
            if (visualMode === 'mode-night') mapContext.filter = 'contrast(1.4) brightness(1.6) sepia(1) hue-rotate(-15deg) saturate(1.6)';
            else if (visualMode === 'mode-chem') mapContext.filter = 'contrast(1.1) saturate(1.4)';
            else if (visualMode === 'mode-relief') mapContext.filter = 'grayscale(1) contrast(1.4) brightness(1.1)';
            else mapContext.filter = 'contrast(1.1) brightness(1.1) sepia(0.1)';

            // Draw Layers
            document.querySelectorAll('.science-layer canvas').forEach((canvas: any) => {
                if (canvas.width > 0) mapContext.drawImage(canvas, 0, 0);
            });

            // Draw Tactical
            mapContext.filter = 'sepia(1) hue-rotate(60deg) saturate(5) brightness(1.2) drop-shadow(0 0 3px #0f0)';
            document.querySelectorAll('.tactical-layer canvas').forEach((canvas: any) => {
                if (canvas.width > 0) mapContext.drawImage(canvas, 0, 0);
            });

            const link = document.createElement('a');
            link.download = `SAT_VISUAL_${currentDate.toISOString().split('T')[0]}.png`;
            link.href = mapCanvas.toDataURL();
            link.click();
            addLog("SNAPSHOT DOWNLOADED");
        });
        olMap.renderSync();
    };

    // CSS Injection for Filters (Scoped)
    const filterStyles = `
        .mode-standard .science-layer canvas { filter: contrast(1.1) brightness(1.1) sepia(0.1); }
        .mode-night .science-layer canvas { filter: contrast(1.4) brightness(1.6) sepia(1) hue-rotate(-15deg) saturate(1.6); }
        .mode-chem .science-layer canvas { filter: contrast(1.1) saturate(1.4); }
        .mode-relief .science-layer canvas { filter: grayscale(1) contrast(1.4) brightness(1.1); }
        .tactical-layer canvas { filter: sepia(1) hue-rotate(60deg) saturate(5) brightness(1.2) drop-shadow(0 0 3px #0f0); }
        .ol-control button { background-color: black !important; color: #4ade80 !important; border: 1px solid #4ade80 !important; border-radius: 0 !important; }
        .ol-scale-line { background: transparent !important; border: 1px solid #4ade80; bottom: 80px; left: auto; right: 20px; }
        .ol-scale-line-inner { color: #4ade80 !important; border-color: #4ade80 !important; }
    `;

    return (
        <div className={`flex h-full w-full bg-[#020403] text-green-500 overflow-hidden relative font-mono ${visualMode}`}>
            <style>{filterStyles}</style>

            {/* CRT Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
            <div className="absolute inset-0 pointer-events-none z-50 bg-green-500/5 animate-[scan_6s_linear_infinite] h-1 w-full top-0"></div>

            {/* Main Map Area */}
            <div className="flex-1 relative border-r border-green-900/30">

                {/* Top Bar - Target Lock */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
                    <div className="bg-black/80 border border-green-500/30 p-2 text-xs pointer-events-auto flex items-center gap-2">
                        <span className="font-bold">TARGET_LOCK:</span>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={targetInput}
                                onChange={(e) => setTargetInput(e.target.value)}
                                placeholder="ENTER COORDINATES OR SECTOR..."
                                className="bg-transparent border-b border-green-500 text-green-500 w-64 focus:outline-none uppercase"
                            />
                        </form>
                    </div>
                    <div className="bg-black/80 border border-green-500/30 p-2 text-xs">
                        LAT: {coords.lat} | LON: {coords.lon}
                    </div>
                </div>

                {/* Map Container */}
                {missionOverride?.image ? (
                    <div className="w-full h-full relative">
                        <img src={missionOverride.image} alt="Mission Target" className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-red-900/80 text-white text-xs px-2 py-1 rounded animate-pulse z-30">
                            MISSION OVERRIDE ACTIVE
                        </div>
                    </div>
                ) : (
                    <div ref={mapRef} className="w-full h-full bg-black cursor-crosshair"></div>
                )}

                {/* Bottom Left - Temporal Data Panel */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/90 border border-green-500/30 p-3 w-[450px]">
                    <div className="flex justify-between items-center mb-2 text-xs border-b border-green-900/50 pb-1">
                        <span>TEMPORAL_DATA:</span>
                        <input
                            type="date"
                            value={currentDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                                const d = new Date(e.target.value);
                                setCurrentDate(d);
                                loadStaticLayer(olMap, activeLayerConfig, d);
                            }}
                            className="bg-black border border-green-500 text-green-500 text-[10px] p-0.5 uppercase"
                        />
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" checked={isPersistent} onChange={(e) => setIsPersistent(e.target.checked)} className="accent-green-500" />
                            <span className="text-[10px]">[PERSISTENT]</span>
                        </label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={toggleTimelapse}
                            className={`border border-green-500 px-2 py-1 text-[10px] w-24 hover:bg-green-500 hover:text-black transition-colors ${isSequenceMode ? 'bg-green-500 text-black' : ''}`}
                        >
                            {isSequenceMode ? '[HALT SEQ]' : '[INIT SEQ]'}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="13"
                            value={scrubberValue}
                            onChange={handleScrubberChange}
                            className="flex-1 accent-green-500 h-1 bg-green-900/30 appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Controls */}
            <div className="w-72 bg-[#030605] flex flex-col z-20 border-l border-green-900/30">
                <div className="p-3 border-b border-green-900/30">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-green-500 pb-1 text-green-400">Sensor Feed</h2>
                </div>

                <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-4">

                    {/* Layers */}
                    <div>
                        <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Science Layers</div>
                        <div className="space-y-0.5 max-h-48 overflow-y-auto">
                            {LAYERS.map(l => (
                                <button
                                    key={l.id}
                                    onClick={() => handleLayerChange(l)}
                                    className={`w-full text-left p-1.5 text-[10px] border transition-all flex justify-between items-center ${activeLayerConfig.id === l.id ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-green-500 border-green-900/30 hover:border-green-500'}`}
                                >
                                    <span>{l.name}</span>
                                    <span className="opacity-60">{l.sat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Overlays */}
                    <div>
                        <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Tactical Overlays</div>
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 cursor-pointer group hover:text-white text-[10px]">
                                <input type="checkbox" checked={overlays.roads} onChange={() => toggleOverlay('roads')} className="accent-green-500" />
                                BORDERS / ROADS / CITIES
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group hover:text-white text-[10px]">
                                <input type="checkbox" checked={overlays.grid} onChange={() => toggleOverlay('grid')} className="accent-green-500" />
                                TAC-GRID (LAT/LON)
                            </label>
                        </div>
                    </div>

                    {/* Data I/O */}
                    <div>
                        <div className="text-[10px] text-green-500/50 uppercase mb-1 border-b border-green-900/30">Data Uplink / Downlink</div>
                        <div className="flex gap-1 mb-1">
                            <button onClick={downloadState} className="flex-1 border border-green-500 p-1 text-[10px] hover:bg-green-500 hover:text-black transition-colors">[SAVE CFG]</button>
                            <button onClick={() => document.getElementById('cfg-upload')?.click()} className="flex-1 border border-green-500 p-1 text-[10px] hover:bg-green-500 hover:text-black transition-colors">[LOAD CFG]</button>
                            <input type="file" id="cfg-upload" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        try {
                                            const cfg = JSON.parse(ev.target?.result as string);
                                            addLog(`CONFIG IMPORTED: ${cfg.date}`, 'log-ok');
                                            // TODO: Apply full config state (lat/lon/zoom/layers)
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
    );
};

export default EarthView;
