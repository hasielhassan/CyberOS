import { useState, useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plane, Train, CloudRain, Search, Layers, Map as MapIcon, Globe } from 'lucide-react';
import geoData from './geo_data.json';

// Custom Icons
const createIcon = (svg: string, color: string, rotation: number = 0) => new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="color: ${color}; filter: drop-shadow(0 0 5px ${color}); transform: rotate(${rotation}deg);"><div>${svg}</div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// SVG Strings for Icons - Plane pointing up (north) by default
const PLANE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 39.769 39.769" fill="currentColor"><path d="M36.384,23.28v1.896c0,0.46-0.211,0.896-0.571,1.181c-0.269,0.211-0.597,0.319-0.929,0.319c-0.117,0-0.235-0.014-0.353-0.041l-11.886-2.858v11.457l3.271,2.309c0.266,0.188,0.424,0.492,0.424,0.816v0.41c0,0.291-0.127,0.565-0.346,0.758c-0.185,0.156-0.416,0.242-0.654,0.242c-0.049,0-0.096-0.003-0.144-0.011l-5.314-0.766l-5.317,0.765c-0.285,0.041-0.578-0.045-0.797-0.232c-0.219-0.188-0.345-0.466-0.345-0.757v-0.409c0-0.326,0.157-0.632,0.423-0.817l3.271-2.31V23.774L5.233,26.632c-0.445,0.106-0.918,0.005-1.279-0.277c-0.359-0.285-0.57-0.721-0.57-1.181v-1.896c0-0.545,0.296-1.047,0.771-1.312l12.963-7.207V2.767C17.118,1.242,18.36,0,19.885,0c1.524,0,2.767,1.24,2.767,2.767V14.76l12.964,7.207C36.087,22.233,36.384,22.735,36.384,23.28z"/></svg>';
const TRAIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 10h16"/><path d="M12 4v16"/><path d="M8 20v2"/><path d="M16 20v2"/></svg>';
const STORM_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>';

const trainIcon = createIcon(TRAIN_SVG, '#ffff00');
const stormIcon = createIcon(STORM_SVG, '#ff0000');

// Calculate bearing between two points
const calculateBearing = (start: number[], end: number[]): number => {
    const lat1 = start[0] * Math.PI / 180;
    const lat2 = end[0] * Math.PI / 180;
    const dLon = (end[1] - start[1]) * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;

    return (bearing + 360) % 360; // Normalize to 0-360
};

