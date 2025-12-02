import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-004",
        title: t.title,
        difficulty: "MEDIUM",
        reward: "2,500 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Terminal",
            "Geo Tracker",
            "Surveillance"
        ],
        moduleData: {
            "Terminal": {
                "ipdata": {
                    "45.12.89.33": {
                        "info": {
                            "ip": "45.12.89.33",
                            "hostname": "secure-node.berlin-ix.de",
                            "city": "Berlin",
                            "region": "Berlin",
                            "country": "DE",
                            "loc": "52.5200,13.4050",
                            "org": "Private Network",
                            "postal": "10115",
                            "timezone": "Europe/Berlin"
                        },
                        "trace": [
                            "1. 10.0.0.1 - Localhost",
                            "2. 89.14.22.1 - ISP Gateway",
                            "3. 45.12.89.33 - Berlin, DE"
                        ]
                    }
                }
            },
            "Geo Tracker": {
                "coordinates": {
                    "52.5200,13.4050": {
                        "name": t.moduleData.geoTracker.name,
                        "description": t.moduleData.geoTracker.description,
                        "insights": t.moduleData.geoTracker.insights,
                        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Berlin_Teufelsberg_NSA_Field_Station%2C_look_down_from_big_tower_-_panoramio.jpg"
                    }
                }
            },
            "Surveillance": {
                "cams": [
                    {
                        "id": "CAM_MSN_004_A",
                        "url": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2V4eXE2OTdwd3kxZ25oNzczbnFtcTJsYzZtNmNmZzlkdm9uZWM1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AH9Qv6ATylJACaq2UB/giphy.gif",
                        "name": t.moduleData.surveillance.cam1.name,
                        "location": "Berlin, DE",
                        "category": "Mission Intel",
                        "description": t.moduleData.surveillance.cam1.description
                    },
                    {
                        "id": "CAM_MSN_008_B",
                        "url": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHR1a2xobmhmODVpNDB4ajJicWhnMTgzMm9pdWVlbXFqOW80MXFpeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ym5GNhnakhRxAGpLaf/giphy.gif",
                        "name": t.moduleData.surveillance.cam2.name,
                        "location": "Berlin, DE",
                        "category": "Mission Intel",
                        "description": t.moduleData.surveillance.cam2.description
                    }
                ]
            }
        },
        questions: {
            [t.questions.city]: "Berlin",
            [t.questions.code]: "Applepine #5395",
            [t.questions.vehicle]: "White Van"
        },
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.file.title,
                type: "identity",
                meta: {
                    issueDate: "2020-03-15",
                    agency: "CYBER-INT",
                    clearance: "LEVEL 4"
                },
                data: {
                    surname: "THORNE",
                    firstname: "ARIS",
                    idNumber: "SCI-042-THR",
                    dob: "1978-06-22",
                    photoUrl: "https://i.imgur.com/I0IYMdK.png",
                    sex: "M",
                    height: "175cm",
                    signature: "A. Thorne"
                }
            },
            {
                title: t.documents.brief.title,
                type: "mission",
                meta: {
                    classification: t.documents.brief.meta.classification,
                    copy: "1 of 3",
                    date: "15 NOV 2025"
                },
                data: {
                    operation: "CHIMERA",
                    target: t.documents.brief.data.target,
                    briefing: t.documents.brief.data.briefing,
                    assets: t.documents.brief.data.assets,
                    intel_photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/AI%E5%8A%A9%E6%89%8B%E8%83%BD%E5%B8%AE%E6%88%91%E8%B6%85%E9%A2%91%EF%BC%9FCOMPUTEX_NV%E5%B1%95%E5%8C%BA%E4%BD%93%E9%AA%8C_%28%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan%29_07.png"
                }
            }
        ]
    };
};
