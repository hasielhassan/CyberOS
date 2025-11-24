import { useState } from 'react';
import { useDirectory } from '../DirectoryContext';
import { Shield, Lock, FileText, Eye, EyeOff, Bookmark, MapPin, Activity, Database } from 'lucide-react';
import { DocumentViewer } from './DocumentViewer';
import { Document } from '../types';

export const ProfileDetail = () => {
    const { profiles, selectedProfileId, bookmarks, toggleBookmark } = useDirectory();
    const [showHidden, setShowHidden] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    const profile = profiles.find(p => p.id === selectedProfileId);

    if (!profile) {
        return (
            <div className="flex-1 flex items-center justify-center bg-black/80 text-green-900/50 flex-col gap-4">
                <Shield size={64} className="animate-pulse opacity-20" />
                <div className="text-sm tracking-widest">SELECT A TARGET TO VIEW DOSSIER</div>
            </div>
        );
    }

    const isBookmarked = bookmarks.includes(profile.id);

    return (
        <div className="flex-1 flex bg-black/80 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
                <div className="flex gap-8 items-start max-w-5xl mx-auto">

                    {/* Left Column: Photo & Core Stats */}
                    <div className="w-64 shrink-0 flex flex-col gap-4">
                        <div className="aspect-[3/4] bg-green-900/10 border-2 border-green-800 relative group overflow-hidden">
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <div className="text-xs text-green-500 font-bold tracking-widest mb-1">{profile.role}</div>
                                <div className="text-lg text-white font-black uppercase leading-none">{profile.name}</div>
                            </div>

                            {/* Status Overlay */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 border border-green-500 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                                {profile.status}
                            </div>
                        </div>

                        <div className="border border-green-900 bg-black/40 p-4 space-y-3">
                            <div className="text-[10px] text-green-700 uppercase font-bold border-b border-green-900 pb-1 mb-2">Core Metrics</div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="text-green-800">THREAT LEVEL</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-1.5 h-3 ${i <= (profile.role === 'CRIMINAL' ? 5 : profile.role === 'AGENT' ? 4 : 1) ? 'bg-red-500' : 'bg-green-900/30'}`}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="text-green-800">INTEL RELIABILITY</span>
                                <span className="text-green-500 font-mono">98.4%</span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleBookmark(profile.id)}
                            className={`w-full py-2 border flex items-center justify-center gap-2 text-xs font-bold transition-all ${isBookmarked
                                    ? 'bg-green-500 text-black border-green-500 hover:bg-green-400'
                                    : 'bg-transparent text-green-500 border-green-500 hover:bg-green-900/20'
                                }`}
                        >
                            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                            {isBookmarked ? 'BOOKMARKED' : 'BOOKMARK TARGET'}
                        </button>
                    </div>

                    {/* Right Column: Details & Docs */}
                    <div className="flex-1 space-y-6">

                        {/* Header Info */}
                        <div className="border-b border-green-900 pb-4">
                            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-3">
                                {profile.name}
                                <span className="text-sm font-normal text-green-600 border border-green-800 px-2 py-0.5 rounded-full bg-green-900/10">
                                    ID: {profile.id}
                                </span>
                            </h1>
                            <div className="flex gap-6 text-xs text-green-500 font-mono">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} />
                                    <span>AGE: {profile.details.age}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span>LOC: {profile.details.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Database size={14} />
                                    <span>OCC: {profile.details.occupation}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Info Section */}
                        <div className="border border-green-900/50 bg-green-900/5 overflow-hidden">
                            <div className="flex items-center justify-between p-3 bg-green-900/20 border-b border-green-900/50">
                                <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                                    <Lock size={12} />
                                    CLASSIFIED INFORMATION
                                </div>
                                <button
                                    onClick={() => setShowHidden(!showHidden)}
                                    className="text-[10px] flex items-center gap-1 text-green-600 hover:text-green-400 transition-colors"
                                >
                                    {showHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                                    {showHidden ? 'CONCEAL DATA' : 'DECRYPT DATA'}
                                </button>
                            </div>

                            <div className="p-4 relative min-h-[100px]">
                                {!showHidden && (
                                    <div className="absolute inset-0 backdrop-blur-sm bg-black/50 z-10 flex items-center justify-center">
                                        <div className="text-xs text-red-500 font-bold border border-red-900 bg-black/80 px-4 py-2 animate-pulse">
                                            ENCRYPTED // AUTHORIZATION REQUIRED
                                        </div>
                                    </div>
                                )}
                                <div className={`grid grid-cols-2 gap-4 text-sm ${!showHidden ? 'blur-sm select-none opacity-50' : ''}`}>
                                    <div>
                                        <div className="text-[10px] text-green-800 uppercase mb-1">Real Name</div>
                                        <div className="text-green-400 font-mono">{profile.hiddenInfo?.realName || 'UNKNOWN'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-green-800 uppercase mb-1">Clearance</div>
                                        <div className="text-green-400 font-mono">{profile.hiddenInfo?.clearanceLevel || 'RESTRICTED'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] text-green-800 uppercase mb-1">Notes</div>
                                        <div className="text-green-400 font-mono leading-relaxed">{profile.hiddenInfo?.notes || 'No data available.'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] text-green-800 uppercase mb-1">Known Associates</div>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.hiddenInfo?.knownAssociates?.map((assoc, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-900/20 border border-green-900/50 text-xs text-green-500">
                                                    {assoc}
                                                </span>
                                            )) || <span className="text-green-700 italic">None recorded</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Linked Documents */}
                        <div>
                            <div className="text-xs font-bold text-green-500 mb-3 flex items-center gap-2">
                                <FileText size={14} />
                                LINKED ASSETS ({profile.documents.length})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {profile.documents.map((doc, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDoc(doc)}
                                        className="flex items-center gap-3 p-3 border border-green-900/50 bg-black/40 hover:bg-green-900/10 hover:border-green-500 transition-all group text-left"
                                    >
                                        <div className="w-10 h-10 bg-green-900/20 flex items-center justify-center text-green-600 group-hover:text-green-400 group-hover:bg-green-900/30 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-green-400 group-hover:text-green-300">{doc.title}</div>
                                            <div className="text-[10px] text-green-700 uppercase">{doc.type} // {doc.meta.date || 'UNDATED'}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <DocumentViewer document={selectedDoc} onClose={() => setSelectedDoc(null)} />
            )}
        </div>
    );
};
