import { Mission } from '../../types';
import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (language: string): Mission => {
    const t = language === 'es' ? es : en;

    return {
        id: "MSN-MOLE",
        title: t.title,
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        difficulty: 'MEDIUM',
        reward: "2500 CR",
        warnings: t.warnings,
        requiredModules: ["Directory", "Terminal", "Sat Uplink"],
        moduleData: {
            Directory: [
                {
                    id: "mole-suspect-001",
                    name: "Marcus Thorne",
                    role: "AGENT",
                    status: "ACTIVE",
                    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    email: "m.thorne@agency.net",
                    phone: "555-0192",
                    cell: "555-9921",
                    dob: "1985-04-12",
                    encrypted: true,
                    decryptionKey: "TRIDENT",
                    details: {
                        age: 38,
                        occupation: "Senior Analyst",
                        location: "London, UK",
                        nationality: "GB"
                    },
                    hiddenInfo: {
                        realName: "Marcus Thorne",
                        clearanceLevel: "LEVEL 4",
                        notes: "Suspected of leaking classified intel. Drop point coordinates encrypted in profile.",
                        knownAssociates: ["The Broker", "Cipher"]
                    },
                    documents: [
                        {
                            title: "Encrypted Log",
                            type: "intel",
                            meta: {
                                issueDate: "2023-11-15",
                                agency: "INTERNAL AFFAIRS",
                                clearance: "TOP SECRET"
                            },
                            data: {
                                content: "DROP POINT: 51.5074° N, 0.1278° W (LONDON EYE). TIME: 2300 HOURS."
                            }
                        }
                    ]
                }
            ]
        },
        objectives: [
            {
                id: "obj_find_suspect",
                label: "Locate Suspect",
                description: "Find 'Marcus Thorne' in the Directory.",
                status: "ACTIVE",
                trigger: {
                    event: "DIRECTORY_VIEW_PROFILE",
                    target: "mole-suspect-001"
                }
            },
            {
                id: "obj_decrypt_profile",
                label: "Decrypt Profile",
                description: "Decrypt Thorne's profile. Key 'TRIDENT' found in server logs.",
                status: "LOCKED",
                dependency: "obj_find_suspect",
                trigger: {
                    event: "DIRECTORY_DECRYPT",
                    target: "mole-suspect-001"
                }
            },
            {
                id: "obj_track_drop",
                label: "Track Drop Point",
                description: "Use Sat Uplink to monitor the drop point in London.",
                status: "LOCKED",
                dependency: "obj_decrypt_profile",
                trigger: {
                    event: "SAT_VIEW_LOCATION",
                    target: "London"
                },
                on_complete: {
                    mission_success: true,
                    message: "Drop point identified. Team dispatched."
                }
            }
        ],
        documents: [],
        estimatedTime: "20-30 min",
        target: "Marcus Thorne",
        location: "London, UK"
    };
};
