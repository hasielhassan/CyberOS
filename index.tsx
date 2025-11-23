import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, Activity, Globe, Lock, Shield, 
  Wifi, Radio, Eye, Search, Crosshair, 
  Database, Cpu, Skull, Zap, Map as MapIcon,
  FileText, Folder, Save, X, Play, AlertTriangle,
  Server, Key, Briefcase, ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- DYNAMIC RESOURCE LOADER ---
const useExternalScripts = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const loadScript = (src) => new Promise(resolve => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      document.head.appendChild(s);
    });

    const loadStyle = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
    };

    Promise.all([
      loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'),
      loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
    ]).then(() => {
      // Load OrbitControls after Three
      loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js').then(() => {
        setLoaded(true);
      });
    });
  }, []);
  return loaded;
};

// --- MOCK FILE SYSTEM ---
const initialFileSystem = {
  '/': { type: 'dir', children: ['home', 'bin', 'var', 'missions'] },
  '/home': { type: 'dir', children: ['user'] },
  '/home/user': { type: 'dir', children: ['notes.txt', 'todo.list', 'secret.key'] },
  '/bin': { type: 'dir', children: ['crack', 'trace', 'nuke'] },
  '/missions': { type: 'dir', children: ['operation_blackout.doc', 'target_list.csv'] },
  '/home/user/notes.txt': { type: 'file', content: 'Target acquired at sector 7G.\nNeed to decrypt the payload by midnight.' },
  '/home/user/todo.list': { type: 'file', content: '- Buy milk\n- Topple government\n- Feed the cat' },
  '/home/user/secret.key': { type: 'file', content: 'A77-F99-X22' },
  '/missions/operation_blackout.doc': { type: 'file', content: 'MISSION: BLACKOUT\nOBJ: Disable power grid in sector 4.\nREWARD: 5000 BTC' }
};

