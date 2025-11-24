import { Document } from '../directory/types';

export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type MissionStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED';

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
}

export interface MissionProgress {
    activeMissionId: string | null;
    completedMissionIds: string[];
}