const GeoMap = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    const [activeLayers, setActiveLayers] = useState(() => {
        const saved = localStorage.getItem('geo_tracker_filters');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { flights: true, trains: true, weather: true };
            }
        }
        return { flights: true, trains: true, weather: true };
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [simTime, setSimTime] = useState(0);
    const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
    const [mapReady, setMapReady] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([20, 0], 2);

        mapInstanceRef.current = map;

        // Mark map as ready after a brief delay to ensure it's fully initialized
        setTimeout(() => {
            setMapReady(true);
        }, 100);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            setMapReady(false);
        };
    }, []);

    // Handle Map Tiles (Layer Switching)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Remove old layer
        if (tileLayerRef.current) {
            map.removeLayer(tileLayerRef.current);
        }

        // Add new layer
        const url = mapType === 'map'
            ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        const attribution = mapType === 'map'
            ? '&copy; <a href="https://carto.com/attributions">CARTO</a>'
            : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

        const newLayer = L.tileLayer(url, { attribution }).addTo(map);
        tileLayerRef.current = newLayer;

    }, [mapType]);

    // Persist filter state to localStorage
    useEffect(() => {
        localStorage.setItem('geo_tracker_filters', JSON.stringify(activeLayers));
    }, [activeLayers]);

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setSimTime(t => (t + 0.0005) % 1);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Filter Items
    const filteredItems = useMemo(() => {
        const allItems = [
            ...geoData.flights.map(f => ({ ...f, category: 'flights' })),
            ...geoData.trains.map(t => ({ ...t, category: 'trains' })),
            ...geoData.storms.map(s => ({ ...s, category: 'weather' }))
        ];
        return allItems.filter(item =>
            (activeLayers[item.category as keyof typeof activeLayers]) &&
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeLayers, searchTerm]);

    // Calculate Position
    const getPosition = (trajectory: number[][], offset: number = 0) => {
        if (!trajectory || trajectory.length === 0) return [0, 0];
        if (trajectory.length === 1) return trajectory[0];

        const totalPoints = trajectory.length;
        const t = (simTime + offset) % 1;
        const index = Math.floor(t * (totalPoints - 1));
        const nextIndex = (index + 1) % totalPoints;

        const p1 = trajectory[index];
        const p2 = trajectory[nextIndex];
        const segmentT = (t * (totalPoints - 1)) - index;

        return [
            p1[0] + (p2[0] - p1[0]) * segmentT,
            p1[1] + (p2[1] - p1[1]) * segmentT
        ] as [number, number];
    };

    // Update Markers
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !mapReady) return;

        // Remove markers that are no longer in filteredItems
        const currentIds = new Set(filteredItems.map(i => i.id));
        Object.keys(markersRef.current).forEach(id => {
            if (!currentIds.has(id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        // Add or Update markers
        filteredItems.forEach((item, i) => {
            const pos = getPosition(item.trajectory, i * 0.1);

            // Calculate rotation for planes based on direction
            let rotation = 0;
            if (item.category === 'flights' && item.trajectory && item.trajectory.length > 1) {
                const t = (simTime + i * 0.1) % 1;
                const index = Math.floor(t * (item.trajectory.length - 1));
                const nextIndex = Math.min(index + 1, item.trajectory.length - 1);
                rotation = calculateBearing(item.trajectory[index], item.trajectory[nextIndex]);
            }

            const icon = item.category === 'flights' ? createIcon(PLANE_SVG, '#00ff41', rotation) :
                item.category === 'trains' ? trainIcon : stormIcon;

            if (markersRef.current[item.id]) {
                // Update position and icon (for planes with rotation)
                markersRef.current[item.id].setLatLng(pos as L.LatLngExpression);
                markersRef.current[item.id].setIcon(icon);
            } else {
                // Create new marker
                const marker = L.marker(pos as L.LatLngExpression, { icon })
                    .addTo(map)
                    .bindPopup(`
                        <div class="text-xs font-bold text-black">
                            ${item.name}<br/>
                            <span class="text-[10px] opacity-70">${item.status}</span>
                        </div>
                    `);

                marker.on('click', () => setSelectedItem(item));
                markersRef.current[item.id] = marker;
            }
        });

    }, [filteredItems, simTime, mapReady]);

    // Pan to Selected Item
    useEffect(() => {
        if (selectedItem && mapInstanceRef.current) {
            const pos = getPosition(selectedItem.trajectory); // Approximate pos
            mapInstanceRef.current.setView(pos as L.LatLngExpression, 5, { animate: true });
        }
    }, [selectedItem]);

    return (
        <div className="h-full flex relative bg-[#050a05]">
            {/* Map Area */}
            <div className="flex-1 relative z-0">
                <div ref={mapContainerRef} className="w-full h-full bg-[#050505]" />

                {/* Overlay Text */}
                <div className="absolute top-4 left-4 text-green-500 text-xs font-bold bg-black/80 p-1 border border-green-700 flex items-center gap-2 z-[400] pointer-events-none">
                    <MapIcon size={12} /> GLOBAL TRACKING // LIVE
                </div>

                {/* Map Type Toggle */}
                <div className="absolute top-4 right-4 z-[400] flex gap-1">
                    <button
                        onClick={() => setMapType('map')}
                        className={`p-1.5 border ${mapType === 'map' ? 'bg-green-900/80 border-green-400 text-green-400' : 'bg-black/80 border-green-900 text-green-700 hover:text-green-500'}`}
                        title="Map View"
                    >
                        <MapIcon size={16} />
                    </button>
                    <button
                        onClick={() => setMapType('satellite')}
                        className={`p-1.5 border ${mapType === 'satellite' ? 'bg-green-900/80 border-green-400 text-green-400' : 'bg-black/80 border-green-900 text-green-700 hover:text-green-500'}`}
                        title="Satellite View"
                    >
                        <Globe size={16} />
                    </button>
                </div>
            </div>

            {/* Side Panel */}
            <div className="w-80 border-l border-green-900 bg-black/90 flex flex-col backdrop-blur-sm z-10">
                <div className="p-4 border-b border-green-900">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-green-500">
                        <Layers size={18} /> TRACKING DATA
                    </h2>

                    {/* Search */}
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="SEARCH ID OR NAME..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-green-900/20 border border-green-700 p-2 pl-8 text-xs text-green-400 focus:outline-none focus:border-green-400"
                        />
                        <Search size={14} className="absolute left-2 top-2.5 text-green-700" />
                    </div>

                    {/* Layer Toggles */}
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => setActiveLayers(p => ({ ...p, flights: !p.flights }))}
                            className={`flex-1 py-1 text-[10px] border ${activeLayers.flights ? 'bg-green-900/40 border-green-500 text-green-400' : 'border-green-900 text-green-800'}`}
                        >
                            FLIGHTS
                        </button>
                        <button
                            onClick={() => setActiveLayers(p => ({ ...p, trains: !p.trains }))}
                            className={`flex-1 py-1 text-[10px] border ${activeLayers.trains ? 'bg-yellow-900/40 border-yellow-500 text-yellow-400' : 'border-green-900 text-green-800'}`}
                        >
                            TRAINS
                        </button>
                        <button
                            onClick={() => setActiveLayers(p => ({ ...p, weather: !p.weather }))}
                            className={`flex-1 py-1 text-[10px] border ${activeLayers.weather ? 'bg-red-900/40 border-red-500 text-red-400' : 'border-green-900 text-green-800'}`}
                        >
                            STORMS
                        </button>
                    </div>
                </div>

                {/* List View */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {filteredItems.map((item: any) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`p-2 border cursor-pointer transition-all hover:bg-green-900/30 flex items-center justify-between
                                ${selectedItem?.id === item.id ? 'border-green-400 bg-green-900/40' : 'border-green-900/50'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {item.category === 'flights' ? <Plane size={14} className="text-green-500" /> :
                                    item.category === 'trains' ? <Train size={14} className="text-yellow-500" /> :
                                        <CloudRain size={14} className="text-red-500" />}
                                <div>
                                    <div className="text-xs font-bold text-green-100">{item.name}</div>
                                    <div className="text-[10px] text-green-700">{item.id} // {item.status}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                {selectedItem && (
                    <div className="p-4 border-t border-green-500 bg-green-900/10">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-green-400">{selectedItem.name}</h3>
                            <span className="text-[10px] border border-green-600 px-1 text-green-600">{selectedItem.type}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-[10px] text-green-500 font-code">
                            <div>ID: <span className="text-white">{selectedItem.id}</span></div>
                            <div>ORIGIN: <span className="text-white">{selectedItem.origin}</span></div>
                            <div>DEST: <span className="text-white">{selectedItem.destination}</span></div>
                            <div className="mt-2 text-green-300 italic">{selectedItem.details}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeoMap;
