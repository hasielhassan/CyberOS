import { useState, useEffect } from 'react';
import { Dna, Activity, Skull, Microscope } from 'lucide-react';

const BioLab = () => {
    const [dnaSequence, setDnaSequence] = useState('');
    const [infectionRate, setInfectionRate] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate random DNA sequence
            const bases = ['A', 'C', 'G', 'T'];
            let seq = '';
            for (let i = 0; i < 40; i++) {
                seq += bases[Math.floor(Math.random() * bases.length)];
            }
            setDnaSequence(seq);

            // Fluctuate infection rate
            setInfectionRate(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full grid grid-cols-2 gap-4 p-4">
            {/* DNA Sequencer */}
            <div className="border border-green-900 bg-black/40 p-4 relative overflow-hidden">
                <h3 className="text-green-500 font-bold flex items-center gap-2 mb-4">
                    <Dna size={18} className="animate-spin" /> DNA SEQUENCER // LIVE
                </h3>
                <div className="font-code text-xs text-green-400 break-all leading-loose tracking-widest">
                    {dnaSequence}
                    <br />
                    {dnaSequence.split('').reverse().join('')}
                    <br />
                    {dnaSequence}
                    <br />
                    {dnaSequence.split('').reverse().join('')}
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-green-700">
                    PROCESSING GENOME...
                </div>
            </div>

            {/* Infection Map (Mock) */}
            <div className="border border-green-900 bg-black/40 p-4 flex flex-col">
                <h3 className="text-red-500 font-bold flex items-center gap-2 mb-4">
                    <Skull size={18} /> PATHOGEN TRACKER
                </h3>
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border-4 border-red-900 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-t-4 border-red-500 animate-spin"></div>
                        <div className="text-2xl font-bold text-red-500">{infectionRate.toFixed(1)}%</div>
                    </div>
                    <div className="absolute bottom-0 w-full text-center text-xs text-red-400">
                        GLOBAL INFECTION RATE
                    </div>
                </div>
            </div>

            {/* Disease Database */}
            <div className="col-span-2 border border-green-900 bg-black/40 p-4">
                <h3 className="text-blue-500 font-bold flex items-center gap-2 mb-4">
                    <Microscope size={18} /> VIRAL DATABASE
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {['CHIMERA-X', 'VOID-19', 'NEURO-PHAGE'].map((virus, i) => (
                        <div key={i} className="border border-blue-900/50 p-2 bg-blue-900/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-blue-400">{virus}</span>
                                <Activity size={12} className="text-blue-500" />
                            </div>
                            <div className="h-1 bg-blue-900/50 w-full">
                                <div className="h-full bg-blue-500" style={{ width: `${Math.random() * 100}%` }}></div>
                            </div>
                            <div className="text-[9px] text-blue-300 mt-1">THREAT LEVEL: CRITICAL</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BioLab;
