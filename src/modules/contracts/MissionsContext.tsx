import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mission, MissionProgress } from './types';
import missionsData from './missions.json';

interface MissionsContextType {
    missions: Mission[];
    activeMissionId: string | null;
    completedMissionIds: string[];
    acceptMission: (id: string) => void;
    completeMission: (id: string) => void;
    abandonMission: () => void;
    getActiveMission: () => Mission | null;
    isMissionCompleted: (id: string) => boolean;
}

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

const STORAGE_KEY = 'cyberos_mission_progress';

export const MissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [missions] = useState<Mission[]>(missionsData as Mission[]);
    const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
    const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);

    // Load progress from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const progress: MissionProgress = JSON.parse(saved);
                setActiveMissionId(progress.activeMissionId);
                setCompletedMissionIds(progress.completedMissionIds);
            } catch (error) {
                console.error('Failed to load mission progress:', error);
            }
        }
    }, []);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        const progress: MissionProgress = {
            activeMissionId,
            completedMissionIds
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }, [activeMissionId, completedMissionIds]);

    const acceptMission = (id: string) => {
        setActiveMissionId(id);
    };

    const completeMission = (id: string) => {
        if (!completedMissionIds.includes(id)) {
            setCompletedMissionIds(prev => [...prev, id]);
        }
        if (activeMissionId === id) {
            setActiveMissionId(null);
        }
    };

    const abandonMission = () => {
        setActiveMissionId(null);
    };

    const getActiveMission = (): Mission | null => {
        if (!activeMissionId) return null;
        return missions.find(m => m.id === activeMissionId) || null;
    };

    const isMissionCompleted = (id: string): boolean => {
        return completedMissionIds.includes(id);
    };

    return (
        <MissionsContext.Provider value={{
            missions,
            activeMissionId,
            completedMissionIds,
            acceptMission,
            completeMission,
            abandonMission,
            getActiveMission,
            isMissionCompleted
        }}>
            {children}
        </MissionsContext.Provider>
    );
};

export const useMissions = () => {
    const context = useContext(MissionsContext);
    if (context === undefined) {
        throw new Error('useMissions must be used within a MissionsProvider');
    }
    return context;
};
