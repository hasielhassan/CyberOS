import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-002",
        title: t.title,
        difficulty: "EASY",
        reward: "250 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Terminal",
            "Geo Tracker"
        ],
        moduleData: {
            "Terminal": {
                "ipdata": {
                    "212.58.244.23": {
                        "info": {
                            "ip": "212.58.244.23",
                            "hostname": "london-gw.finance.net",
                            "city": "London",
                            "region": "England",
                            "country": "GB",
                            "loc": "51.5045,-0.0183",
                            "org": "Global Finance Corp",
                            "postal": "E14",
                            "timezone": "Europe/London"
                        },
                        "trace": [
                            "1. 10.0.0.1 - Localhost",
                            "2. 212.58.244.23 - London, GB"
                        ]
                    }
                }
            },
            "Geo Tracker": {
                "coordinates": {
                    "51.5045,-0.0183": {
                        "name": t.moduleData.geoTracker.name,
                        "description": t.moduleData.geoTracker.description,
                        "insights": t.moduleData.geoTracker.insights,
                        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Canary_Wharf_at_night%2C_from_Shadwell_cropped.jpg"
                    }
                }
            }
        },
        questions: {
            [t.questions.city]: "London",
            [t.questions.facility]: "Canary Wharf Financial Hub"
        },
        objectives: [
            {
                id: "trace_ip_signal",
                description: t.objectives.trace_signal.description,
                trigger: {
                    event: "TERMINAL_IPINFO",
                    target: "212.58.244.23"
                },
                on_complete: {
                    message: t.objectives.trace_signal.on_complete
                }
            },
            {
                id: "identify_facility",
                description: t.objectives.identify_facility.description,
                trigger: {
                    event: "MAP_SELECT_LOCATION",
                    target: "Canary Wharf Financial Hub"
                },
                dependency: "trace_signal",
                on_complete: {
                    message: t.objectives.identify_facility.on_complete
                }
            }
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: []
    };
};
