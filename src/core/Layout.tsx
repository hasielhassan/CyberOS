import { useState, Suspense } from 'react';
import { Shield, ChevronRight, Menu, LogOut } from 'lucide-react';
import { usePlugins, useLanguage } from './registry';
import { useAuth } from './AuthContext';

export const Layout = () => {
    const { plugins, activePluginId, setActivePluginId } = usePlugins();
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const ActiveComponent = plugins.find(p => p.id === activePluginId)?.component;

    return (
        <div className="w-full h-screen bg-[#050a05] text-[#00ff41] overflow-hidden flex flex-col relative font-hacker crt">
            <div className="scanline"></div>

            {/* HEADER */}
            <header className="h-14 border-b border-green-800 bg-black/90 flex items-center justify-between px-4 z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="text-green-500" />
                    </button>
                    <Shield className="text-green-500 animate-pulse hidden md:block" />
                    <div>
                        <h1 className="text-xl font-bold tracking-widest glow-text leading-none">CYBER<span className="text-white">OS</span></h1>
                        <div className="text-[10px] opacity-60 hidden md:block">KERNEL v9.0.4 // ROOT ACCESS</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-code">
                    <div className="hidden lg:block text-green-700">MEM: 64TB // CPU: 12%</div>
                    <div className="text-red-500 font-bold border border-red-900 px-2 py-1 bg-red-900/10 text-xs md:text-sm">DEFCON 3</div>
                    <div className="flex items-center gap-2 border-l border-green-900 pl-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-white">{user?.name}</div>
                            <div className="text-[10px] text-green-600">{user?.id}</div>
                        </div>
                        <button onClick={logout} className="p-1 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* SIDEBAR */}
                <aside className={`
          absolute md:relative z-10 h-full w-64 bg-black/95 md:bg-black/40 border-r border-green-900 
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col p-2 gap-1 overflow-y-auto custom-scrollbar
        `}>
                    {plugins.map(plugin => (
                        <button
                            key={plugin.id}
                            onClick={() => {
                                setActivePluginId(plugin.id);
                                setMobileMenuOpen(false);
                            }}
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
                <main className="flex-1 relative bg-black/50 p-2 overflow-hidden w-full">
                    <div className="w-full h-full border border-green-900/50 relative overflow-hidden bg-black">
                        <Suspense fallback={<div className="p-10 text-center text-green-500 animate-pulse">LOADING MODULE...</div>}>
                            {ActiveComponent ? <ActiveComponent /> : <div className="p-10 text-center">NO MODULE LOADED</div>}
                        </Suspense>
                    </div>
                </main>

                {/* Mobile Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-0 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};
