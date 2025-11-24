import { useState, useEffect, useRef } from 'react';
import { Shield, CheckCircle, Search, Skull, Database, Server, AlertTriangle, Key, Save, FileText, Ghost, Shuffle, Disc } from 'lucide-react';
import fsTemplatesRaw from './fs_templates.json';

// --- Helper function to interpolate placeholders in file system structures ---
const interpolateTemplate = (structure: any, ip: string, domain: string): any => {
    const result: any = {};
    for (const [key, value] of Object.entries(structure)) {
        if (typeof value === 'object' && value !== null) {
            if ('content' in value && typeof value.content === 'string') {
                result[key] = {
                    ...value,
                    content: value.content.replace(/\{\{ip\}\}/g, ip).replace(/\{\{domain\}\}/g, domain)
                };
            } else {
                result[key] = { ...value };
            }
        } else {
            result[key] = value;
        }
    }
    return result;
};

// Convert JSON templates to functional format
const FS_TEMPLATES = fsTemplatesRaw.map(template => ({
    type: template.type,
    name: template.name,
    structure: (ip: string, d: string) => interpolateTemplate(template.structure, ip, d)
}));

// --- TYPES ---
type Node = { id: number; x: number; y: number; status: 'own' | 'neutral' | 'enemy'; type: string; label: string; ip: string; port: number; difficulty: number };
type Link = { from: number; to: number };
type Tool = 'nmap' | 'hydra' | null;
type Phase = 'input' | 'tracing' | 'active' | 'victory';
type Utility = 'ghost' | 'proxy' | 'decoy';

