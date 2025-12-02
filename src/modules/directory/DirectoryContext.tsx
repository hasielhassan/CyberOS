import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person, Role } from './types';
import { getDirectoryData } from './directory_data';
import { useLanguage } from '../../core/registry';

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
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useLanguage();
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
                const localProfiles: Person[] = getDirectoryData(t);

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
                        role: role,
                        status: status,
                        avatar: user.picture.large,
                        email: user.email,
                        phone: user.phone,
                        cell: user.cell,
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

                setProfiles([...localProfiles, ...citizenProfiles]);
            } catch (error) {
                console.error("Failed to fetch citizens:", error);
                // Fallback to just local data
                // @ts-ignore
                setProfiles(getDirectoryData(t));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCitizens();
    }, [t]);

    const toggleBookmark = (id: string) => {
        setBookmarks(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
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
            isLoading
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
