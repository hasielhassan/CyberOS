import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Scan } from 'lucide-react';
import { useAuth } from './AuthContext';

export const Login = () => {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [scanning, setScanning] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !id) return;

        setScanning(true);
        setTimeout(() => {
            login(name, id);
        }, 2000);
    };

    return (
        <div className="w-full h-screen bg-[#050a05] text-[#00ff41] flex items-center justify-center font-hacker relative overflow-hidden">
            <div className="scanline"></div>

            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border border-green-900/30" />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md p-8 border border-green-500 bg-black/80 shadow-[0_0_50px_rgba(0,255,65,0.1)]">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500 -mb-1 -mr-1"></div>

                <div className="text-center mb-8">
                    <Shield className="w-16 h-16 mx-auto mb-4 animate-pulse text-green-500" />
                    <h1 className="text-3xl font-bold tracking-[0.5em] glow-text">CYBER<span className="text-white">OS</span></h1>
                    <div className="text-xs tracking-widest mt-2 text-green-700">RESTRICTED ACCESS // LEVEL 5</div>
                </div>

                {scanning ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="relative w-24 h-24 border-2 border-green-500 rounded-full flex items-center justify-center overflow-hidden">
                            <Scan className="w-12 h-12 animate-spin text-green-400" />
                            <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
                        </div>
                        <div className="text-lg animate-pulse">VERIFYING BIOMETRICS...</div>
                        <div className="w-full h-1 bg-green-900 mt-4">
                            <div className="h-full bg-green-500 animate-[width_2s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-green-600 flex items-center gap-2">
                                <Fingerprint size={14} /> Agent Identity
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black border border-green-800 p-3 text-green-400 focus:border-green-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all placeholder-green-900"
                                placeholder="ENTER CODENAME"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-green-600 flex items-center gap-2">
                                <Lock size={14} /> Access Key
                            </label>
                            <input
                                type="password"
                                value={id}
                                onChange={e => setId(e.target.value)}
                                className="w-full bg-black border border-green-800 p-3 text-green-400 focus:border-green-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all placeholder-green-900"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-900/20 border border-green-500 text-green-400 py-3 font-bold tracking-widest hover:bg-green-500 hover:text-black transition-all duration-300 uppercase flex items-center justify-center gap-2 group"
                        >
                            <Shield size={18} className="group-hover:rotate-180 transition-transform" />
                            Initialize Uplink
                        </button>
                    </form>
                )}

                <div className="mt-8 text-[10px] text-center text-green-800 space-y-1">
                    <div>UNAUTHORIZED ACCESS WILL BE PROSECUTED</div>
                    <div>IP LOGGED: 192.168.0.X</div>
                </div>
            </div>
        </div>
    );
};
