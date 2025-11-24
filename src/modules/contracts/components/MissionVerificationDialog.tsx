import React, { useState } from 'react';
import { Mission } from '../types';
import { CheckCircle, XCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface MissionVerificationDialogProps {
    mission: Mission;
    onComplete: () => void;
    onClose: () => void;
}

const MissionVerificationDialog: React.FC<MissionVerificationDialogProps> = ({ mission, onComplete, onClose }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const questions = mission.questions || {};
    const questionKeys = Object.keys(questions);

    const handleSubmit = () => {
        let allCorrect = true;

        for (const question of questionKeys) {
            const userAnswer = answers[question]?.trim().toLowerCase();
            const correctAnswer = questions[question].toLowerCase();

            if (userAnswer !== correctAnswer) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            setSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            setError("Incorrect answers. Review your intel and try again.");
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-black border border-green-500 p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold text-green-500 mb-2">MISSION ACCOMPLISHED</h2>
                    <p className="text-green-400 mb-4">Intel verified. Payment transferring...</p>
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
                        <h2 className="text-lg font-bold text-green-400">VERIFY MISSION INTEL</h2>
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
                            To complete this mission, you must verify the intelligence gathered.
                            Consult your modules (Terminal, Geo Tracker, etc.) to find the answers.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {questionKeys.map((question, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="block text-sm font-bold text-green-500">
                                    {idx + 1}. {question}
                                </label>
                                <input
                                    type="text"
                                    value={answers[question] || ''}
                                    onChange={(e) => {
                                        setAnswers(prev => ({ ...prev, [question]: e.target.value }));
                                        setError(null);
                                    }}
                                    className="w-full bg-green-900/10 border border-green-700 p-3 text-green-100 focus:border-green-400 focus:outline-none focus:bg-green-900/20 transition-colors"
                                    placeholder="Enter answer..."
                                />
                            </div>
                        ))}
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold text-sm uppercase shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"
                    >
                        Submit Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionVerificationDialog;
