import { useState, useEffect } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { usePlugins, useLanguage } from './registry';

export const Layout = () => {
    const { plugins, activePluginId, setActivePluginId } = usePlugins();
    const { t } = useLanguage();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const ActiveComponent = plugins.find(p => p.id === activePluginId)?.component;

    return (
        <div className="w-full h-screen bg-[#050a05] text-[#00ff41] overflow-hidden flex flex-col relative font-hacker crt">
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
                    {plugins.map(plugin => (
                        <button
                            key={plugin.id}
                            onClick={() => setActivePluginId(plugin.id)}
                            className={`flex items-center gap-3 p-3 text-sm transition-all text-left border-l-2 hover:bg-green-900/20
                ${activePluginId === plugin.id ? 'border-green-500 text-white bg-green-900/30' : 'border-transparent text-green-700'}
              `}
                        >
                            <plugin.icon size={18} />
                            <span>{t(plugin.name)}</span>
                            {activePluginId === plugin.id && <ChevronRight size={14} className="ml-auto animate-pulse" />}
                        </button>
                    ))}
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 relative bg-black/50 p-2 overflow-hidden">
                    <div className="w-full h-full border border-green-900/50 relative overflow-hidden bg-black">
                        {ActiveComponent ? <ActiveComponent /> : <div className="p-10 text-center">NO MODULE LOADED</div>}
                    </div>
                </main>
            </div>
        </div>
    );
};
