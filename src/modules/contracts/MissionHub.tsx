import { useState } from 'react';

const MissionHub = () => {
    const missions = [
        { id: 1, title: 'OP: SKYFALL', diff: 'HARD', reward: '500 BTC', details: 'Hack into the orbital satellite network and realign the array.' },
        { id: 2, title: 'OP: SILENT STEP', diff: 'MED', reward: '150 BTC', details: 'Erase criminal record for Client #99 from the NYPD database.' },
        { id: 3, title: 'OP: DATA MINE', diff: 'EASY', reward: '50 BTC', details: 'Extract user logs from the target corporate server.' },
    ];
    // @ts-ignore
    const [selected, setSelected] = useState<any>(null);

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

export default MissionHub;
