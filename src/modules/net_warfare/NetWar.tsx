import { useState } from 'react';

const NetWar = () => {
    const [nodes, setNodes] = useState([
        { id: 1, x: 20, y: 50, status: 'own', label: 'HOME' },
        { id: 2, x: 50, y: 20, status: 'neutral', label: 'PROXY' },
        { id: 3, x: 80, y: 50, status: 'enemy', label: 'TARGET' },
        { id: 4, x: 50, y: 80, status: 'neutral', label: 'GATEWAY' },
    ]);
    const [attacking, setAttacking] = useState<number | null>(null);

    const attack = (id: number) => {
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
                        {n.label}<br />
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

export default NetWar;
