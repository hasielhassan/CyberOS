import { useState, useEffect, useCallback } from 'react';
import { Mission } from '../modules/contracts/types';

const STORAGE_KEY = 'cyberos_mission_state';

interface MissionState {
    completedTasks: string[]; // List of completed task IDs across all missions
    completedMissions: string[]; // List of completed mission IDs
}

export const useMissionState = () => {
    const [state, setState] = useState<MissionState>({
        completedTasks: [],
        completedMissions: []
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setState(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse mission state', e);
            }
        }
    }, []);

    const saveState = useCallback((newState: MissionState) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setState(newState);
    }, []);

    const completeTask = useCallback((taskId: string) => {
        setState(prevState => {
            if (prevState.completedTasks.includes(taskId)) return prevState;

            const newState = {
                ...prevState,
                completedTasks: [...prevState.completedTasks, taskId]
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    const isTaskCompleted = useCallback((taskId: string) => {
        return state.completedTasks.includes(taskId);
    }, [state.completedTasks]);

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
        return mission.checklist.every(task => state.completedTasks.includes(task.id));
    }, [state.completedTasks]);

    return {
        completeTask,
        isTaskCompleted,
        completeMission,
        isMissionCompleted,
        areAllTasksCompleted,
        state
    };
};
