import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-006",
        title: t.title,
        difficulty: "MEDIUM",
        reward: "3,000 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Directory",
            "Geo Tracker",
            "Surveillance"
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.profile.title,
                type: "identity",
                meta: t.documents.profile.meta,
                data: {
                    surname: t.documents.profile.data.surname,
                    firstname: t.documents.profile.data.firstname,
                    idNumber: t.documents.profile.data.idNumber,
                    dob: t.documents.profile.data.dob,
                    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Broker&backgroundColor=333",
                    sex: t.documents.profile.data.sex,
                    height: t.documents.profile.data.height,
                    signature: t.documents.profile.data.signature
                }
            }
        ]
    };
};
