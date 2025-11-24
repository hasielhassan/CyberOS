import { useState } from 'react';
import { Target, CheckCircle, Clock } from 'lucide-react';
import { useMissions } from './MissionsContext';
import { Mission } from './types';
import { AcceptMissionDialog } from './components/AcceptMissionDialog';
import { MissionDetail } from './components/MissionDetail';

const MissionHub = () => {
    const {
        missions,
        activeMissionId,
        acceptMission,
        completeMission,
        abandonMission,
        isMissionCompleted
    } = useMissions();

    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [missionToAccept, setMissionToAccept] = useState<Mission | null>(null);

    const getMissionStatus = (mission: Mission): 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' => {
        if (isMissionCompleted(mission.id)) return 'COMPLETED';
        if (activeMissionId === mission.id) return 'ACTIVE';
        return 'AVAILABLE';
    };

    const handleAcceptMission = () => {
        if (missionToAccept) {
            acceptMission(missionToAccept.id);
            setSelectedMission(missionToAccept);
            setMissionToAccept(null);
        }
    };

    const handleCompleteMission = () => {
        if (selectedMission) {
            completeMission(selectedMission.id);
        }
    };

    const handleAbandonMission = () => {
        abandonMission();
        setSelectedMission(null);
    };

    const difficultyColors = {
        EASY: 'text-green-500 border-green-500',
        MEDIUM: 'text-yellow-500 border-yellow-500',
        HARD: 'text-orange-500 border-orange-500',
        EXPERT: 'text-red-500 border-red-500'
    };

    const statusColors = {
        AVAILABLE: 'border-green-700 text-green-700',
        ACTIVE: 'border-green-500 text-green-500 bg-green-900/20',
        COMPLETED: 'border-blue-500 text-blue-500'
    };

    return (
        <div className="h-full flex gap-4 p-4">
            {/* Mission List */}
            <div className="w-1/3 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
                <h2 className="text-green-500 font-bold text-lg border-b border-green-900 pb-2 mb-2 flex items-center gap-2">
                    <Target size={20} /> MISSION CONTRACTS
                </h2>
                {missions.map(mission => {
                    const status = getMissionStatus(mission);
                    return (
                        <div
                            key={mission.id}
                            onClick={() => setSelectedMission(mission)}
                            className={`p-3 border cursor-pointer transition-all hover:bg-green-900/20 relative overflow-hidden group
                                ${selectedMission?.id === mission.id ? 'border-green-400 bg-green-900/30' : 'border-green-900/50'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-green-400">{mission.title}</div>
                                    <div className="text-[10px] text-green-700 font-mono">{mission.id}</div>
                                </div>
                                <div className={`text-[10px] px-2 py-0.5 border ${statusColors[status]} flex items-center gap-1`}>
                                    {status === 'COMPLETED' && <CheckCircle size={10} />}
                                    {status}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-code text-green-600">
                                <span className={`${difficultyColors[mission.difficulty]}`}>
                                    {mission.difficulty}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {mission.estimatedTime}
                                </span>
                                <span>{mission.reward}</span>
                            </div>
                            {selectedMission?.id === mission.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mission Details */}
            <div className="flex-1 border border-green-900/50 bg-black/40 relative overflow-hidden">
                {selectedMission ? (
                    <div className="h-full flex flex-col">
                        <MissionDetail
                            mission={selectedMission}
                            isActive={activeMissionId === selectedMission.id}
                            isCompleted={isMissionCompleted(selectedMission.id)}
                            onComplete={activeMissionId === selectedMission.id ? handleCompleteMission : undefined}
                            onAbandon={activeMissionId === selectedMission.id ? handleAbandonMission : undefined}
                        />
                        {getMissionStatus(selectedMission) === 'AVAILABLE' && (
                            <div className="p-6 border-t-2 border-green-900">
                                <button
                                    onClick={() => setMissionToAccept(selectedMission)}
                                    className="w-full py-3 bg-green-600 text-black hover:bg-green-500 transition-colors text-sm font-bold uppercase animate-pulse"
                                    disabled={activeMissionId !== null}
                                >
                                    {activeMissionId !== null ? 'COMPLETE ACTIVE MISSION FIRST' : 'ACCEPT MISSION'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-green-800 opacity-50">
                        <Target size={48} className="mb-4 animate-pulse" />
                        <div className="text-sm font-code">SELECT A MISSION FILE</div>
                    </div>
                )}
            </div>

            {/* Accept Mission Dialog */}
            {missionToAccept && (
                <AcceptMissionDialog
                    mission={missionToAccept}
                    onAccept={handleAcceptMission}
                    onCancel={() => setMissionToAccept(null)}
                />
            )}
        </div>
    );
};

export default MissionHub;
