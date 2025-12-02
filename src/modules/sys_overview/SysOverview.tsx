import { useState, useEffect } from 'react';
import { Cpu, Wifi, Lock, Unlock, Radio, Terminal } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../core/registry';

const SysOverview = () => {
    const { t } = useLanguage();
    const [cpuLoad, setCpuLoad] = useState(45);
    const [memoryUsage, setMemoryUsage] = useState(62);
    const [networkTraffic, setNetworkTraffic] = useState(Array.from({ length: 20 }, () => ({ value: 50 })));
    const [signalStrength, setSignalStrength] = useState(85);
    const [launchCode, setLaunchCode] = useState('****-****-****');
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
            setMemoryUsage(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 5)));

            setNetworkTraffic(prev => {
                const newData = [...prev.slice(1), { value: Math.random() * 100 }];
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
            if (i < 2) code += '-';
        }
        setLaunchCode(code);
        setIsLocked(false);
    };

    return (
        <div className="h-full grid grid-cols-3 grid-rows-2 gap-4 p-4">
            {/* CPU & Memory */}
            <div className="col-span-1 border border-green-900 bg-black/40 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="text-green-500 font-bold flex items-center gap-2 mb-2">
                        <Cpu size={18} /> {t('sys.resources')}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-green-400 mb-1">
                                <span>{t('sys.cpu')}</span>
                                <span>{Math.round(cpuLoad)}%</span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${cpuLoad}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-green-400 mb-1">
                                <span>{t('sys.memory')}</span>
                                <span>{Math.round(memoryUsage)}%</span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${memoryUsage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-[10px] text-green-700 font-code mt-2">
                    {t('sys.uptime')}: 42:12:09 // {t('sys.kernel')}: 5.15.0-CYBER
                </div>
            </div>

            {/* Network Traffic */}
            <div className="col-span-2 border border-green-900 bg-black/40 p-4 relative overflow-hidden">
                <h3 className="text-green-500 font-bold flex items-center gap-2 mb-2 relative z-10">
                    <Wifi size={18} /> {t('sys.network')}
                </h3>
                <div className="absolute inset-0 pt-10 px-2 pb-2 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={networkTraffic}>
                            <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Signal Control */}
            <div className="border border-green-900 bg-black/40 p-4">
                <h3 className="text-green-500 font-bold flex items-center gap-2 mb-4">
                    <Radio size={18} /> {t('sys.signal')}
                </h3>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={signalStrength}
                    onChange={(e) => setSignalStrength(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-green-400 mt-2 font-code">
                    <span>{t('sys.tx_power')}: {signalStrength}dBm</span>
                    <span>{signalStrength > 80 ? t('sys.optimal') : signalStrength > 40 ? t('sys.stable') : t('sys.weak')}</span>
                </div>
            </div>

            {/* Launch Codes */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col items-center justify-center">
                <div className="text-xs text-red-500 font-bold mb-2">{t('sys.launch_protocol')}</div>
                <div className="font-code text-xl text-green-400 tracking-widest border border-green-700 px-4 py-2 bg-black mb-4">
                    {launchCode}
                </div>
                <button
                    onClick={generateCode}
                    className={`flex items-center gap-2 px-4 py-1 text-xs font-bold border transition-colors ${isLocked ? 'border-red-500 text-red-500 hover:bg-red-900/20' : 'border-green-500 text-green-500 hover:bg-green-900/20'}`}
                >
                    {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    {isLocked ? t('sys.generate_codes') : t('sys.codes_active')}
                </button>
            </div>

            {/* Abstract Data */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col justify-between">
                <h3 className="text-green-500 font-bold flex items-center gap-2 mb-2">
                    <Terminal size={18} /> {t('sys.threat_intel')}
                </h3>
                <div className="space-y-2 text-[10px] font-code text-green-400">
                    <div className="flex justify-between border-b border-green-900/50 pb-1">
                        <span>{t('sys.active_spies')}</span>
                        <span className="text-yellow-500">12</span>
                    </div>
                    <div className="flex justify-between border-b border-green-900/50 pb-1">
                        <span>{t('sys.rogue_ai')}</span>
                        <span className="text-red-500">{t('sys.detected')}</span>
                    </div>
                    <div className="flex justify-between border-b border-green-900/50 pb-1">
                        <span>{t('sys.global_defcon')}</span>
                        <span className="text-red-500 animate-pulse">3</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SysOverview;
