import { Mission } from '../../types';
import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (language: string): Mission => {
    const t = language === 'es' ? es : en;

    return {
        id: "MSN-GHOST",
        title: t.title,
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        difficulty: 'HARD',
        reward: "5000 CR",
        warnings: t.warnings,
        requiredModules: ["Directory", "NetWarfare", "Sat Uplink", "Terminal"],
        moduleData: {
            Directory: [
                {
                    id: "agent-x-ghost",
                    name: "Unknown Agent",
                    role: "AGENT",
                    status: "MIA",
                    avatar: "https://randomuser.me/api/portraits/men/99.jpg", // Placeholder
                    encrypted: true,
                    decryptionKey: "OMEGA-7",
                    details: {
                        age: 0,
                        occupation: "Deep Cover Operative",
                        location: "Unknown",
                        nationality: "Unknown"
                    },
                    hiddenInfo: {
                        realName: "Alex Mason",
                        clearanceLevel: "LEVEL 5",
                        notes: "Disavowed. Last known transmission indicated a hidden network: shadow.net",
                        knownAssociates: ["The Architect"]
                    },
                    documents: []
                }
            ],
            NetWarfare: {
                targets: {
                    "shadow.net": {
                        systemName: "ARCHITECT_MAIN_FRAME",
                        fileSystem: {
                            "root": {
                                "logs": {
                                    "sys_log.txt": { content: "User: ARCHITECT\nAction: SAT_UPLINK_INIT\nTarget: 34.0522° N, 118.2437° W" },
                                    "manifesto.txt": { content: "The old world must burn for the new one to rise." }
                                }
                            }
                        }
                    }
                }
            }
        },
        objectives: [
            {
                id: "obj_find_agent",
                label: "Locate MIA Agent",
                description: "Search Directory for 'Unknown Agent' or 'MIA' status.",
                status: "ACTIVE",
                trigger: {
                    event: "DIRECTORY_VIEW_PROFILE",
                    target: "agent-x-ghost"
                }
            },
            {
                id: "obj_decrypt_agent",
                label: "Decrypt Profile",
                description: "Decrypt the agent's profile. Key 'OMEGA-7' found in mission briefing.",
                status: "LOCKED",
                dependency: "obj_find_agent",
                trigger: {
                    event: "DIRECTORY_DECRYPT",
                    target: "agent-x-ghost"
                }
            },
            {
                id: "obj_hack_network",
                label: "Infiltrate Shadow Network",
                description: "Hack 'shadow.net' (revealed in decrypted profile) using NetWarfare.",
                status: "LOCKED",
                dependency: "obj_decrypt_agent",
                trigger: {
                    event: "NETWAR_HACK_SUCCESS", // Need to verify this event name
                    target: "shadow.net" // Or domain?
                }
            },
            {
                id: "obj_track_architect",
                label: "Locate The Architect",
                description: "Trace the satellite signature found in shadow.net logs.",
                status: "LOCKED",
                dependency: "obj_hack_network",
                trigger: {
                    event: "SAT_VIEW_LOCATION",
                    target: "Los Angeles" // Coordinates map to LA
                },
                on_complete: {
                    mission_success: true,
                    message: "Architect located. Strike team inbound."
                }
            }
        ],
        documents: [
            {
                title: "Recovered Transmission",
                type: "intel",
                meta: {
                    date: "Unknown",
                    source: "Intercepted Signal"
                },
                data: {
                    content: "Last transmission from Agent X received at 0400. Encryption Key: OMEGA-7. Signal lost."
                }
            }
        ],
        estimatedTime: "45-60 min",
        target: "The Architect",
        location: "Global"
    };
};
