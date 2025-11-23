import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const OrbitSat = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // Earth (Wireframe + Inner Sphere)
        const geometry = new THREE.IcosahedronGeometry(1, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x003311, wireframe: false, transparent: true, opacity: 0.9 });
        const earth = new THREE.Mesh(geometry, material);

        const wireGeo = new THREE.IcosahedronGeometry(1.01, 16);
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe: true, transparent: true, opacity: 0.3 });
        const wires = new THREE.Mesh(wireGeo, wireMat);

        scene.add(earth);
        scene.add(wires);

        // Satellites
        const sats: THREE.Mesh[] = [];
        for (let i = 0; i < 50; i++) {
            const sGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
            const sMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.8 ? 0xff0000 : 0xffff00 });
            const s = new THREE.Mesh(sGeo, sMat);
            s.userData = {
                axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
                speed: 0.005 + Math.random() * 0.01,
                distance: 1.2 + Math.random() * 0.5
            };
            scene.add(s);
            sats.push(s);
        }

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            sats.forEach(s => {
                s.position.applyAxisAngle(s.userData.axis, s.userData.speed);
                if (s.position.length() < 1) s.position.set(s.userData.distance, 0, 0);
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
        <div className="w-full h-full relative">
            <div ref={mountRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 bg-black/60 border border-green-500 p-2 text-xs space-y-2">
                <div><input type="checkbox" defaultChecked /> COMMS SATS</div>
                <div><input type="checkbox" defaultChecked /> SPY SATS</div>
                <div><input type="checkbox" /> DEBRIS</div>
            </div>
        </div>
    );
};

export default OrbitSat;
