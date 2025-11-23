import { useState } from 'react';
import { FileText, Target, Crosshair, AlertTriangle } from 'lucide-react';

interface Mission {
    id: string;
    codename: string;
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
    difficulty: 'LOW' | 'MED' | 'HIGH' | 'EXTREME';
    target: string;
    location: string;
    reward: string;
    description: string;
    intel: string[];
    image: string;
}

const MISSIONS: Mission[] = [
    {
        id: 'OP-ALPHA-9',
        codename: 'SILENT ECHO',
        status: 'ACTIVE',
        difficulty: 'HIGH',
        target: 'Dr. Aris Thorne',
        location: 'Berlin, Germany',
        reward: '50,000 CR',
        description: 'Intercept and extract Dr. Thorne before he leaks the Project Chimera blueprints to the syndicate. Use non-lethal force only.',
        intel: ['Subject is paranoid', 'Heavily guarded compound', 'Weakness: Gambling addiction'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200'
    },
    {
        id: 'OP-BRAVO-2',
        codename: 'NIGHTFALL',
        status: 'ACTIVE',
        difficulty: 'EXTREME',
        target: 'Server Farm 7',
        location: 'Siberia, Russia',
        reward: '120,000 CR',
        description: 'Infiltrate the remote server farm and upload the "Blackout" virus. Exfiltration must be completed before the backup generators kick in.',
        intel: ['Thermal sensors active', 'Automated turrets', 'Time window: 15 mins'],
        image: 'https://images.unsplash.com/photo-1558494949-efc5e60c9480?fit=crop&w=200&h=200'
    },
    {
        id: 'OP-CHARLIE-5',
        codename: 'GHOST PROTOCOL',
        status: 'COMPLETED',
        difficulty: 'MED',
        target: 'The Broker',
        location: 'Macau, China',
        reward: '75,000 CR',
        description: 'Surveillance operation. Track "The Broker" and identify his contacts within the government.',
        intel: ['Target moves frequently', 'Uses body doubles', 'Loves high-stakes poker'],
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=200&h=200'
    },
    {
        id: 'OP-DELTA-1',
        codename: 'RED SKIES',
        status: 'FAILED',
        difficulty: 'HIGH',
        target: 'Satellite Array',
        location: 'Nevada, USA',
        reward: '90,000 CR',
        description: 'Sabotage the satellite uplink to prevent the launch code transmission.',
        intel: ['Heavily fortified', 'Air support on standby', 'Stealth required'],
        image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d8831?fit=crop&w=200&h=200'
    }
];

const MissionHub = () => {
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

    return (
        <div className="h-full flex gap-4 p-4">
            {/* Mission List */}
            <div className="w-1/3 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
                <h2 className="text-green-500 font-bold text-lg border-b border-green-900 pb-2 mb-2 flex items-center gap-2">
                    <Target size={20} /> ACTIVE CONTRACTS
                </h2>
                {MISSIONS.map(mission => (
                    <div
                        key={mission.id}
                        onClick={() => setSelectedMission(mission)}
                        className={`p-3 border cursor-pointer transition-all hover:bg-green-900/20 relative overflow-hidden group
              ${selectedMission?.id === mission.id ? 'border-green-400 bg-green-900/30' : 'border-green-900/50'}
            `}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm font-bold text-green-400">{mission.codename}</div>
                                <div className="text-[10px] text-green-700">{mission.id} // {mission.location}</div>
                            </div>
                            <div className={`text-[10px] px-2 py-0.5 border ${mission.status === 'ACTIVE' ? 'border-green-500 text-green-500' :
                                mission.status === 'COMPLETED' ? 'border-blue-500 text-blue-500' : 'border-red-500 text-red-500'
                                }`}>
                                {mission.status}
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-[10px] font-code opacity-70">
                            <span>DIFF: {mission.difficulty}</span>
                            <span>REWARD: {mission.reward}</span>
                        </div>
                        {selectedMission?.id === mission.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mission Details (Document Scan Style) */}
            <div className="flex-1 border border-green-900/50 bg-black/40 relative p-6 overflow-y-auto custom-scrollbar">
                {selectedMission ? (
                    <div className="relative">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px]"></div>

                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-green-800 pb-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-green-400 tracking-wider">{selectedMission.codename}</h1>
                                <div className="text-xs text-green-700 font-code mt-1">REF: {selectedMission.id} // {new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="border border-green-500 p-1">
                                <img src={selectedMission.image} alt="Target" className="w-24 h-24 object-cover grayscale contrast-125 brightness-75" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-green-600 font-bold text-xs mb-2 flex items-center gap-2">
                                    <Crosshair size={14} /> TARGET PROFILE
                                </h3>
                                <div className="text-sm text-green-300 font-code mb-4">
                                    <span className="text-green-700">NAME:</span> {selectedMission.target}<br />
                                    <span className="text-green-700">LOC:</span> {selectedMission.location}<br />
                                    <span className="text-green-700">PAYOUT:</span> {selectedMission.reward}
                                </div>

                                <h3 className="text-green-600 font-bold text-xs mb-2 flex items-center gap-2">
                                    <FileText size={14} /> MISSION BRIEF
                                </h3>
                                <p className="text-xs text-green-400 leading-relaxed mb-4 border-l-2 border-green-800 pl-3">
                                    {selectedMission.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-green-600 font-bold text-xs mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> INTEL & RISKS
                                </h3>
                                <ul className="text-xs text-green-400 space-y-2">
                                    {selectedMission.intel.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-green-700 mt-0.5">►</span> {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 border border-green-800 p-3 bg-green-900/10">
                                    <div className="text-[10px] text-green-600 mb-1">STATUS UPDATE</div>
                                    <div className={`text-lg font-bold ${selectedMission.status === 'ACTIVE' ? 'text-green-500 animate-pulse' :
                                        selectedMission.status === 'COMPLETED' ? 'text-blue-500' : 'text-red-500'
                                        }`}>
                                        {selectedMission.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-green-900/50 flex justify-between items-center">
                            <div className="text-[10px] text-green-800">CLASSIFIED // EYES ONLY</div>
                            <button className="bg-green-900/20 border border-green-600 text-green-400 px-4 py-1 text-xs hover:bg-green-500 hover:text-black transition-colors">
                                {selectedMission.status === 'ACTIVE' ? 'ACCEPT CONTRACT' : 'ARCHIVE RECORD'}
                            </button>
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-green-800 opacity-50">
                        <Target size={48} className="mb-4 animate-pulse" />
                        <div className="text-sm font-code">SELECT A MISSION FILE</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionHub;
