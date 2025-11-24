export type Role = 'AGENT' | 'CRIMINAL' | 'SCIENTIST' | 'CITIZEN';
export type Status = 'ACTIVE' | 'MIA' | 'KIA' | 'WANTED' | 'INCARCERATED' | 'NEUTRAL' | 'RESEARCH';

export interface Document {
    type: 'identity' | 'newspaper' | 'mission' | 'certificate';
    meta: any;
    data: any;
    title: string; // Display title for the list
}

export interface Person {
    id: string;
    name: string;
    role: Role;
    status: Status;
    avatar: string;
    details: {
        age: number;
        occupation: string;
        location: string;
        nationality?: string;
    };
    hiddenInfo?: {
        realName?: string;
        clearanceLevel?: string;
        notes?: string;
        knownAssociates?: string[];
    };
    documents: Document[];
    isBookmarked?: boolean;
}

export interface DirectoryState {
    profiles: Person[];
    searchQuery: string;
    activeFilter: Role | 'ALL';
    selectedProfileId: string | null;
    bookmarks: string[];
}
