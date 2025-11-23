import { Cpu, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const SysOverview = () => {
    return (
        <div className="p-6 grid grid-cols-2 gap-6 h-full overflow-y-auto">
            <div className="border border-green-800 p-4 flex flex-col">
                <h3 className="border-b border-green-800 pb-2 mb-4 flex items-center gap-2"><Cpu size={16} /> CPU LOAD</h3>
                <div className="flex-1 relative h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 20 }, () => ({ v: Math.random() * 100 }))}>
                            <Area type="step" dataKey="v" stroke="#00ff41" fill="#00441b" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="border border-green-800 p-4">
                <h3 className="border-b border-green-800 pb-2 mb-4 flex items-center gap-2"><Activity size={16} /> BIO-VITALS</h3>
                <div className="h-32 flex items-center justify-center text-4xl font-bold text-white">
                    {70 + Math.floor((Math.random() - 0.5) * 10)} <span className="text-sm text-green-500 ml-2">BPM</span>
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
    );
};

export default SysOverview;
