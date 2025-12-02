import React, { useState } from 'react';
import { Mission } from '../types';
import { CheckCircle, XCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../core/registry';

interface MissionVerificationDialogProps {
    mission: Mission;
    onComplete: () => void;
    onClose: () => void;
}

const MissionVerificationDialog: React.FC<MissionVerificationDialogProps> = ({ mission, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [incorrectFields, setIncorrectFields] = useState<string[]>([]);

    const questions = mission.questions || {};
    const questionKeys = Object.keys(questions);

    const handleSubmit = () => {
        const wrong: string[] = [];

        for (const question of questionKeys) {
            const userAnswer = (answers[question] || '').trim().toLowerCase();
            const correctAnswer = (questions[question] || '').toLowerCase();

            if (userAnswer !== correctAnswer) {
                wrong.push(question);
            }
        }

        if (wrong.length === 0) {
            setSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            setIncorrectFields(wrong);
            setError(t('mission.verify.error'));
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-black border border-green-500 p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold text-green-500 mb-2">{t('mission.verify.accomplished')}</h2>
                    <p className="text-green-400 mb-4">{t('mission.verify.success_msg')}</p>
                    <div className="text-xl font-mono text-yellow-400">{mission.reward}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black border border-green-500 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-green-900 bg-green-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="text-green-500" />
                        <h2 className="text-lg font-bold text-green-400">{t('mission.verify.title')}</h2>
                    </div>
                    <button onClick={onClose} className="text-green-700 hover:text-green-500">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="mb-6 flex items-start gap-3 bg-yellow-900/20 border border-yellow-700/50 p-3 rounded">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-yellow-200/80">
                            {t('mission.verify.desc')}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {questionKeys.map((question, idx) => {
                            const isWrong = incorrectFields.includes(question);
                            return (
                                <div key={idx} className="space-y-2">
                                    <label className={`block text-sm font-bold ${isWrong ? 'text-red-500' : 'text-green-500'}`}>
                                        {idx + 1}. {question}
                                    </label>
                                    <input
                                        type="text"
                                        value={answers[question] || ''}
                                        onChange={(e) => {
                                            setAnswers(prev => ({ ...prev, [question]: e.target.value }));
                                            if (incorrectFields.includes(question)) {
                                                setIncorrectFields(prev => prev.filter(q => q !== question));
                                            }
                                            setError(null);
                                        }}
                                        className={`w-full bg-green-900/10 border p-3 text-green-100 focus:outline-none transition-colors
                                            ${isWrong
                                                ? 'border-red-500 focus:border-red-400 focus:bg-red-900/10'
                                                : 'border-green-700 focus:border-green-400 focus:bg-green-900/20'
                                            }
                                        `}
                                        placeholder={t('mission.verify.placeholder')}
                                    />
                                    {isWrong && (
                                        <div className="text-xs text-red-400 flex items-center gap-1">
                                            <XCircle size={12} /> {t('mission.verify.incorrect')}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {error && (
                        <div className="mt-6 p-3 bg-red-900/20 border border-red-500 text-red-400 text-sm flex items-center gap-2 animate-pulse">
                            <XCircle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-green-900 bg-green-900/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-green-600 hover:text-green-400 font-bold text-sm uppercase"
                    >
                        {t('mission.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold text-sm uppercase shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"
                    >
                        {t('mission.verify.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionVerificationDialog;
