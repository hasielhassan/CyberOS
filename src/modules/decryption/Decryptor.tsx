import { useState, useEffect } from 'react';

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

export default Decryptor;
