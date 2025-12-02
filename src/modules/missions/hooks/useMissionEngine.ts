import { useState, useEffect } from 'react';
import { useMissions } from '../MissionsContext';
import { missionEventBus } from '../MissionEventBus';
import { MissionObjective } from '../types';
import { useMissionState } from '../../../hooks/useMissionState';

export const useMissionEngine = () => {
    const { activeMission, completeMission } = useMissions();
    const { completeTask, isTaskCompleted } = useMissionState();

    // Local state to track objectives status if not persisted yet
    const [objectives, setObjectives] = useState<MissionObjective[]>([]);

    // Initialize objectives from active mission
    useEffect(() => {
        if (activeMission?.objectives) {
            // Merge with persisted state
            const initializedObjectives = activeMission.objectives.map(obj => ({
                ...obj,
                status: isTaskCompleted(activeMission.id, obj.id) ? 'COMPLETED' : (obj.status || 'ACTIVE')
            }));
            setObjectives(initializedObjectives);
        } else if (activeMission?.checklist) {
            // Fallback for old missions
            const fallbackObjectives: MissionObjective[] = activeMission.checklist.map(task => ({
                id: task.id,
                label: task.description,
                description: task.description,
                status: isTaskCompleted(activeMission.id, task.id) ? 'COMPLETED' : 'ACTIVE'
            }));
            setObjectives(fallbackObjectives);
        } else {
            setObjectives([]);
        }
    }, [activeMission, isTaskCompleted]);

    // Handle Events
    useEffect(() => {
        if (!activeMission) return;

        const handleEvent = (payload: any) => {
            console.log('Mission Event Received:', payload);

            // Find active objectives that match this event
            const matchingObjectives = objectives.filter(obj =>
                obj.status === 'ACTIVE' &&
                obj.trigger &&
                obj.trigger.event === payload.event &&
                (!obj.trigger.target || obj.trigger.target === payload.target)
            );

            console.log('Matching Objectives:', matchingObjectives);

            matchingObjectives.forEach(obj => {
                handleObjectiveComplete(obj);
            });
        };

        // Subscribe to all relevant events
        const eventsToListen = new Set(objectives.filter(o => o.status === 'ACTIVE' && o.trigger).map(o => o.trigger!.event));

        console.log('useMissionEngine: Subscribing to events:', Array.from(eventsToListen));

        const cleanup: Function[] = [];

        eventsToListen.forEach(eventName => {
            const cb = (eventPayload: any) => {
                handleEvent({ event: eventName, ...eventPayload });
            };
            missionEventBus.subscribe(eventName, cb);
            cleanup.push(() => missionEventBus.unsubscribe(eventName, cb));
        });

        return () => {
            cleanup.forEach(cb => cb());
        };

    }, [activeMission, objectives]);

    const handleObjectiveComplete = (objective: MissionObjective) => {
        if (!activeMission) return;

        // 1. Mark as complete in persistence
        completeTask(activeMission.id, objective.id);

        // 2. Update local state
        setObjectives(prev => {
            const next = prev.map(o => o.id === objective.id ? { ...o, status: 'COMPLETED' as const } : o);

            // 3. Check dependencies to unlock next steps
            // Find objectives that depend on this one
            const unlocked = next.map(o => {
                if (o.dependency === objective.id && o.status === 'LOCKED') {
                    return { ...o, status: 'ACTIVE' as const };
                }
                return o;
            });

            return unlocked;
        });

        // 4. Run effects
        if (objective.on_complete) {
            if (objective.on_complete.message) {
                console.log('Mission Message:', objective.on_complete.message);
            }
            if (objective.on_complete.mission_success) {
                completeMission(activeMission.id);
            }
        }
    };

    return {
        objectives
    };
};
