import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person, Role } from './types';
import initialData from './directory_data.json';

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
                const localProfiles: Person[] = initialData;

                // Fetch random citizens
                const response = await fetch('https://randomuser.me/api/?results=10&nat=us,gb,fr');
                const data = await response.json();

                const citizenProfiles: Person[] = data.results.map((user: any) => ({
                    id: user.login.uuid,
                    name: `${user.name.first} ${user.name.last}`,
                    role: 'CITIZEN',
                    status: 'NEUTRAL',
                    avatar: user.picture.large,
                    details: {
                        age: user.dob.age,
                        occupation: 'Civilian',
                        location: `${user.location.city}, ${user.location.country}`,
                        nationality: user.nat
                    },
                    hiddenInfo: {
                        realName: `${user.name.first} ${user.name.last}`,
                        clearanceLevel: 'NONE',
                        notes: 'No significant record found.',
                        knownAssociates: []
                    },
                    documents: [
                        {
                            title: "ID Card",
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
                }));

                setProfiles([...localProfiles, ...citizenProfiles]);
            } catch (error) {
                console.error("Failed to fetch citizens:", error);
                // Fallback to just local data
                // @ts-ignore
                setProfiles(initialData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCitizens();
    }, []);

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
