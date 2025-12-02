import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mission, MissionProgress } from './types';


interface MissionsContextType {
    missions: Mission[];
    activeMissionId: string | null;
    activeMission: Mission | null;
    completedMissionIds: string[];
    acceptMission: (id: string) => void;
    completeMission: (id: string) => void;
    abandonMission: () => void;
    getActiveMission: () => Mission | null;
    isMissionCompleted: (id: string) => boolean;
}

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

const STORAGE_KEY = 'cyberos_mission_progress';

import { useLanguage } from '../../core/registry';

// ... imports

export const MissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { language } = useLanguage();

    // Load missions dynamically
    const tsModules = import.meta.glob('./data/*/index.ts', { eager: true });

    const missions = Object.values(tsModules).map((mod: any) => mod.getMission(language.code)) as Mission[];

    // Initialize state from localStorage to avoid race conditions
    const [activeMissionId, setActiveMissionId] = useState<string | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const progress: MissionProgress = JSON.parse(saved);
                return progress.activeMissionId;
            } catch (error) {
                console.error('Failed to load mission progress:', error);
                return null;
            }
        }
        return null;
    });

    const [completedMissionIds, setCompletedMissionIds] = useState<string[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const progress: MissionProgress = JSON.parse(saved);
                return progress.completedMissionIds || [];
            } catch (error) {
                return [];
            }
        }
        return [];
    });

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

    const activeMission = getActiveMission();

    return (
        <MissionsContext.Provider value={{
            missions,
            activeMissionId,
            activeMission,
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
