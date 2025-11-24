import { useDirectory } from '../DirectoryContext';
import { Search, User, Shield, AlertTriangle, Beaker, Users } from 'lucide-react';
import { Role } from '../types';

const RoleIcon = ({ role }: { role: Role }) => {
    switch (role) {
        case 'AGENT': return <Shield size={16} className="text-green-500" />;
        case 'CRIMINAL': return <AlertTriangle size={16} className="text-red-500" />;
        case 'SCIENTIST': return <Beaker size={16} className="text-blue-400" />;
        case 'CITIZEN': return <Users size={16} className="text-gray-400" />;
        default: return <User size={16} />;
    }
};

export const ProfileList = () => {
    const {
        profiles,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        selectedProfileId,
        setSelectedProfileId,
        isLoading
    } = useDirectory();

    const filteredProfiles = profiles.filter(profile => {
        const matchesFilter = activeFilter === 'ALL' || profile.role === activeFilter;
        const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full border-r border-green-900 bg-black/60 w-80 shrink-0">
            {/* Search Bar */}
            <div className="p-3 border-b border-green-900">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH DIRECTORY DATABASE"
                        className="w-full bg-black border border-green-800 text-green-500 text-xs py-2 pl-9 pr-3 focus:outline-none focus:border-green-500 placeholder-green-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 p-2 border-b border-green-900 overflow-x-auto custom-scrollbar">
                {(['ALL', 'AGENT', 'CRIMINAL', 'SCIENTIST', 'CITIZEN'] as const).map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-1 text-[10px] font-bold border transition-colors whitespace-nowrap ${activeFilter === filter
                            ? 'bg-green-900/40 text-green-400 border-green-600'
                            : 'text-green-800 border-green-900 hover:border-green-700'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-4 text-center text-green-800 text-xs animate-pulse">
                        ACCESSING MAINFRAME...
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredProfiles.map(profile => (
                            <button
                                key={profile.id}
                                onClick={() => setSelectedProfileId(profile.id)}
                                className={`flex items-center gap-3 p-3 border-b border-green-900/30 text-left transition-colors hover:bg-green-900/10 ${selectedProfileId === profile.id ? 'bg-green-900/20 border-l-2 border-l-green-500' : 'border-l-2 border-l-transparent'
                                    }`}
                            >
                                <div className="w-10 h-10 bg-green-900/20 rounded overflow-hidden border border-green-800 shrink-0">
                                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-green-400 truncate flex items-center gap-2">
                                        <RoleIcon role={profile.role} />
                                        {profile.role}: '{profile.name.toUpperCase()}'
                                    </div>
                                    <div className="text-[10px] text-green-700 truncate mt-1">
                                        {profile.role}: '{profile.name.toUpperCase()}' - {profile.status}
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredProfiles.length === 0 && (
                            <div className="p-8 text-center text-green-900 text-xs">
                                NO RECORDS FOUND
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