// --- STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Share+Tech+Mono&display=swap');
  
  :root { --theme: #00ff41; --bg: #050a05; }
  .font-hacker { font-family: 'Share Tech Mono', monospace; }
  .font-code { font-family: 'JetBrains Mono', monospace; }

  /* Leaflet Dark Mode Hack */
  .leaflet-layer, .leaflet-control-zoom-in, .leaflet-control-zoom-out, .leaflet-control-attribution {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(20%);
  }
  .leaflet-container { background: #000 !important; }

  /* CRT Effects */
  .crt::before {
    content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 50; background-size: 100% 2px, 3px 100%; pointer-events: none;
  }
  .scanline {
    width: 100%; height: 100px; z-index: 51;
    background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0, 255, 65, 0.1) 50%, rgba(0,0,0,0) 100%);
    opacity: 0.1; position: absolute; bottom: 100%;
    animation: scanline 10s linear infinite; pointer-events: none;
  }
  @keyframes scanline { 0% { bottom: 100%; } 100% { bottom: -100%; } }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #001100; }
  ::-webkit-scrollbar-thumb { background: #00441b; border: 1px solid #00ff41; }
  ::-webkit-scrollbar-thumb:hover { background: #00ff41; }
`;

// --- COMPONENTS ---

// 1. REAL WORLD MAP (LEAFLET)
const GeoMap = ({ active }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!active || !window.L || mapInstance.current) return;
    
    const L = window.L;
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
  }, [active]);

  return <div ref={mapRef} className="w-full h-full bg-black" />;
};

// 2. INTERACTIVE EARTH (THREE.JS)
const OrbitSat = ({ active }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!active || !window.THREE) return;
    const THREE = window.THREE;
    
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
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
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
    const sats = [];
    for(let i=0; i<50; i++) {
      const sGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
      const sMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.8 ? 0xff0000 : 0xffff00 });
      const s = new THREE.Mesh(sGeo, sMat);
      s.userData = { 
        axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
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
        if(s.position.length() < 1) s.position.set(s.userData.distance, 0, 0);
      });
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if(!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current && (mountRef.current.innerHTML = '');
    };
  }, [active]);

  return <div ref={mountRef} className="w-full h-full" />;
};

// 3. TERMINAL & EDITOR
const TerminalConsole = () => {
  const [history, setHistory] = useState(['Welcome to CyberOS v9.0', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const [path, setPath] = useState('/');
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('cyber_fs');
    return saved ? JSON.parse(saved) : initialFileSystem;
  });
  const [editor, setEditor] = useState({ active: false, file: null, content: '' });
  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('cyber_fs', JSON.stringify(files));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [files, history]);

  const resolvePath = (target) => {
    if (target.startsWith('/')) return target;
    return path === '/' ? `/${target}` : `${path}/${target}`;
  };

  const runCommand = (cmd) => {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();
    const arg = args[1];

    setHistory(h => [...h, `${path}> ${cmd}`]);

    switch (command) {
      case 'help':
        setHistory(h => [...h, 'Commands: ls, cd, cat, mkdir, nano, rm, clear']);
        break;
      case 'ls':
        const dir = files[path];
        if (dir && dir.type === 'dir') {
          setHistory(h => [...h, dir.children.join('  ')]);
        }
        break;
      case 'cd':
        if (!arg || arg === '/') { setPath('/'); return; }
        if (arg === '..') {
          const parts = path.split('/');
          parts.pop();
          setPath(parts.length === 1 ? '/' : parts.join('/'));
          return;
        }
        const newPath = resolvePath(arg);
        if (files[newPath] && files[newPath].type === 'dir') {
          setPath(newPath);
        } else {
          setHistory(h => [...h, `Directory not found: ${arg}`]);
        }
        break;
      case 'nano':
        if (!arg) { setHistory(h => [...h, 'Usage: nano <filename>']); return; }
        const filePath = resolvePath(arg);
        const file = files[filePath];
        if (file && file.type === 'dir') {
          setHistory(h => [...h, `Cannot edit directory: ${arg}`]);
        } else {
          setEditor({ active: true, file: filePath, content: file ? file.content : '' });
        }
        break;
      case 'mkdir':
        if (!arg) return;
        const mkPath = resolvePath(arg);
        setFiles(prev => ({
          ...prev,
          [mkPath]: { type: 'dir', children: [] },
          [path]: { ...prev[path], children: [...prev[path].children, arg] }
        }));
        setHistory(h => [...h, `Created directory: ${arg}`]);
        break;
      case 'clear':
        setHistory([]);
        break;
      default:
        setHistory(h => [...h, `Command not found: ${command}`]);
    }
  };

  const saveFile = () => {
    setFiles(prev => {
      const parentDir = editor.file.substring(0, editor.file.lastIndexOf('/')) || '/';
      const fileName = editor.file.split('/').pop();
      
      // Update parent if new file
      const newFiles = { ...prev, [editor.file]: { type: 'file', content: editor.content } };
      if (!prev[editor.file] && prev[parentDir]) {
        newFiles[parentDir] = { ...prev[parentDir], children: [...prev[parentDir].children, fileName] };
      }
      return newFiles;
    });
    setEditor({ active: false, file: null, content: '' });
    setHistory(h => [...h, `Saved file: ${editor.file}`]);
  };

  if (editor.active) {
    return (
      <div className="h-full flex flex-col bg-gray-900 text-white font-code p-2 border border-green-500">
        <div className="flex justify-between bg-green-800 px-2 text-black">
          <span>GNU nano 4.2</span>
          <span>{editor.file}</span>
        </div>
        <textarea 
          className="flex-1 bg-transparent resize-none outline-none p-2"
          value={editor.content}
          onChange={e => setEditor(prev => ({ ...prev, content: e.target.value }))}
        />
        <div className="flex gap-4 text-xs mt-2">
          <button onClick={saveFile} className="bg-white text-black px-2">^O Write Out</button>
          <button onClick={() => setEditor({ active: false, file: null, content: '' })} className="bg-white text-black px-2">^X Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-code text-sm p-2 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="text-green-400 break-words">{line}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center mt-2 border-t border-green-900 pt-2">
        <span className="text-green-600 mr-2">{path}&gt;</span>
        <input 
          className="bg-transparent border-none outline-none text-green-100 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key === 'Enter') { runCommand(input); setInput(''); } }}
          autoFocus
        />
      </div>
    </div>
  );
};

// 4. NETWORK ATTACK SIMULATOR
const NetWar = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 20, y: 50, status: 'own', label: 'HOME' },
    { id: 2, x: 50, y: 20, status: 'neutral', label: 'PROXY' },
    { id: 3, x: 80, y: 50, status: 'enemy', label: 'TARGET' },
    { id: 4, x: 50, y: 80, status: 'neutral', label: 'GATEWAY' },
  ]);
  const [attacking, setAttacking] = useState(null);

  const attack = (id) => {
    setAttacking(id);
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'own' } : n));
      setAttacking(null);
    }, 2000);
  };

  return (
    <div className="h-full relative bg-black border border-green-900 p-4">
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <line x1="20%" y1="50%" x2="50%" y2="20%" stroke="#004400" strokeWidth="2" />
        <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="#004400" strokeWidth="2" />
        <line x1="20%" y1="50%" x2="50%" y2="80%" stroke="#004400" strokeWidth="2" />
        <line x1="50%" y1="80%" x2="80%" y2="50%" stroke="#004400" strokeWidth="2" />
      </svg>
      {nodes.map(n => (
        <div 
          key={n.id}
          className={`absolute w-16 h-16 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all transform hover:scale-110
            ${n.status === 'own' ? 'border-green-500 bg-green-900/50' : n.status === 'enemy' ? 'border-red-500 bg-red-900/50' : 'border-blue-500 bg-blue-900/50'}
            ${attacking === n.id ? 'animate-pulse' : ''}
          `}
          style={{ left: `calc(${n.x}% - 2rem)`, top: `calc(${n.y}% - 2rem)` }}
          onClick={() => n.status !== 'own' && attack(n.id)}
        >
          <div className="text-[10px] text-center">
            {n.label}<br/>
            {attacking === n.id ? 'HACKING...' : n.status.toUpperCase()}
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-4 text-xs text-green-500">
        CLICK NODE TO INITIATE EXPLOIT
      </div>
    </div>
  );
};

// 5. DECRYPTION TOOLS
const Decryptor = () => {
  const [hash, setHash] = useState('5f4dcc3b5aa765d61d8327deb882cf99');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (isRunning && progress < 100) {
      const t = setInterval(() => setProgress(p => p + 1), 50);
      return () => clearInterval(t);
    } else if (progress >= 100) {
      setIsRunning(false);
      setResult('password123');
    }
  }, [isRunning, progress]);

  return (
    <div className="h-full flex flex-col p-8 gap-6 bg-black border border-green-900/50 text-green-500 font-hacker">
      <h2 className="text-2xl border-b border-green-500 pb-2">WPA2/SHA-256 CRACKER</h2>
      <div className="space-y-2">
        <label>TARGET HASH</label>
        <input className="w-full bg-green-900/10 border border-green-700 p-2 text-green-400" value={hash} onChange={e => setHash(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label>DICTIONARY</label>
        <select className="w-full bg-green-900/10 border border-green-700 p-2 text-green-400">
          <option>rockyou.txt (14MB)</option>
          <option>common_pass.txt (2KB)</option>
          <option>rainbow_table_v2.dat (50GB)</option>
        </select>
      </div>
      <div className="h-8 w-full bg-green-900/30 border border-green-600 relative">
        <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white mix-blend-difference">
          {progress}%
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={() => { setProgress(0); setIsRunning(true); setResult(''); }} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold">
          {isRunning ? 'RUNNING...' : 'START ATTACK'}
        </button>
        {result && <div className="text-xl animate-pulse text-red-500">MATCH FOUND: {result}</div>}
      </div>
    </div>
  );
};

// 6. MISSION HUB
const MissionHub = () => {
  const missions = [
    { id: 1, title: 'OP: SKYFALL', diff: 'HARD', reward: '500 BTC', details: 'Hack into the orbital satellite network and realign the array.' },
    { id: 2, title: 'OP: SILENT STEP', diff: 'MED', reward: '150 BTC', details: 'Erase criminal record for Client #99 from the NYPD database.' },
    { id: 3, title: 'OP: DATA MINE', diff: 'EASY', reward: '50 BTC', details: 'Extract user logs from the target corporate server.' },
  ];
  const [selected, setSelected] = useState(null);

  return (
    <div className="h-full flex gap-4 p-4 font-code">
      <div className="w-1/3 border-r border-green-900 pr-2 space-y-2">
        {missions.map(m => (
          <div 
            key={m.id} 
            onClick={() => setSelected(m)}
            className={`p-3 border cursor-pointer hover:bg-green-900/20 transition-colors ${selected?.id === m.id ? 'border-green-400 bg-green-900/30' : 'border-green-900'}`}
          >
            <div className="flex justify-between text-xs text-green-300">
              <span>{m.diff}</span>
              <span>{m.reward}</span>
            </div>
            <div className="font-bold text-lg">{m.title}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-black border border-green-900 p-4 relative">
        {selected ? (
          <div className="space-y-4 animate-[slideIn_0.3s]">
            <h1 className="text-3xl border-b border-green-500 pb-2">{selected.title}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-400">
              <div>DIFFICULTY: <span className="text-white">{selected.diff}</span></div>
              <div>PAYOUT: <span className="text-white">{selected.reward}</span></div>
            </div>
            <div className="bg-green-900/10 p-4 border-l-2 border-green-500">
              {selected.details}
            </div>
            <button className="absolute bottom-4 right-4 bg-green-600 text-black px-6 py-2 font-bold hover:bg-green-400">
              ACCEPT CONTRACT
            </button>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-green-800">
            SELECT A CONTRACT
          </div>
        )}
      </div>
    </div>
  );
};

// 7. SURVEILLANCE GRID
const CamGrid = () => {
  // Using some placeholder looping GIFs for "security footage" feel
  const feeds = [
    "https://media.giphy.com/media/3o6vXCKXwIq3O6X5Sw/giphy.gif", // Static/Glitch
    "https://media.giphy.com/media/l0HlO4p8jV8ZJ3lJ6/giphy.gif", // Traffic
    "https://media.giphy.com/media/3o7TKrEzvJbsOAov60/giphy.gif", // Server room
    "https://media.giphy.com/media/l2JHVUriDGEtWOx0c/giphy.gif"  // Coding
  ];

  return (
    <div className="grid grid-cols-2 gap-2 h-full p-2">
      {feeds.map((src, i) => (
        <div key={i} className="relative border border-green-800 bg-black overflow-hidden group">
          <img src={src} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity grayscale" />
          <div className="absolute top-2 left-2 bg-black/50 px-2 text-xs text-red-500 animate-pulse">REC • LIVE</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-code bg-black/50 px-1">CAM_{100+i} // SECTOR_{i+1}</div>
          <div className="absolute inset-0 pointer-events-none scanline opacity-20"></div>
        </div>
      ))}
    </div>
  );
};

// --- MAIN LAYOUT ---
const CyberHackOS = () => {
  const resourcesLoaded = useExternalScripts();
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [notifications, setNotifications] = useState([]);
  
  // Dashboard State
  const [vitalFreq, setVitalFreq] = useState(50);
  const [launchCode, setLaunchCode] = useState('US-ALPHA-1');
  
  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pushNotify = (msg) => {
    const id = Date.now();
    setNotifications(p => [...p, {id, msg}]);
    setTimeout(() => setNotifications(p => p.filter(n => n.id !== id)), 4000);
  };

  if (!resourcesLoaded) return <div className="bg-black h-screen text-green-500 flex items-center justify-center font-hacker">INITIALIZING KERNEL...</div>;

  return (
    <div className="w-full h-screen bg-[#050a05] text-[#00ff41] overflow-hidden flex flex-col relative font-hacker crt">
      <style>{styles}</style>
      <div className="scanline"></div>

      {/* HEADER */}
      <header className="h-14 border-b border-green-800 bg-black/90 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="text-green-500 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-widest glow-text leading-none">CYBER<span className="text-white">OS</span></h1>
            <div className="text-[10px] opacity-60">KERNEL v9.0.4 // ROOT ACCESS</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-code">
          <div className="hidden md:block text-green-700">MEM: 64TB // CPU: 12%</div>
          <div className="text-red-500 font-bold border border-red-900 px-2 py-1 bg-red-900/10">DEFCON 3</div>
          <div className="w-24 text-right">{time.toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-green-900 bg-black/40 flex flex-col p-2 gap-1 overflow-y-auto shrink-0 z-10 custom-scrollbar">
          {[
            { id: 'DASHBOARD', icon: Activity, label: 'Sys_Overview' },
            { id: 'TERMINAL', icon: Terminal, label: 'Terminal_Bash' },
            { id: 'MAP', icon: MapIcon, label: 'Geo_Tracker' },
            { id: 'SATELLITE', icon: Globe, label: 'Sat_Uplink' },
            { id: 'NETWAR', icon: Wifi, label: 'Net_Warfare' },
            { id: 'DECRYPT', icon: Lock, label: 'Decryption' },
            { id: 'MISSIONS', icon: Briefcase, label: 'Contracts' },
            { id: 'CAMS', icon: Eye, label: 'Surveillance' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 p-3 text-sm transition-all text-left border-l-2 hover:bg-green-900/20
                ${activeTab === item.id ? 'border-green-500 text-white bg-green-900/30' : 'border-transparent text-green-700'}
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto animate-pulse" />}
            </button>
          ))}
          
          <div className="mt-auto border-t border-green-900 pt-4 p-2 space-y-2">
            <div className="text-xs text-green-600 uppercase">Widgets</div>
            <div className="border border-green-800 p-2 bg-black/50">
              <div className="flex justify-between text-xs mb-1"><span>SIGNAL GAIN</span><span>{vitalFreq}%</span></div>
              <input type="range" min="0" max="100" value={vitalFreq} onChange={e => setVitalFreq(e.target.value)} className="w-full accent-green-500 h-1 bg-green-900" />
            </div>
            <div className="border border-green-800 p-2 bg-black/50">
              <div className="text-xs mb-1">LAUNCH KEY</div>
              <select 
                value={launchCode} 
                onChange={e => setLaunchCode(e.target.value)}
                className="w-full bg-black border border-green-700 text-xs p-1 text-green-400 outline-none"
              >
                <option>US-ALPHA-1</option>
                <option>RU-ZETA-9</option>
                <option>CN-DRAGON-X</option>
              </select>
              <button 
                onClick={() => pushNotify('LAUNCH SEQUENCE RESET')}
                className="w-full mt-2 bg-red-900/20 border border-red-900 text-red-500 text-[10px] py-1 hover:bg-red-900/50"
              >
                RESET PROTOCOL
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative bg-black/50 p-2 overflow-hidden">
          <div className="w-full h-full border border-green-900/50 relative overflow-hidden bg-black">
            {activeTab === 'DASHBOARD' && (
              <div className="p-6 grid grid-cols-2 gap-6 h-full overflow-y-auto">
                 <div className="border border-green-800 p-4 flex flex-col">
                   <h3 className="border-b border-green-800 pb-2 mb-4 flex items-center gap-2"><Cpu size={16}/> CPU LOAD</h3>
                   <div className="flex-1 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({length:20}, (_,i)=>({v: Math.random()*100}))}>
                          <Area type="step" dataKey="v" stroke="#00ff41" fill="#00441b" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                 </div>
                 <div className="border border-green-800 p-4">
                   <h3 className="border-b border-green-800 pb-2 mb-4 flex items-center gap-2"><Activity size={16}/> BIO-VITALS</h3>
                   <div className="h-32 flex items-center justify-center text-4xl font-bold text-white">
                     {70 + Math.floor((Math.random()-0.5) * 10)} <span className="text-sm text-green-500 ml-2">BPM</span>
                   </div>
                   <div className="text-center text-xs text-green-600">SUBJECT: A. ANDERSON</div>
                 </div>
                 <div className="col-span-2 border border-green-800 p-4 h-64">
                   <h3 className="border-b border-green-800 pb-2 mb-4">SYSTEM LOGS</h3>
                   <div className="font-code text-xs space-y-1 text-green-400 h-full overflow-hidden">
                     <div>[10:00:01] Connection established to 192.168.0.1</div>
                     <div>[10:00:05] Packet interception started...</div>
                     <div className="text-yellow-500">[10:01:22] WARNING: Intrusion detected on Port 8080</div>
                     <div>[10:02:00] Encryption keys rotated.</div>
                   </div>
                 </div>
              </div>
            )}
            
            {activeTab === 'TERMINAL' && <TerminalConsole />}
            {activeTab === 'MAP' && <GeoMap active={true} />}
            {activeTab === 'SATELLITE' && (
              <div className="w-full h-full relative">
                <OrbitSat active={true} />
                <div className="absolute top-4 left-4 bg-black/60 border border-green-500 p-2 text-xs space-y-2">
                  <div><input type="checkbox" defaultChecked /> COMMS SATS</div>
                  <div><input type="checkbox" defaultChecked /> SPY SATS</div>
                  <div><input type="checkbox" /> DEBRIS</div>
                </div>
              </div>
            )}
            {activeTab === 'NETWAR' && <NetWar />}
            {activeTab === 'DECRYPT' && <Decryptor />}
            {activeTab === 'MISSIONS' && <MissionHub />}
            {activeTab === 'CAMS' && <CamGrid />}
          </div>
        </main>
      </div>

      {/* TOAST NOTIFICATIONS */}
      <div className="absolute top-20 right-5 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-black border border-green-500 text-green-500 p-3 text-xs shadow-[0_0_10px_#00ff41] animate-bounce">
            {n.msg}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CyberHackOS;