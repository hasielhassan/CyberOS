import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person, Role } from './types';
import { getDirectoryData } from './directory_data';
import { useLanguage } from '../../core/registry';
import { useMissions } from '../missions/MissionsContext';
import { missionEventBus } from '../missions/MissionEventBus';

interface DirectoryContextType {
    profiles: Person[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeFilter: Role | 'ALL';
    setActiveFilter: (filter: Role | 'ALL') => void;
    selectedProfileId: string | null;
    setSelectedProfileId: (id: string | null) => void;
    bookmarks: string[];
    toggleBookmark: (id: string) => void;
    isLoading: boolean;
    decryptProfile: (id: string, code: string) => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useLanguage();
    const { activeMission } = useMissions();
    const [profiles, setProfiles] = useState<Person[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<Role | 'ALL'>('ALL');
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCitizens = async () => {
            try {
                // Load local data first
                // @ts-ignore
                let allProfiles: Person[] = getDirectoryData(t) as unknown as Person[];

                // Fetch random citizens
                const response = await fetch('https://randomuser.me/api/?results=100');
                const data = await response.json();

                const citizenProfiles: Person[] = data.results.map((user: any, index: number) => {
                    // Role Distribution Logic
                    // 0-14: AGENT (15%)
                    // 15-29: CRIMINAL (15%)
                    // 30-49: SCIENTIST (20%)
                    // 50-99: CITIZEN (50%)
                    let role: 'AGENT' | 'CRIMINAL' | 'SCIENTIST' | 'CITIZEN' = 'CITIZEN';
                    let status: any = 'NEUTRAL';

                    if (index < 15) {
                        role = 'AGENT';
                        status = 'ACTIVE';
                    } else if (index < 30) {
                        role = 'CRIMINAL';
                        status = 'WANTED';
                    } else if (index < 50) {
                        role = 'SCIENTIST';
                        status = 'RESEARCH';
                    }

                    return {
                        id: user.login.uuid,
                        name: `${user.name.first} ${user.name.last}`,
                        role: role as Role,
                        status: status,
                        avatar: user.picture.large,
                        email: user.email || undefined,
                        phone: user.phone || undefined,
                        cell: user.cell || undefined,
                        dob: new Date(user.dob.date).toISOString().split('T')[0],
                        details: {
                            age: user.dob.age,
                            occupation: role === 'CITIZEN' ? 'Civilian' : role === 'AGENT' ? 'Field Agent' : role === 'SCIENTIST' ? 'Researcher' : 'Unknown',
                            location: `${user.location.city}, ${user.location.country}`,
                            nationality: user.nat
                        },
                        hiddenInfo: {
                            realName: `${user.name.first} ${user.name.last}`,
                            clearanceLevel: role === 'AGENT' ? 'LEVEL 3' : role === 'SCIENTIST' ? 'LEVEL 2' : 'NONE',
                            notes: 'No significant record found.',
                            knownAssociates: []
                        },
                        documents: [
                            {
                                title: t('dir.doc.official_cred'),
                                type: "identity",
                                meta: {
                                    issueDate: "2023-01-01",
                                    agency: "CIVIL REGISTRY",
                                    clearance: "NONE"
                                },
                                data: {
                                    surname: user.name.last.toUpperCase(),
                                    firstname: user.name.first.toUpperCase(),
                                    idNumber: user.id.value || "UNKNOWN",
                                    dob: new Date(user.dob.date).toISOString().split('T')[0],
                                    photoUrl: user.picture.large,
                                    sex: user.gender === 'male' ? 'M' : 'F',
                                    height: "N/A",
                                    signature: `${user.name.first.charAt(0)}. ${user.name.last}`
                                }
                            }
                        ]
                    };
                });

                allProfiles = [...allProfiles, ...citizenProfiles];

                // Inject Mission Profiles
                if (activeMission?.moduleData?.Directory) {
                    const missionProfiles = activeMission.moduleData.Directory as Person[];
                    // Merge or append. For now, we append.
                    // Check for duplicates by ID to allow overriding
                    const missionIds = new Set(missionProfiles.map(p => p.id));
                    allProfiles = allProfiles.filter(p => !missionIds.has(p.id));
                    allProfiles = [...missionProfiles, ...allProfiles];
                }

                setProfiles(allProfiles);
            } catch (error) {
                console.error("Failed to fetch citizens:", error);
                // Fallback to just local data
                // @ts-ignore
                let localProfiles: Person[] = getDirectoryData(t) as unknown as Person[];

                if (activeMission?.moduleData?.Directory) {
                    const missionProfiles = activeMission.moduleData.Directory as Person[];
                    const missionIds = new Set(missionProfiles.map(p => p.id));
                    localProfiles = localProfiles.filter(p => !missionIds.has(p.id));
                    localProfiles = [...missionProfiles, ...localProfiles];
                }

                setProfiles(localProfiles);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCitizens();
    }, [t, activeMission]);

    const toggleBookmark = (id: string) => {
        setBookmarks(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    const decryptProfile = (id: string, code: string) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === id && p.encrypted && p.decryptionKey === code) {
                missionEventBus.emit('DIRECTORY_DECRYPT', { id });
                return { ...p, isDecrypted: true };
            }
            return p;
        }));
    };

    return (
        <DirectoryContext.Provider value={{
            profiles,
            searchQuery,
            setSearchQuery,
            activeFilter,
            setActiveFilter,
            selectedProfileId,
            setSelectedProfileId,
            bookmarks,
            toggleBookmark,
            isLoading,
            decryptProfile
        }}>
            {children}
        </DirectoryContext.Provider>
    );
};

export const useDirectory = () => {
    const context = useContext(DirectoryContext);
    if (context === undefined) {
        throw new Error('useDirectory must be used within a DirectoryProvider');
    }
    return context;
};
