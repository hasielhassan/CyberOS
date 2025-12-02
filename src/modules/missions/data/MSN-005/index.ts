import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-005",
        title: t.title,
        difficulty: "HARD",
        reward: "5,000 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Satellite",
            "Decryption",
            "Terminal",
            "Geo Tracker"
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.intel.title,
                type: "newspaper",
                meta: t.documents.intel.meta,
                data: {
                    headline: t.documents.intel.data.headline,
                    subhead: t.documents.intel.data.subhead,
                    leadImage: "https://placehold.co/600x300/222/fff?text=SERVER+FARM",
                    imageCaption: t.documents.intel.data.imageCaption,
                    columns: t.documents.intel.data.columns,
                    sidebar: t.documents.intel.data.sidebar
                }
            }
        ]
    };
};
