import { Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useMissions } from '../../modules/missions/MissionsContext';
import { useLanguage } from '../registry';

export const AgentProfileCard = () => {
    const { user, addXp } = useAuth();
    const { completedMissionIds, missions } = useMissions();
    const { t } = useLanguage();

    // Calculate total BTC from completed missions
    const calculateTotalBTC = (): number => {
        let total = 0;
        completedMissionIds.forEach(missionId => {
            const mission = missions.find(m => m.id === missionId);
            if (mission?.reward) {
                // Parse reward string like "5,000 BTC" or "500 BTC"
                const btcMatch = mission.reward.match(/[\d,]+/);
                if (btcMatch) {
                    const btcValue = parseInt(btcMatch[0].replace(/,/g, ''), 10);
                    total += btcValue;
                }
            }
        });
        return total;
    };

    const totalBTC = calculateTotalBTC();
    const level = user?.level || 1;
    const xp = user?.xp || 0; // Current XP
    // Calculate progress within current level
    // Level 1: 0-49 XP (Progress: XP % 50)
    // Level 2: 50-99 XP (Progress: XP % 50)
    const currentLevelXP = xp % 50;
    const maxXP = 50; // XP needed for next level
    const progressPercentage = (currentLevelXP / maxXP) * 100;

    if (!user) return null;

    return (
        <div className="mb-3 mx-2 relative">
            {/* Main card */}
            <div className="relative border border-green-900/50 bg-black/80 rounded p-3">
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                {/* Header with icon and name */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border border-green-700/60 bg-green-950/50 flex items-center justify-center">
                            <Shield className="text-green-500" size={20} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-green-600/80 uppercase tracking-wider font-bold">{t('agent.profile')}</div>
                        <div className="text-white font-bold text-sm truncate">{user.name}</div>
                        <div className="text-[10px] text-green-700 font-mono truncate">{user.id}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {/* Level */}
                    <div className="bg-black/50 border border-green-900/40 rounded p-2">
                        <div className="text-[9px] text-green-700 uppercase tracking-wider mb-1">{t('agent.level')}</div>
                        <div className="text-xl font-bold text-green-400 leading-none">{level}</div>
                    </div>

                    {/* BTC */}
                    <div className="bg-black/50 border border-green-900/40 rounded p-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-5">
                            <TrendingUp size={32} className="text-green-500" />
                        </div>
                        <div className="relative">
                            <div className="text-[9px] text-green-700 uppercase tracking-wider mb-1">{t('agent.btc_earned')}</div>
                            <div className="text-base font-bold text-green-400 leading-none">
                                {totalBTC.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <div className="text-[9px] text-green-700 uppercase tracking-wider">{t('agent.xp_progress')}</div>
                        <div className="text-[9px] text-green-600 font-mono">{currentLevelXP}/{maxXP}</div>
                    </div>
                    <div className="h-1.5 bg-black/70 border border-green-900/40 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-700 to-green-500 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
