import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Search, Rocket, Satellite, Radio } from 'lucide-react';

// Mock Data for Space Objects
const SPACE_OBJECTS = [
    { id: 1, name: 'ISS (ZARYA)', type: 'STATION', country: 'INT', tle: '...', speed: 0.001, axis: [0.5, 1, 0], distance: 1.3 },
    { id: 2, name: 'TIANGONG', type: 'STATION', country: 'CHN', tle: '...', speed: 0.0012, axis: [0.2, 1, 0.1], distance: 1.35 },
    { id: 3, name: 'HST', type: 'SATELLITE', country: 'USA', tle: '...', speed: 0.0008, axis: [1, 0.5, 0], distance: 1.4 },
    { id: 4, name: 'STARLINK-3015', type: 'SATELLITE', country: 'USA', tle: '...', speed: 0.002, axis: [0, 1, 0.5], distance: 1.25 },
    { id: 5, name: 'COSMOS-2542', type: 'MILITARY', country: 'RUS', tle: '...', speed: 0.0015, axis: [0.8, 0.8, 0.2], distance: 1.3 },
    { id: 6, name: 'USA-276', type: 'MILITARY', country: 'USA', tle: '...', speed: 0.0018, axis: [-0.5, 1, -0.2], distance: 1.28 },
    { id: 7, name: 'FALCON-9 DEB', type: 'DEBRIS', country: 'USA', tle: '...', speed: 0.003, axis: [1, 0, 0], distance: 1.22 },
    { id: 8, name: 'LONG MARCH 5B', type: 'ROCKET', country: 'CHN', tle: '...', speed: 0.0025, axis: [0.3, 1, 0], distance: 1.24 },
];

const OrbitSat = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [selectedObj, setSelectedObj] = useState<any>(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredObjects = SPACE_OBJECTS.filter(obj => {
        const matchesType = filter === 'ALL' || obj.type === filter;
        const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 3.5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
        controls.minDistance = 1.5;
        controls.maxDistance = 10;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 3, 5);
        scene.add(dirLight);

        // Earth
        const earthGroup = new THREE.Group();
        scene.add(earthGroup);

        // Load Texture
        const textureLoader = new THREE.TextureLoader();
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            map: textureLoader.load(new URL('./world.png', import.meta.url).href),
            specular: new THREE.Color('grey'),
            shininess: 10
        });
        const earth = new THREE.Mesh(geometry, material);
        earthGroup.add(earth);

        // Atmosphere Glow
        const atmosGeo = new THREE.SphereGeometry(1.1, 64, 64);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x00ff41,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
        earthGroup.add(atmosphere);

        // Satellites
        const satMeshes: THREE.Mesh[] = [];

        SPACE_OBJECTS.forEach(obj => {
            const orbitGroup = new THREE.Group();

            // Orbit Path (Visual)
            const pathGeo = new THREE.RingGeometry(obj.distance || 1.2, (obj.distance || 1.2) + 0.005, 64);
            const pathMat = new THREE.MeshBasicMaterial({
                color: obj.type === 'MILITARY' ? 0xff0000 : obj.type === 'DEBRIS' ? 0xaaaaaa : 0x00ff41,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.1
            });
            const path = new THREE.Mesh(pathGeo, pathMat);
            path.rotation.x = Math.PI / 2;
            // orbitGroup.add(path); // Optional: Show orbit paths

            // Satellite Object
            const satGeo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
            const satMat = new THREE.MeshBasicMaterial({
                color: obj.type === 'MILITARY' ? 0xff0000 : obj.type === 'STATION' ? 0xffff00 : 0x00ff41
            });
            const sat = new THREE.Mesh(satGeo, satMat);
            sat.userData = { ...obj, angle: Math.random() * Math.PI * 2 };

            orbitGroup.add(sat);

            // Tilt orbit
            orbitGroup.rotation.set(obj.axis[0], obj.axis[1], obj.axis[2]);

            earthGroup.add(orbitGroup);
            satMeshes.push(sat);
        });

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            // Rotate Satellites
            satMeshes.forEach(mesh => {
                mesh.userData.angle += mesh.userData.speed;
                const r = 1.3 + (mesh.userData.id * 0.05); // Offset radius slightly
                mesh.position.set(
                    Math.cos(mesh.userData.angle) * r,
                    0,
                    Math.sin(mesh.userData.angle) * r
                );
            });

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current && (mountRef.current.innerHTML = '');
        };
    }, []);

    return (
        <div className="w-full h-full relative flex">
            {/* 3D Viewport */}
            <div className="flex-1 relative">
                <div ref={mountRef} className="w-full h-full cursor-move" />

                {/* Overlay Info */}
                <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="text-xs text-green-500 font-bold border border-green-500 p-2 bg-black/50 inline-block">
                        ORBITAL VIEW // LIVE
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            <div className="w-80 border-l border-green-900 bg-black/80 flex flex-col backdrop-blur-sm">
                <div className="p-4 border-b border-green-900">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Radio size={18} className="animate-pulse" /> UPLINK DATA
                    </h2>

                    {/* Search */}
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="SEARCH ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-green-900/20 border border-green-700 p-2 pl-8 text-xs text-green-400 focus:outline-none focus:border-green-400"
                        />
                        <Search size={14} className="absolute left-2 top-2.5 text-green-700" />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2 custom-scrollbar">
                        {['ALL', 'STATION', 'SATELLITE', 'MILITARY', 'DEBRIS'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-[10px] px-2 py-1 border ${filter === f ? 'bg-green-500 text-black border-green-500' : 'border-green-800 text-green-600 hover:border-green-500'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {filteredObjects.map(obj => (
                        <div
                            key={obj.id}
                            onClick={() => setSelectedObj(obj)}
                            className={`p-2 border cursor-pointer transition-all hover:bg-green-900/30 flex items-center justify-between
                ${selectedObj?.id === obj.id ? 'border-green-400 bg-green-900/40' : 'border-green-900/50'}
              `}
                        >
                            <div className="flex items-center gap-3">
                                {obj.type === 'STATION' ? <Satellite size={16} /> : obj.type === 'ROCKET' ? <Rocket size={16} /> : <div className={`w-2 h-2 rounded-full ${obj.type === 'MILITARY' ? 'bg-red-500' : 'bg-green-500'}`} />}
                                <div>
                                    <div className="text-xs font-bold">{obj.name}</div>
                                    <div className="text-[10px] text-green-700">{obj.country} // {obj.type}</div>
                                </div>
                            </div>
                            <div className="text-[10px] font-code opacity-50">
                                {obj.speed.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                {selectedObj && (
                    <div className="p-4 border-t border-green-500 bg-green-900/10">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{selectedObj.name}</h3>
                            <span className="text-[10px] border border-green-600 px-1">{selectedObj.type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-green-400 font-code">
                            <div>ORIGIN: <span className="text-white">{selectedObj.country}</span></div>
                            <div>VELOCITY: <span className="text-white">27,600 KM/H</span></div>
                            <div>ALTITUDE: <span className="text-white">408 KM</span></div>
                            <div>INCLINATION: <span className="text-white">51.64°</span></div>
                        </div>
                        <button className="w-full mt-3 bg-green-500 text-black text-xs font-bold py-1 hover:bg-white transition-colors">
                            TRACK TARGET
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrbitSat;