const NetWar = () => {
    // --- STATE ---
    const [level, setLevel] = useState<number>(1);
    const [targetUrl, setTargetUrl] = useState('');
    const [phase, setPhase] = useState<Phase>('input');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const [selectedTool, setSelectedTool] = useState<Tool>(null);
    const [scannedNodes, setScannedNodes] = useState<number[]>([]);
    const [activeAction, setActiveAction] = useState<{ id: number, type: 'scan' | 'hack' } | null>(null);
    const [traceLevel, setTraceLevel] = useState(0);
    const [packets, setPackets] = useState<{ id: number, fromX: number, fromY: number, toX: number, toY: number, type: 'attack' | 'defense' }[]>([]);

    const [activeBuffs, setActiveBuffs] = useState<Utility[]>([]);
    const [cooldowns, setCooldowns] = useState<Record<Utility, number>>({ ghost: 0, proxy: 0, decoy: 0 });

    const [victoryData, setVictoryData] = useState<any>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        const savedLevel = localStorage.getItem('cyberos_level');
        if (savedLevel) setLevel(parseInt(savedLevel));
        addLog(`CYBEROS KERNEL v9.3.0 LOADED.`, 'info');
        addLog(`FILE SYSTEM EXTRACTION MODULE: ONLINE.`, 'success');
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // --- UTILITY LOGIC (BUFFED) ---
    const activateUtility = (util: Utility) => {
        const now = Date.now();
        if (now < cooldowns[util]) {
            addLog(`ERROR: ${util.toUpperCase()} RECHARGING...`, 'error'); return;
        }
        if (util === 'proxy') {
            setTraceLevel(prev => Math.max(0, prev - 40));
            addLog(`PROXY CHAIN: TRACE SCRUBBED (-40%).`, 'success');
            setCooldowns(prev => ({ ...prev, proxy: now + 12000 }));
        }
        else if (util === 'ghost') {
            setActiveBuffs(prev => [...prev, 'ghost']);
            addLog(`GHOST PROTOCOL: TRACE FROZEN (8s).`, 'success');
            setCooldowns(prev => ({ ...prev, ghost: now + 20000 }));
            setTimeout(() => {
                setActiveBuffs(prev => prev.filter(b => b !== 'ghost'));
                addLog(`GHOST PROTOCOL EXPIRED.`, 'warn');
            }, 8000);
        }
        else if (util === 'decoy') {
            setActiveBuffs(prev => [...prev, 'decoy']);
            addLog(`DECOY ACTIVE: DEFENSE PACKETS NULLIFIED (6s).`, 'success');
            setCooldowns(prev => ({ ...prev, decoy: now + 15000 }));
            setTimeout(() => {
                setActiveBuffs(prev => prev.filter(b => b !== 'decoy'));
                addLog(`DECOY EXPIRED.`, 'warn');
            }, 6000);
        }
    };

    // --- CORE LOOP ---
    useEffect(() => {
        let interval: any;
        if (activeAction && phase === 'active') {
            const targetNode = nodes.find(n => n.id === activeAction.id);
            const difficulty = targetNode ? targetNode.difficulty : 1;

            interval = setInterval(() => {
                if (!activeBuffs.includes('ghost')) {
                    setTraceLevel(prev => {
                        const increase = 0.4 + (difficulty * 0.6) + (level * 0.15);
                        const newLevel = prev + increase;
                        if (newLevel >= 100) { handleTraceFailure(); return 0; }
                        return newLevel;
                    });
                }
                if (Math.random() < (0.15 + (difficulty * 0.05)) && targetNode && targetNode.status !== 'own') {
                    const sourceId = findSourceID(targetNode.id);
                    spawnPacket(targetNode.id, sourceId, 'defense');
                    setTimeout(() => {
                        if (!activeBuffs.includes('decoy')) {
                            setTraceLevel(prev => Math.min(prev + 15, 100));
                            addLog(`WARNING: IDS SPIKE DETECTED (+15%)`, 'warn');
                        } else {
                            addLog(`DEFENSE PACKET MITIGATED BY DECOY.`, 'debug');
                        }
                    }, 800);
                }
            }, 500);
        } else {
            interval = setInterval(() => setTraceLevel(prev => Math.max(prev - 2, 0)), 200);
        }
        return () => clearInterval(interval);
    }, [activeAction, level, nodes, phase, activeBuffs]);

    const handleTraceFailure = () => {
        addLog('*** CRITICAL FAILURE: TRACE COMPLETE ***', 'error');
        setActiveAction(null); setTraceLevel(0); setPhase('input'); setNodes([]); setActiveBuffs([]);
    };

    // --- LOOT GENERATION ---
    const generateLoot = (ip: string, domain: string) => {
        const template = FS_TEMPLATES[Math.floor(Math.random() * FS_TEMPLATES.length)];
        const sshHash = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
        return {
            timestamp: Date.now(), domain, ip, sshKey: `SSH-RSA-${sshHash}`,
            systemName: template.name,
            fileSystem: template.structure(ip, domain)
        };
    };

    // --- GENERATORS & ACTIONS ---
    const generateLevel = (lvl: number) => {
        const newNodes: Node[] = []; const newLinks: Link[] = [];
        newNodes.push({ id: 1, x: 50, y: 92, status: 'own', type: 'home', label: 'LOCALHOST', ip: '127.0.0.1', port: 22, difficulty: 0 });
        const layers = Math.min(Math.floor(lvl / 2) + 1, 5);
        let previousLayerIds = [1]; let idCounter = 2;
        for (let i = 0; i < layers; i++) {
            const isLast = i === layers - 1;
            const count = isLast ? 1 : Math.ceil(Math.random() * (lvl < 3 ? 1 : lvl < 6 ? 2 : 3));
            const curIds = [];
            for (let j = 0; j < count; j++) {
                const x = count === 1 ? 50 : 15 + ((70 / (count - 1 || 1)) * j);
                const y = layers === 1 ? 10 : 75 - (((75 - 10) / (layers - 1)) * i);
                newNodes.push({
                    id: idCounter, x, y, status: isLast ? 'enemy' : 'neutral',
                    type: isLast ? 'target' : Math.random() > 0.6 ? 'firewall' : 'server',
                    label: isLast ? targetUrl.toUpperCase() : `NODE_${idCounter}`,
                    ip: `10.${lvl}.${i}.${idCounter}`, port: 80, difficulty: Math.floor(1 + i + (lvl * 0.5))
                });
                previousLayerIds.forEach((pid, idx) => { if ((idx === previousLayerIds.length - 1) || Math.random() > 0.4) newLinks.push({ from: pid, to: idCounter }); });
                curIds.push(idCounter); idCounter++;
            }
            previousLayerIds = curIds;
        }
        return { newNodes, newLinks };
    };

    const startTrace = () => {
        if (!targetUrl) return; setPhase('tracing'); setTraceLevel(0); setActiveBuffs([]);
        const { newNodes, newLinks } = generateLevel(level);
        setNodes([newNodes[0]]); setLinks([]); setScannedNodes([1]);
        addLog(`RESOLVING HOST: ${targetUrl}...`, 'debug');
        setTimeout(() => { setNodes(newNodes); setLinks(newLinks); setPhase('active'); addLog('TOPOLOGY MAPPED.', 'info'); }, 1000);
    };

    const performAction = (node: Node, type: 'scan' | 'hack') => {
        if (activeAction) return; setActiveAction({ id: node.id, type });
        spawnPacket(findSourceID(node.id), node.id, 'attack');
        setTimeout(() => {
            setActiveAction(curr => {
                if (!curr) return null;
                if (type === 'scan') { setScannedNodes(p => [...p, node.id]); addLog('SCAN COMPLETE.', 'success'); }
                else {
                    setNodes(p => p.map(n => n.id === node.id ? { ...n, status: 'own' } : n));
                    addLog('ACCESS GRANTED.', 'success');
                    if (node.type === 'target') {
                        setVictoryData(generateLoot(node.ip, targetUrl));
                        setPhase('victory');
                    }
                }
                return null;
            });
        }, 1000 + (node.difficulty * 400));
    };

    const saveAndContinue = () => {
        const existingStr = localStorage.getItem('cyberos_captured_hosts');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        existing.push(victoryData);
        localStorage.setItem('cyberos_captured_hosts', JSON.stringify(existing));
        setLevel(prev => { const next = prev + 1; localStorage.setItem('cyberos_level', next.toString()); return next; });
        setVictoryData(null); setTargetUrl(''); setPhase('input'); setNodes([]); setLinks([]);
        setScannedNodes([]); setTraceLevel(0); setActiveBuffs([]);
        addLog(`CONNECTION SAVED. READY FOR NEXT ASSIGNMENT.`, 'success');
    };

    const addLog = (msg: string, type: string) => setLogs(prev => [...prev, `${type}|[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`]);
    const findSourceID = (targetId: number) => {
        const owned = nodes.filter(n => n.status === 'own').map(n => n.id);
        const link = links.find(l => (owned.includes(l.from) && l.to === targetId) || (owned.includes(l.to) && l.from === targetId));
        return link ? (owned.includes(link.from) ? link.from : link.to) : 1;
    };
    const spawnPacket = (from: number, to: number, type: string) => {
        const start = nodes.find(n => n.id === from); const end = nodes.find(n => n.id === to);
        if (start && end) {
            const pid = Date.now();
            setPackets(prev => [...prev, { id: pid, fromX: start.x, fromY: start.y, toX: end.x, toY: end.y, type: type as any }]);
            setTimeout(() => setPackets(prev => prev.filter(p => p.id !== pid)), 1000);
        }
    };

    return (
        <div className="h-full w-full bg-black text-green-500 font-mono flex overflow-hidden border border-green-900 select-none text-sm relative">

            {/* --- VICTORY MODAL (RESTORED) --- */}
            {phase === 'victory' && victoryData && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-black border border-green-500 w-[600px] shadow-[0_0_50px_rgba(0,255,0,0.2)] flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="bg-green-600 text-black p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Key size={24} /> ACCESS GRANTED
                            </h2>
                            <div className="text-xs font-mono">SECURE_SHELL_V2</div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-20 h-20 bg-green-900/20 border border-green-700 rounded flex items-center justify-center">
                                    <Server size={40} className="text-green-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">TARGET DOMAIN</div>
                                    <div className="text-xl font-bold text-white mb-2">{victoryData.domain}</div>
                                    <div className="text-xs text-gray-400">IPV4 ADDRESS</div>
                                    <div className="font-mono text-green-400">{victoryData.ip}</div>
                                </div>
                            </div>

                            <div className="bg-green-900/10 border border-green-800 p-4 rounded font-mono text-xs space-y-2">
                                <div className="flex justify-between border-b border-green-900 pb-2">
                                    <span className="text-gray-500">SYSTEM ARCH:</span>
                                    <span className="text-white">{victoryData.systemName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">SSH KEY HASH:</span>
                                    <span className="text-yellow-400 font-bold">{victoryData.sshKey}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/50 p-2 rounded">
                                <FileText size={14} />
                                <span>{Object.keys(victoryData.fileSystem).length} FILES/DIRS DISCOVERED FOR EXFILTRATION</span>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-green-900 flex gap-4">
                            <button
                                onClick={() => {
                                    setPhase('input'); setVictoryData(null); // Discard
                                }}
                                className="flex-1 p-3 border border-red-900 text-red-500 hover:bg-red-900/20 text-xs font-bold transition-colors"
                            >
                                DISCARD CONNECTION
                            </button>
                            <button
                                onClick={saveAndContinue}
                                className="flex-[2] p-3 bg-green-600 text-black font-bold hover:bg-green-500 text-xs flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,255,0,0.4)]"
                            >
                                <Save size={16} /> SAVE KEYS TO TERMINAL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MAP AREA (Unchanged from previous versions) --- */}
            <div className={`flex-1 relative transition-all duration-1000 ${phase === 'input' ? 'bg-black' : "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"}`}>
                {phase === 'input' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/90">
                        <h1 className="text-5xl font-bold mb-2 tracking-widest text-green-500">CYBER<span className="text-white">OS</span></h1>
                        <div className="text-sm text-gray-500 mb-8">SECURE CONNECTION LEVEL: {level}</div>
                        <div className="flex gap-2 w-[400px]">
                            <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="ENTER TARGET DOMAIN" className="flex-1 bg-green-900/20 border border-green-700 p-3 text-green-400 outline-none font-mono uppercase text-sm" onKeyDown={(e) => e.key === 'Enter' && startTrace()} />
                            <button onClick={startTrace} disabled={!targetUrl} className="bg-green-600 text-black font-bold px-6">TRACE</button>
                        </div>
                    </div>
                )}
                <svg className="w-full h-full absolute inset-0 pointer-events-none">
                    {links.map((link, i) => {
                        const start = nodes.find(n => n.id === link.from); const end = nodes.find(n => n.id === link.to);
                        if (!start || !end) return null;
                        return (<line key={i} x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke={start.status === 'own' && end.status === 'own' ? "#00ff00" : "#004400"} strokeWidth="2" />);
                    })}
                </svg>
                {packets.map(p => (
                    <div key={p.id} className={`absolute w-3 h-3 rounded-full z-10 ${p.type === 'attack' ? 'bg-green-400' : 'bg-red-600'}`} style={{ '--startX': `${p.fromX}%`, '--startY': `${p.fromY}%`, '--endX': `${p.toX}%`, '--endY': `${p.toY}%`, animation: 'packetFly 1s linear forwards', left: 0, top: 0 } as any} />
                ))}
                {nodes.map(n => {
                    const isScanned = scannedNodes.includes(n.id);
                    return (
                        <div key={n.id} onClick={() => n.status !== 'own' && performAction(n, selectedTool === 'nmap' ? 'scan' : 'hack')} className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${n.status === 'own' ? 'opacity-100' : 'opacity-90 hover:scale-110'}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-black relative ${n.status === 'own' ? 'border-green-500 shadow-[0_0_15px_#0f0]' : n.status === 'enemy' ? 'border-red-500' : 'border-blue-500'} ${activeAction?.id === n.id ? 'animate-pulse' : ''}`}>
                                {n.status === 'own' ? <CheckCircle /> : n.type === 'target' ? <Database className="text-red-500" /> : <Shield className={isScanned ? "text-blue-400" : "text-gray-600"} />}
                            </div>
                            <div className={`absolute left-1/2 -translate-x-1/2 text-center bg-black/90 px-2 py-1 rounded border border-green-800 min-w-[100px] mt-2`}>
                                <div className="text-[10px] font-bold text-green-400">{isScanned || n.status === 'own' ? n.label : 'ENCRYPTED'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- SIDEBAR --- */}
            <div className="w-96 bg-black border-l border-green-900 flex flex-col z-20">
                {/* TRACE BAR */}
                <div className="p-4 border-b border-green-900">
                    <div className="text-xs font-bold text-green-500 flex justify-between mb-2">
                        <span className="flex items-center gap-2">
                            {traceLevel > 80 && <AlertTriangle size={14} className="animate-bounce text-red-500" />}
                            TRACE LEVEL {activeBuffs.includes('ghost') && <span className="text-blue-400 animate-pulse ml-2">[GHOSTED]</span>}
                        </span>
                        <span className={traceLevel > 80 ? 'text-red-500' : 'text-green-500'}>{traceLevel.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-900 rounded-full">
                        <div className={`h-full transition-all duration-200 ${activeBuffs.includes('ghost') ? 'bg-blue-500' : traceLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${traceLevel}%` }} />
                    </div>
                </div>

                {/* OFFENSIVE MODULES */}
                <div className="p-4 border-b border-green-900 bg-green-900/5">
                    <div className="text-xs text-gray-500 mb-2 tracking-widest">OFFENSIVE MODULES</div>
                    <div className="grid grid-cols-2 gap-2">
                        {/* NMAP + TOOLTIP */}
                        <div className="relative group">
                            <button onClick={() => setSelectedTool('nmap')} className={`w-full p-3 border rounded text-left ${selectedTool === 'nmap' ? 'bg-green-900/40 border-green-400 text-white' : 'border-green-900/50 text-gray-500'}`}>
                                <div className="font-bold text-xs flex gap-2"><Search size={14} /> NMAP</div>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-green-500 text-green-400 text-[10px] p-2 rounded shadow-lg hidden group-hover:block z-50 pointer-events-none">
                                <div className="font-bold border-b border-green-800 mb-1 pb-1">RECONNAISSANCE</div>
                                Reveals target Node Type and Open Ports. Required before attacking.
                            </div>
                        </div>
                        {/* HYDRA + TOOLTIP */}
                        <div className="relative group">
                            <button onClick={() => setSelectedTool('hydra')} className={`w-full p-3 border rounded text-left ${selectedTool === 'hydra' ? 'bg-red-900/40 border-red-400 text-white' : 'border-green-900/50 text-gray-500'}`}>
                                <div className="font-bold text-xs flex gap-2"><Skull size={14} /> HYDRA</div>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-red-500 text-red-400 text-[10px] p-2 rounded shadow-lg hidden group-hover:block z-50 pointer-events-none">
                                <div className="font-bold border-b border-red-800 mb-1 pb-1">BRUTE FORCE</div>
                                Cracks authentication on scanned nodes. Generates high Trace.
                            </div>
                        </div>
                    </div>
                </div>

                {/* DEFENSE UTILITIES */}
                <div className="p-4 border-b border-green-900">
                    <div className="text-xs text-gray-500 mb-2 tracking-widest">DEFENSE UTILITIES</div>
                    <div className="flex justify-between gap-2">
                        {/* GHOST */}
                        <div className="relative group flex-1">
                            <button onClick={() => activateUtility('ghost')}
                                disabled={Date.now() < cooldowns['ghost']}
                                className={`w-full p-2 border rounded flex flex-col items-center justify-center gap-1 transition-all
                                ${activeBuffs.includes('ghost') ? 'border-blue-400 bg-blue-900/30 text-white' :
                                        Date.now() < cooldowns['ghost'] ? 'border-gray-800 text-gray-700' : 'border-green-900/50 text-green-400 hover:bg-green-900/20'}`}>
                                <Ghost size={16} /> <div className="text-[9px] font-bold">GHOST</div>
                                {Date.now() < cooldowns['ghost'] && <div className="text-[8px]">{Math.ceil((cooldowns['ghost'] - Date.now()) / 1000)}s</div>}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-black border border-blue-500 text-blue-400 text-[10px] p-2 rounded shadow-lg hidden group-hover:block z-50 pointer-events-none">
                                <div className="font-bold border-b border-blue-800 mb-1 pb-1">CLOAKING</div>
                                Freezes Trace detection for 8 seconds. Use during deep hacks.
                            </div>
                        </div>
                        {/* PROXY */}
                        <div className="relative group flex-1">
                            <button onClick={() => activateUtility('proxy')}
                                disabled={Date.now() < cooldowns['proxy']}
                                className={`w-full p-2 border rounded flex flex-col items-center justify-center gap-1 transition-all
                                ${Date.now() < cooldowns['proxy'] ? 'border-gray-800 text-gray-700' : 'border-green-900/50 text-green-400 hover:bg-green-900/20'}`}>
                                <Shuffle size={16} /> <div className="text-[9px] font-bold">PROXY</div>
                                {Date.now() < cooldowns['proxy'] && <div className="text-[8px]">{Math.ceil((cooldowns['proxy'] - Date.now()) / 1000)}s</div>}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-black border border-green-500 text-green-400 text-[10px] p-2 rounded shadow-lg hidden group-hover:block z-50 pointer-events-none">
                                <div className="font-bold border-b border-green-800 mb-1 pb-1">IP BOUNCE</div>
                                Instantly scrubs 40% of accumulated Trace. 12s Cooldown.
                            </div>
                        </div>
                        {/* DECOY */}
                        <div className="relative group flex-1">
                            <button onClick={() => activateUtility('decoy')}
                                disabled={Date.now() < cooldowns['decoy']}
                                className={`w-full p-2 border rounded flex flex-col items-center justify-center gap-1 transition-all
                                ${activeBuffs.includes('decoy') ? 'border-yellow-400 bg-yellow-900/30 text-white' :
                                        Date.now() < cooldowns['decoy'] ? 'border-gray-800 text-gray-700' : 'border-green-900/50 text-green-400 hover:bg-green-900/20'}`}>
                                <Disc size={16} /> <div className="text-[9px] font-bold">DECOY</div>
                                {Date.now() < cooldowns['decoy'] && <div className="text-[8px]">{Math.ceil((cooldowns['decoy'] - Date.now()) / 1000)}s</div>}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-black border border-yellow-500 text-yellow-400 text-[10px] p-2 rounded shadow-lg hidden group-hover:block z-50 pointer-events-none">
                                <div className="font-bold border-b border-yellow-800 mb-1 pb-1">SPOOFING</div>
                                Grants immunity to Enemy Defense Packets (Red) for 6 seconds.
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONSOLE */}
                <div className="flex-1 overflow-y-auto p-2 font-mono bg-black/50 text-xs space-y-1">
                    {logs.map((l, i) => {
                        const [type, msg] = l.split('|');
                        return <div key={i} className={`${type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-400' : type === 'warn' ? 'text-yellow-500' : 'text-green-600'}`}>{msg}</div>
                    })}
                    <div ref={logsEndRef} />
                </div>
            </div>

            <style>{`@keyframes packetFly { 0% { left: var(--startX); top: var(--startY); transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { left: var(--endX); top: var(--endY); transform: translate(-50%, -50%) scale(0.5); opacity: 0; } }`}</style>
        </div>
    );
};

export default NetWar;