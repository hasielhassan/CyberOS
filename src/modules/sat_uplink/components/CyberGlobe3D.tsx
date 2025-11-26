import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SatelliteData, ObjectType } from '../types';
import { GEOJSON_URL } from '../constants';

interface CyberGlobe3DProps {
    filters: ObjectType[];
    onObjectSelect: (id: string | null) => void;
    selectedId: string | null;
    satellites: Record<string, SatelliteData>;
    jammedSats?: string[];
}

const CyberGlobe3D = ({ filters, onObjectSelect, selectedId, satellites, jammedSats = [] }: CyberGlobe3DProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const globeRef = useRef<THREE.Group | null>(null);
    const satMeshesRef = useRef<Record<string, THREE.Mesh>>({});
    const orbitLinesRef = useRef<Record<string, THREE.LineLoop>>({});

    const filtersRef = useRef(filters);
    const selectedIdRef = useRef(selectedId);
    const satellitesRef = useRef(satellites);

    useEffect(() => { filtersRef.current = filters; }, [filters]);
    useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

    // Effect to handle new satellites being added (e.g. from EONET fetch)
    useEffect(() => {
        satellitesRef.current = satellites;
        if (sceneRef.current && globeRef.current) {
            const globe = globeRef.current;

            // Clear existing satellites to prevent duplicates/stale references
            Object.values(satMeshesRef.current).forEach(mesh => globe.remove(mesh));
            Object.values(orbitLinesRef.current).forEach(line => globe.remove(line));
            satMeshesRef.current = {};
            orbitLinesRef.current = {};

            Object.values(satellites).forEach(sat => {
                if (!filters.includes(sat.type)) return;

                const isJammed = jammedSats.includes(sat.id);
                const color = isJammed ? 0x111111 : new THREE.Color(sat.color);
                const R = 100;
                let mesh: THREE.Mesh;

                if (['HAZARD', 'WILDFIRE', 'STORM'].includes(sat.type)) {
                    const geo = new THREE.ConeGeometry(2, 8, 8);
                    geo.rotateX(Math.PI / 2);
                    const mat = new THREE.MeshBasicMaterial({ color: color });
                    mesh = new THREE.Mesh(geo, mat);
                    if (sat.coordinates) {
                        const [lng, lat] = sat.coordinates;
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const x = -(R * Math.sin(phi) * Math.cos(theta));
                        const z = (R * Math.sin(phi) * Math.sin(theta));
                        const y = (R * Math.cos(phi));
                        mesh.position.set(x, y, z);
                        mesh.lookAt(0, 0, 0);
                    }
                    mesh.userData = { id: sat.id, isStatic: true };
                } else {
                    const alt = sat.visualAlt ? (R + sat.visualAlt) : 120;

                    const satGeo = new THREE.SphereGeometry(4, 16, 16);
                    const satMat = new THREE.MeshBasicMaterial({ color: color }); // Removed depthTest: false

                    mesh = new THREE.Mesh(satGeo, satMat);
                    const offset = Math.random() * 10;
                    mesh.userData = { id: sat.id, orbitAlt: alt, inclination: sat.inclination, speed: (1000 / (sat.period || 90)) * 0.005, offset: offset };

                    // Set initial position so satellite doesn't start at (0,0,0)
                    const initAngle = offset;
                    const x = alt * Math.cos(initAngle);
                    const z = alt * Math.sin(initAngle);
                    const incRad = (sat.inclination * Math.PI) / 180;
                    mesh.position.set(x, -z * Math.sin(incRad), z * Math.cos(incRad));

                    const curve = new THREE.EllipseCurve(0, 0, alt, alt, 0, 2 * Math.PI, false, 0);
                    const pts = curve.getPoints(64);
                    const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
                    orbitGeo.rotateX(Math.PI / 2);
                    orbitGeo.rotateX((sat.inclination * Math.PI) / 180);
                    const orbitMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6, linewidth: 2 });
                    const orbitMesh = new THREE.LineLoop(orbitGeo, orbitMat);
                    orbitLinesRef.current[sat.id] = orbitMesh;
                    globe.add(orbitMesh);
                }
                satMeshesRef.current[sat.id] = mesh;
                globe.add(mesh);
            });
        }
    }, [satellites, filters, jammedSats]);

    useEffect(() => {
        let frameId: number;
        const R = 100;

        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 2000);
        camera.position.z = 250;  // Closer camera for better satellite visibility
        camera.position.y = 30;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const globe = new THREE.Group();
        scene.add(globe);
        globeRef.current = globe;

        const coreGeo = new THREE.SphereGeometry(R - 0.5, 64, 64);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x020403, transparent: true, opacity: 0.5 });
        globe.add(new THREE.Mesh(coreGeo, coreMat));

        // Grid
        const gridGeo = new THREE.BufferGeometry();
        const gridPoints = [];
        for (let lat = -80; lat <= 80; lat += 20) {
            const r = R * Math.cos(lat * Math.PI / 180);
            const y = R * Math.sin(lat * Math.PI / 180);
            for (let lng = 0; lng <= 360; lng += 5) {
                const x = r * Math.cos(lng * Math.PI / 180);
                const z = r * Math.sin(lng * Math.PI / 180);
                gridPoints.push(new THREE.Vector3(x, y, z));
                if (lng > 0) gridPoints.push(new THREE.Vector3(x, y, z));
            }
        }
        for (let lng = 0; lng < 360; lng += 20) {
            for (let lat = -90; lat <= 90; lat += 5) {
                const r = R * Math.cos(lat * Math.PI / 180);
                const y = R * Math.sin(lat * Math.PI / 180);
                const x = r * Math.cos(lng * Math.PI / 180);
                const z = r * Math.sin(lng * Math.PI / 180);
                gridPoints.push(new THREE.Vector3(x, y, z));
                if (lat > -90) gridPoints.push(new THREE.Vector3(x, y, z));
            }
        }
        gridGeo.setFromPoints(gridPoints);
        const gridMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.15 });
        globe.add(new THREE.LineSegments(gridGeo, gridMat));

        // GeoJSON
        fetch(GEOJSON_URL)
            .then(res => res.json())
            .then(data => {
                const material = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });
                data.features.forEach((feature: any) => {
                    const drawPoly = (coords: any[]) => {
                        const points: any[] = [];
                        coords.forEach(([lng, lat]: any) => {
                            const phi = (90 - lat) * (Math.PI / 180);
                            const theta = (lng + 180) * (Math.PI / 180);
                            const x = -(R * Math.sin(phi) * Math.cos(theta));
                            const z = (R * Math.sin(phi) * Math.sin(theta));
                            const y = (R * Math.cos(phi));
                            points.push(new THREE.Vector3(x, y, z));
                        });
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        globe.add(new THREE.Line(geometry, material));
                    };
                    if (feature.geometry.type === 'Polygon') feature.geometry.coordinates.forEach((ring: any) => drawPoly(ring));
                    else if (feature.geometry.type === 'MultiPolygon') feature.geometry.coordinates.forEach((poly: any) => poly.forEach((ring: any) => drawPoly(ring)));
                });
            }).catch(() => { });

        // Controls
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isMiddleDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (e: MouseEvent) => {
            if (e.button === 1) {
                isMiddleDragging = true;
                previousMousePosition = { x: e.clientX, y: e.clientY };
                e.preventDefault();
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isMiddleDragging) {
                const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
                globe.rotation.y += deltaMove.x * 0.005;
                globe.rotation.x += deltaMove.y * 0.005;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            } else {
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const visibleMeshes = Object.values(satMeshesRef.current).filter(mesh => {
                    const sat = satellitesRef.current[mesh.userData.id];
                    return sat && filtersRef.current.includes(sat.type);
                });
                const intersects = raycaster.intersectObjects(visibleMeshes);
                containerRef.current!.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
            }
        };

        const onClick = (e: MouseEvent) => {
            if (e.button !== 0) return;
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const visibleMeshes = Object.values(satMeshesRef.current).filter(mesh => {
                const sat = satellitesRef.current[mesh.userData.id];
                return sat && filtersRef.current.includes(sat.type);
            });
            const intersects = raycaster.intersectObjects(visibleMeshes);
            onObjectSelect(intersects.length > 0 ? intersects[0].object.userData.id : null);
        };

        const onMouseUp = () => { isMiddleDragging = false; };
        const onWheel = (e: WheelEvent) => {
            const newZ = camera.position.z + e.deltaY * 0.5;
            camera.position.z = Math.max(200, Math.min(800, newZ));
        };

        const canvas = renderer.domElement;
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('click', onClick);
        canvas.addEventListener('wheel', onWheel);

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                // Rotate satellites
                Object.values(satMeshesRef.current).forEach(mesh => {
                    if (mesh.userData.isStatic) return;

                    const sat = satellitesRef.current[mesh.userData.id];
                    if (sat) {
                        const time = Date.now() * 0.0001 * (sat.period ? 90 / sat.period : 1);
                        const angle = mesh.userData.offset + time;
                        const alt = mesh.userData.orbitAlt;
                        const x = alt * Math.cos(angle);
                        const z = alt * Math.sin(angle);
                        const incRad = (mesh.userData.inclination * Math.PI) / 180;

                        mesh.position.set(x, -z * Math.sin(incRad), z * Math.cos(incRad));
                    }
                });

                // Rotate globe slowly
                if (!isMiddleDragging && globeRef.current) {
                    globeRef.current.rotation.y += 0.0005;
                }

                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full" />;
};

export default CyberGlobe3D;
