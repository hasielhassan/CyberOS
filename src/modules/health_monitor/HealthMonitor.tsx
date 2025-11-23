import { useState, useEffect } from 'react';
import { Heart, Activity, Brain, Ear } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const HealthMonitor = () => {
    const [heartRate, setHeartRate] = useState(72);
    const [brainActivity, setBrainActivity] = useState(45);
    const [data, setData] = useState(Array.from({ length: 20 }, () => ({ value: 50 })));

    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5)));
            setBrainActivity(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)));

            setData(prev => {
                const newData = [...prev.slice(1), { value: Math.random() * 100 }];
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full grid grid-cols-2 gap-4 p-4">
            {/* Heart Monitor */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <Heart size={48} className="text-red-500 animate-pulse mb-2" />
                <div className="text-4xl font-bold text-red-500">{Math.round(heartRate)} <span className="text-xs">BPM</span></div>
                <div className="absolute bottom-2 w-full h-12">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Brain Activity */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col items-center justify-center">
                <Brain size={48} className="text-blue-500 mb-2" />
                <div className="text-4xl font-bold text-blue-500">{Math.round(brainActivity)}%</div>
                <div className="text-xs text-blue-300 mt-1">NEURAL LOAD</div>
                <div className="w-full bg-blue-900/30 h-2 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${brainActivity}%` }}></div>
                </div>
            </div>

            {/* Hearing / Audio */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col items-center justify-center">
                <Ear size={32} className="text-yellow-500 mb-2" />
                <div className="flex items-end gap-1 h-16">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-3 bg-yellow-500 transition-all duration-200"
                            style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                    ))}
                </div>
                <div className="text-xs text-yellow-300 mt-2">AUDIO INPUT</div>
            </div>

            {/* Vitals Summary */}
            <div className="border border-green-900 bg-black/40 p-4">
                <h3 className="text-green-500 font-bold flex items-center gap-2 mb-4">
                    <Activity size={18} /> VITALS SUMMARY
                </h3>
                <div className="space-y-2 text-xs font-code">
                    <div className="flex justify-between text-green-400">
                        <span>OXYGEN:</span>
                        <span>98%</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                        <span>ADRENALINE:</span>
                        <span>NORMAL</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                        <span>STRESS:</span>
                        <span className="text-yellow-500">ELEVATED</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                        <span>HYDRATION:</span>
                        <span className="text-red-500">LOW</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMonitor;
