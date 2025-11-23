import { useEffect, useRef } from 'react';
import L from 'leaflet';

const GeoMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current).setView([51.505, -0.09], 3);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© CyberMap Data',
            maxZoom: 18,
        }).addTo(map);

        // Add some "Cyber" markers
        const targets = [
            { lat: 40.7128, lon: -74.0060, label: 'NY_SERVER_01' },
            { lat: 35.6762, lon: 139.6503, label: 'TOKYO_NODE_A' },
            { lat: 51.5074, lon: -0.1278, label: 'LONDON_HQ' },
            { lat: 55.7558, lon: 37.6173, label: 'MOSCOW_UPLINK' }
        ];

        targets.forEach(t => {
            const icon = L.divIcon({
                className: 'custom-icon',
                html: `<div style="background:#00ff41; width:8px; height:8px; box-shadow:0 0 10px #00ff41;"></div>`
            });
            L.marker([t.lat, t.lon], { icon }).addTo(map).bindPopup(t.label);
        });

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    return <div ref={mapRef} className="w-full h-full bg-black" />;
};

export default GeoMap;
