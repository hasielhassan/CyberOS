import { useState, useEffect, useCallback } from 'react';
import { Mission } from '../modules/missions/types';

const STORAGE_KEY = 'cyberos_mission_state';

interface MissionProgress {
    completedTasks: string[];
}

interface MissionState {
    missionProgress: { [missionId: string]: MissionProgress };
    completedMissions: string[]; // List of completed mission IDs
}

export const useMissionState = () => {
    const [state, setState] = useState<MissionState>({
        missionProgress: {},
        completedMissions: []
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migration check: if old format (completedTasks is array at root), reset or migrate
                if (Array.isArray(parsed.completedTasks)) {
                    console.warn('Detected old mission state format. Resetting state for compatibility.');
                    // Reset to empty state to avoid conflicts
                    setState({
                        missionProgress: {},
                        completedMissions: parsed.completedMissions || []
                    });
                } else {
                    setState(parsed);
                }
            } catch (e) {
                console.error('Failed to parse mission state', e);
            }
        }
    }, []);



    const completeTask = useCallback((missionId: string, taskId: string) => {
        setState(prevState => {
            const currentProgress = prevState.missionProgress[missionId] || { completedTasks: [] };

            if (currentProgress.completedTasks.includes(taskId)) return prevState;

            const newState = {
                ...prevState,
                missionProgress: {
                    ...prevState.missionProgress,
                    [missionId]: {
                        ...currentProgress,
                        completedTasks: [...currentProgress.completedTasks, taskId]
                    }
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    const isTaskCompleted = useCallback((missionId: string, taskId: string) => {
        return state.missionProgress[missionId]?.completedTasks.includes(taskId) || false;
    }, [state.missionProgress]);

    const completeMission = useCallback((missionId: string) => {
        setState(prevState => {
            if (prevState.completedMissions.includes(missionId)) return prevState;

            const newState = {
                ...prevState,
                completedMissions: [...prevState.completedMissions, missionId]
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    const isMissionCompleted = useCallback((missionId: string) => {
        return state.completedMissions.includes(missionId);
    }, [state.completedMissions]);

    // Check if all tasks for a mission are completed
    const areAllTasksCompleted = useCallback((mission: Mission) => {
        if (!mission.checklist || mission.checklist.length === 0) return true;
        const progress = state.missionProgress[mission.id];
        if (!progress) return false;

        return mission.checklist.every(task => progress.completedTasks.includes(task.id));
    }, [state.missionProgress]);

    return {
        completeTask,
        isTaskCompleted,
        completeMission,
        isMissionCompleted,
        areAllTasksCompleted,
        state
    };
};
