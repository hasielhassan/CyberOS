import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-008",
        title: t.title,
        difficulty: "EXPERT",
        reward: "10,000 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Terminal",
            "Directory",
            "Geo Tracker",
            "Surveillance",
            "Satellite",
            "Decryption"
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.caseFile.title,
                type: "newspaper",
                meta: t.documents.caseFile.meta,
                data: {
                    headline: t.documents.caseFile.data.headline,
                    subhead: t.documents.caseFile.data.subhead,
                    leadImage: "https://placehold.co/600x300/8b0000/fff?text=TARGET+UNKNOWN",
                    imageCaption: t.documents.caseFile.data.imageCaption,
                    columns: t.documents.caseFile.data.columns,
                    sidebar: t.documents.caseFile.data.sidebar
                }
            },
            {
                title: t.documents.associate.title,
                type: "identity",
                meta: t.documents.associate.meta,
                data: {
                    surname: t.documents.associate.data.surname,
                    firstname: t.documents.associate.data.firstname,
                    idNumber: t.documents.associate.data.idNumber,
                    dob: t.documents.associate.data.dob,
                    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Viper&backgroundColor=8b0000",
                    sex: t.documents.associate.data.sex,
                    height: t.documents.associate.data.height,
                    signature: t.documents.associate.data.signature
                }
            }
        ]
    };
};
