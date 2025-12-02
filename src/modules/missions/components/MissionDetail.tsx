import { useState } from 'react';
import { FileText, CheckCircle, XCircle, CheckSquare, Square } from 'lucide-react';
import { Mission } from '../types';
import { useMissionState } from '../../../hooks/useMissionState';
import { DocumentViewer } from '../../directory/components/DocumentViewer';
import { Document } from '../../directory/types';

interface MissionDetailProps {
    mission: Mission;
    isActive: boolean;
    isCompleted: boolean;
    onComplete?: () => void;
    onAbandon?: () => void;
}

export const MissionDetail = ({ mission, isActive, isCompleted, onComplete, onAbandon }: MissionDetailProps) => {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    const difficultyColors = {
        EASY: 'text-green-500',
        MEDIUM: 'text-yellow-500',
        HARD: 'text-orange-500',
        EXPERT: 'text-red-500'
    };

    const { isTaskCompleted, areAllTasksCompleted } = useMissionState();
    const allTasksCompleted = areAllTasksCompleted(mission);

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="border-b-2 border-green-800 pb-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-black text-green-400 uppercase tracking-wider">{mission.title}</h1>
                    <div className={`text-sm px-3 py-1 border-2 font-bold ${difficultyColors[mission.difficulty]} border-current`}>
                        {mission.difficulty}
                    </div>
                </div>
                <div className="text-xs text-green-700 font-mono">MISSION ID: {mission.id}</div>
                {isActive && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 bg-green-500 text-black font-bold animate-pulse">
                        ACTIVE MISSION
                    </div>
                )}
                {isCompleted && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 bg-blue-500 text-black font-bold">
                        <CheckCircle size={12} />
                        COMPLETED
                    </div>
                )}
            </div>

            {/* Mission Briefing */}
            <div className="mb-6">
                <h2 className="text-sm font-bold text-green-500 mb-3 uppercase">Mission Briefing</h2>
                <p className="text-sm text-green-300 leading-relaxed border-l-2 border-green-800 pl-4">
                    {mission.fullDescription}
                </p>
            </div>

            {/* Mission Checklist */}
            {mission.checklist && mission.checklist.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold text-green-500 mb-3 uppercase">Mission Checklist</h2>
                    <div className="space-y-2 bg-green-900/10 p-3 border border-green-900/30">
                        {mission.checklist.map((task) => {
                            const completed = isTaskCompleted(task.id);
                            return (
                                <div key={task.id} className={`flex items-center gap-3 p-2 border ${completed ? 'border-green-500/50 bg-green-500/10' : 'border-green-900/30'} transition-colors`}>
                                    {completed ? <CheckSquare size={16} className="text-green-400" /> : <Square size={16} className="text-green-800" />}
                                    <span className={`text-sm ${completed ? 'text-green-300 line-through opacity-70' : 'text-green-400'}`}>{task.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mission Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-green-900 bg-green-900/10 p-3">
                    <div className="text-[10px] text-green-700 uppercase mb-1">Reward</div>
                    <div className="text-green-400 font-mono font-bold text-lg">{mission.reward}</div>
                </div>
                <div className="border border-green-900 bg-green-900/10 p-3">
                    <div className="text-[10px] text-green-700 uppercase mb-1">Estimated Time</div>
                    <div className="text-green-400 font-mono font-bold text-lg">{mission.estimatedTime}</div>
                </div>
                {mission.target && (
                    <div className="border border-green-900 bg-green-900/10 p-3">
                        <div className="text-[10px] text-green-700 uppercase mb-1">Target</div>
                        <div className="text-green-400 font-mono">{mission.target}</div>
                    </div>
                )}
                {mission.location && (
                    <div className="border border-green-900 bg-green-900/10 p-3">
                        <div className="text-[10px] text-green-700 uppercase mb-1">Location</div>
                        <div className="text-green-400 font-mono">{mission.location}</div>
                    </div>
                )}
            </div>

            {/* Required Modules */}
            <div className="mb-6">
                <h2 className="text-sm font-bold text-green-500 mb-3 uppercase">Required Modules</h2>
                <div className="flex flex-wrap gap-2">
                    {mission.requiredModules.map((module, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-green-900/30 border border-green-700 text-green-400 font-mono">
                            {module}
                        </span>
                    ))}
                </div>
            </div>

            {/* Linked Documents / Clues */}
            {mission.documents.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold text-green-500 mb-3 flex items-center gap-2">
                        <FileText size={14} />
                        MISSION CLUES & DOCUMENTS ({mission.documents.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mission.documents.map((doc, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedDoc(doc)}
                                className="flex items-center gap-3 p-3 border border-green-900/50 bg-black/40 hover:bg-green-900/10 hover:border-green-500 transition-all group text-left"
                            >
                                <div className="w-10 h-10 bg-green-900/20 flex items-center justify-center text-green-600 group-hover:text-green-400 group-hover:bg-green-900/30 transition-colors">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-green-400 group-hover:text-green-300">{doc.title}</div>
                                    <div className="text-[10px] text-green-700 uppercase">{doc.type}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            {isActive && onComplete && onAbandon && (
                <div className="mt-auto pt-6 border-t-2 border-green-900 flex gap-3">
                    <button
                        onClick={onAbandon}
                        className="flex-1 py-2 border border-red-900 text-red-500 hover:bg-red-900/20 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <XCircle size={16} />
                        ABANDON MISSION
                    </button>
                    <button
                        onClick={onComplete}
                        disabled={!allTasksCompleted}
                        className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${allTasksCompleted ? 'bg-green-600 text-black hover:bg-green-500' : 'bg-green-900/20 text-green-700 cursor-not-allowed border border-green-900'}`}
                    >
                        <CheckCircle size={16} />
                        {allTasksCompleted ? 'COMPLETE MISSION' : 'TASKS INCOMPLETE'}
                    </button>
                </div>
            )}

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <DocumentViewer document={selectedDoc} onClose={() => setSelectedDoc(null)} />
            )}
        </div>
    );
};
