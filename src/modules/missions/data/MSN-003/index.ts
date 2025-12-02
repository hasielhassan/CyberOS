import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-003",
        title: t.title,
        difficulty: "EASY",
        reward: "500 BTC",
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
                    "185.93.180.131": {
                        "info": {
                            "ip": "185.93.180.131",
                            "hostname": "frankfurt-ns01.cyberghostvpn.com",
                            "city": "Frankfurt am Main",
                            "region": "Hesse",
                            "country": "DE",
                            "loc": "50.1025,8.6299",
                            "org": "AS9009 M247 Europe SRL",
                            "postal": "60326",
                            "timezone": "Europe/Berlin"
                        },
                        "trace": [
                            "1. 140.238.132.162 - Toronto, CA (AS31898)",
                            "2. 140.238.95.27 - London, GB (AS31898)",
                            "3. 40.77.241.36 - Moses Lake, US (AS8075)",
                            "4. 69.63.183.6 - San Jose, US (AS32934)",
                            "5. 140.238.167.234 - Mumbai, IN (AS31898)",
                            "6. 129.213.8.180 - Ashburn, US (AS31898)",
                            "7. 54.75.41.166 - Dublin, IE (AS16509)",
                            "8. 185.93.180.131 - Frankfurt, DE (AS6724)"
                        ]
                    }
                }
            },
            "Geo Tracker": {
                "coordinates": {
                    "50.1025,8.6299": {
                        "name": t.moduleData.geoTracker.name,
                        "description": t.moduleData.geoTracker.description,
                        "insights": t.moduleData.geoTracker.insights,
                        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Frankfurt_Main_August_2020_1.jpg"
                    }
                },
                "flights": [
                    {
                        "id": "FLT-3020",
                        "name": "Flight AMS-FRA 3020",
                        "type": "FLIGHT",
                        "origin": "AMS",
                        "destination": "FRA",
                        "status": "ON TIME",
                        "details": "Altitude: 36023ft, Speed: 487mph",
                        "startCoords": [
                            52.3105,
                            4.7683
                        ],
                        "endCoords": [
                            50.0379,
                            8.5622
                        ]
                    }
                ]
            }
        },
        questions: {
            [t.questions.city]: "Frankfurt",
            [t.questions.company]: "Oberon Dynamics",
            [t.questions.transport]: "Plane"
        },
        objectives: [
            {
                id: "trace_ip",
                description: t.objectives.trace_ip.description,
                trigger: {
                    event: "TERMINAL_TRACE",
                    target: "185.93.180.131"
                },
                on_complete: {
                    message: t.objectives.trace_ip.on_complete
                }
            },
            {
                id: "identify_city",
                description: t.objectives.identify_city.description,
                trigger: {
                    event: "TERMINAL_IPINFO",
                    target: "185.93.180.131"
                },
                dependency: "trace_ip",
                on_complete: {
                    message: t.objectives.identify_city.on_complete
                }
            },
            {
                id: "locate_target",
                description: t.objectives.locate_target.description,
                trigger: {
                    event: "MAP_SELECT_LOCATION",
                    target: "Oberon Dynamics"
                },
                dependency: "identify_city",
                on_complete: {
                    message: t.objectives.locate_target.on_complete
                }
            },
            {
                id: "identify_flight",
                description: t.objectives.identify_flight.description,
                trigger: {
                    event: "MAP_SELECT_ENTITY",
                    target: "FLT-3020"
                },
                dependency: "locate_target",
                on_complete: {
                    message: t.objectives.identify_flight.on_complete
                }
            }
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.report.title,
                type: "newspaper",
                meta: t.documents.report.meta,
                data: t.documents.report.data
            }
        ]
    };
};
