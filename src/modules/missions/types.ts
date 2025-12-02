import { Document } from '../directory/types';

export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type MissionStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED';


export interface MissionTrigger {
    event: string;
    target?: string;
}

export interface MissionEffect {
    message?: string;
    unlock_tool?: string;
    reveal_marker?: string;
    reveal_satellite?: string;
    mission_success?: boolean;
    set_flag?: string;
}

export interface MissionObjective {
    id: string;
    label: string; // Short title for the checklist
    description: string; // Longer description
    status: 'LOCKED' | 'ACTIVE' | 'COMPLETED';
    dependency?: string; // ID of another objective that must be completed first
    trigger?: MissionTrigger;
    on_complete?: MissionEffect;
}

export interface Mission {
    id: string;
    title: string;
    difficulty: MissionDifficulty;
    reward: string;
    briefing: string; // Short description for list view
    fullDescription: string; // Detailed briefing after acceptance
    warnings: string[]; // Shown in accept dialog
    requiredModules: string[]; // e.g., ["Terminal", "Geo Tracker"]
    moduleData?: Record<string, any>; // Clues for modules
    questions?: Record<string, string>; // Verification questions
    documents: Document[]; // Clues using Directory's Document type
    estimatedTime: string; // e.g., "15-30 min"
    target?: string;
    location?: string;
    objectives?: MissionObjective[]; // Replaces checklist
    checklist?: { id: string; description: string; completed?: boolean }[]; // Kept for backward compatibility during migration
}

export interface MissionProgress {
    activeMissionId: string | null;
    completedMissionIds: string[];
}
