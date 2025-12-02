import { AlertTriangle, Clock, Shield, X } from 'lucide-react';
import { Mission } from '../types';
import { useLanguage } from '../../../core/registry';

interface AcceptMissionDialogProps {
    mission: Mission;
    onAccept: () => void;
    onCancel: () => void;
}

export const AcceptMissionDialog = ({ mission, onAccept, onCancel }: AcceptMissionDialogProps) => {
    const { t } = useLanguage();
    const difficultyColors = {
        EASY: 'text-green-500 border-green-500',
        MEDIUM: 'text-yellow-500 border-yellow-500',
        HARD: 'text-orange-500 border-orange-500',
        EXPERT: 'text-red-500 border-red-500'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onCancel}>
            <div className="relative w-full max-w-2xl bg-black border-2 border-green-800 p-6" onClick={e => e.stopPropagation()}>
                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px]"></div>

                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-green-700 hover:text-green-400 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="border-b-2 border-green-800 pb-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-green-400 uppercase tracking-wider">{mission.title}</h2>
                        <div className={`text-xs px-3 py-1 border-2 font-bold ${difficultyColors[mission.difficulty]}`}>
                            {mission.difficulty}
                        </div>
                    </div>
                    <div className="text-xs text-green-700 font-mono">{t('mission.id', { id: mission.id })}</div>
                </div>

                {/* Full Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-green-500 mb-2 uppercase">{t('mission.briefing')}</h3>
                    <p className="text-sm text-green-300 leading-relaxed border-l-2 border-green-800 pl-3">
                        {mission.fullDescription}
                    </p>
                </div>

                {/* Warnings */}
                {mission.warnings.length > 0 && (
                    <div className="mb-6 border border-red-900 bg-red-900/10 p-4">
                        <h3 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {t('mission.warnings')}
                        </h3>
                        <ul className="text-xs text-red-400 space-y-1">
                            {mission.warnings.map((warning, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-600 mt-0.5">►</span>
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Required Modules */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-green-500 mb-2 flex items-center gap-2">
                        <Shield size={14} />
                        {t('mission.required_modules')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {mission.requiredModules.map((module, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-green-900/20 border border-green-800 text-green-400">
                                {module}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Mission Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-mono">
                    <div>
                        <div className="text-[10px] text-green-700 uppercase mb-1">{t('mission.reward')}</div>
                        <div className="text-green-400 font-bold">{mission.reward}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-green-700 uppercase mb-1 flex items-center gap-1">
                            <Clock size={10} /> {t('mission.estimated_time')}
                        </div>
                        <div className="text-green-400 font-bold">{mission.estimatedTime}</div>
                    </div>
                    {mission.target && (
                        <div>
                            <div className="text-[10px] text-green-700 uppercase mb-1">{t('mission.target')}</div>
                            <div className="text-green-400">{mission.target}</div>
                        </div>
                    )}
                    {mission.location && (
                        <div>
                            <div className="text-[10px] text-green-700 uppercase mb-1">{t('mission.location')}</div>
                            <div className="text-green-400">{mission.location}</div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t-2 border-green-900 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 border border-green-900 text-green-700 hover:bg-green-900/20 transition-colors text-sm font-bold"
                    >
                        {t('mission.cancel')}
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-2 bg-green-600 text-black hover:bg-green-500 transition-colors text-sm font-bold uppercase animate-pulse"
                    >
                        {t('mission.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
};
