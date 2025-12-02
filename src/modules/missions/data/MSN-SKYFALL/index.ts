import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-SKYFALL",
        title: t.title,
        difficulty: "HARD",
        reward: "7,500 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Terminal",
            "NetWarfare",
            "Satellite",
            "Geo Tracker"
        ],
        moduleData: {
            "Terminal": {
                "ipdata": {
                    "45.33.22.11": {
                        "info": {
                            "ip": "45.33.22.11",
                            "hostname": "relay-node-04.net",
                            "city": "St. Petersburg",
                            "region": "Leningrad",
                            "country": "RU",
                            "loc": "59.9343,30.3351",
                            "org": "Roscosmos Legacy Relay",
                            "postal": "190000",
                            "timezone": "Europe/Moscow"
                        },
                        "trace": [
                            "1. 10.0.0.1 - Localhost",
                            "2. 89.14.22.1 - ISP Gateway",
                            "3. 45.33.22.11 - St. Petersburg, RU"
                        ]
                    },
                    "198.51.100.200": {
                        "info": {
                            "ip": "198.51.100.200",
                            "hostname": "kosmos-control.ru",
                            "city": "Moscow",
                            "region": "Moscow",
                            "country": "RU",
                            "loc": "55.7558,37.6173",
                            "org": "Roscosmos (Secure)",
                            "postal": "101000",
                            "timezone": "Europe/Moscow"
                        },
                        "trace": [
                            "1. 10.0.0.1 - Localhost",
                            "2. 89.14.22.1 - ISP Gateway",
                            "3. 45.33.22.11 - St. Petersburg, RU",
                            "4. 198.51.100.200 - Moscow, RU"
                        ]
                    }
                }
            },
            "NetWarfare": {
                "targets": {
                    "45.33.22.11": {
                        "systemName": "Relay-04",
                        "fileSystem": {
                            "var": {
                                "type": "dir",
                                "content": {
                                    "log": {
                                        "type": "dir",
                                        "content": {
                                            "syslog": {
                                                "type": "file",
                                                "content": t.moduleData.netWarfare.syslog
                                            }
                                        }
                                    }
                                }
                            },
                            "home": {
                                "type": "dir",
                                "content": {
                                    "target.dat": {
                                        "type": "file",
                                        "content": "TARGET_COORDS: 51.5007, -0.1246"
                                    },
                                    "decryption_key.txt": {
                                        "type": "file",
                                        "content": "TELEMETRY_DECRYPTION_KEY: KOSMOS-99-X"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Satellite": {
                "satellites": {
                    "KOSMOS-2499": {
                        "id": "KOSMOS-2499",
                        "name": "KOSMOS-2499",
                        "type": "DEBRIS",
                        "realType": "MILITARY",
                        "telemetryKey": "KOSMOS-99-X",
                        "orbit": "DECAYING",
                        "visualAlt": 150,
                        "inclination": 65,
                        "collisionTarget": "EARTH",
                        "status": "CRITICAL",
                        "owner": "SOVIET UNION (LEGACY)",
                        "description": t.moduleData.satellite.description,
                        "supportedTargets": [
                            "EARTH"
                        ],
                        "apiQueryType": "EARTH",
                        "jammerKey": "JAM-KOSMOS-99",
                        "rebootKey": "ROOT-ACCESS-2499",
                        "patchData": ":: ORBITAL PATCH v2.4 ::\n[SYSTEM] INITIATING WRITE SEQUENCE\n[ADDR] 0x0049221\n[DATA] 44 92 11 00\n[CHECKSUM] VERIFIED\n:: END PATCH ::",
                        "completionMessage": t.moduleData.satellite.completionMessage,
                        "resetData": {
                            "type": "MILITARY",
                            "realType": "MILITARY",
                            "status": "SAFE",
                            "orbit": "STABLE",
                            "collisionTarget": "",
                            "description": t.moduleData.satellite.resetDescription
                        },
                        "tasksUpdate": {
                            "recover_kosmos": true
                        }
                    }
                },
                "telemetry": {
                    "KOSMOS-2499": t.moduleData.satellite.telemetry
                },
                "sensorFeed": {
                    "KOSMOS-2499": {
                        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/London_at_night_from_space.jpg/800px-London_at_night_from_space.jpg",
                        "meta": t.moduleData.satellite.sensorMeta
                    }
                }
            },
            "Geo Tracker": {
                "coordinates": {
                    "51.5007,-0.1246": {
                        "name": t.moduleData.geoTracker.name,
                        "description": t.moduleData.geoTracker.description,
                        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/800px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg"
                    }
                }
            }
        },
        questions: {
            [t.questions.id]: "KOSMOS-2499",
            [t.questions.target]: "London",
            [t.questions.file]: "stabilize_orbit.exe"
        },
        objectives: [
            {
                id: "decrypt_telemetry",
                description: t.objectives.decrypt.description,
                trigger: {
                    event: "SAT_DECRYPT",
                    target: "KOSMOS-2499"
                },
                on_complete: {
                    message: t.objectives.decrypt.on_complete
                }
            },
            {
                id: "jam_satellite",
                description: t.objectives.jam.description,
                trigger: {
                    event: "SAT_JAM",
                    target: "KOSMOS-2499"
                },
                on_complete: {
                    message: t.objectives.jam.on_complete
                }
            },
            {
                id: "recover_kosmos",
                description: t.objectives.recover.description,
                trigger: {
                    event: "SAT_RESTORE",
                    target: "KOSMOS-2499"
                },
                on_complete: {
                    message: t.objectives.recover.on_complete,
                    mission_success: true
                }
            }
        ],
        checklist: [
            {
                id: "decrypt_telemetry",
                description: t.objectives.decrypt.description,
                completed: false
            },
            {
                id: "jam_satellite",
                description: t.objectives.jam.description,
                completed: false
            },
            {
                id: "recover_kosmos",
                description: t.objectives.recover.description,
                completed: false
            }
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.decay.title,
                type: "mission",
                meta: t.documents.decay.meta,
                data: {
                    operation: "SKYFALL",
                    target: "UNKNOWN",
                    briefing: t.documents.decay.data.briefing,
                    assets: t.documents.decay.data.assets,
                    intel_photo: "https://placehold.co/200x200/000/fff?text=DECAY"
                }
            },
            {
                title: t.documents.signal.title,
                type: "binary",
                meta: t.documents.signal.meta,
                data: {
                    frequency: "435.5 MHz",
                    source: "UNKNOWN",
                    content: t.documents.signal.data.content
                }
            },
            {
                title: t.documents.weather.title,
                type: "newspaper",
                meta: t.documents.weather.meta,
                data: {
                    headline: t.documents.weather.data.headline,
                    subhead: t.documents.weather.data.subhead,
                    leadImage: "https://placehold.co/600x300/000/fff?text=WEATHER",
                    imageCaption: t.documents.weather.data.imageCaption,
                    columns: t.documents.weather.data.columns
                }
            }
        ]
    };
};
