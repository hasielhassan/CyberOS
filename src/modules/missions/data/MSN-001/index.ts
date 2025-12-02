import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-001",
        title: t.title,
        difficulty: "EASY",
        reward: "100 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Terminal"
        ],
        moduleData: {
            "Terminal": {
                "ipdata": {
                    "198.51.100.55": {
                        "info": {
                            "ip": "198.51.100.55",
                            "hostname": "unknown-host.cyberdyne.net",
                            "city": "Seattle",
                            "region": "Washington",
                            "country": "US",
                            "loc": "47.6062,-122.3321",
                            "org": "Cyberdyne Systems",
                            "postal": "98101",
                            "timezone": "America/Los_Angeles"
                        },
                        "trace": [
                            "1. 10.0.0.1 - Localhost",
                            "2. 192.168.1.1 - Gateway",
                            "3. 198.51.100.55 - Seattle, US (Cyberdyne)"
                        ]
                    }
                }
            }
        },
        questions: {
            "Which city is the IP located in?": "Seattle"
        },
        objectives: [
            {
                id: "trace_ip",
                description: t.objectives.trace_ip.description,
                trigger: {
                    event: "TERMINAL_IPINFO",
                    target: "198.51.100.55"
                },
                on_complete: {
                    message: t.objectives.trace_ip.on_complete
                }
            }
        ],
        checklist: [
            {
                id: "trace_ip",
                description: t.checklist.trace_ip,
                completed: false
            }
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: []
    };
};
