import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-007",
        title: t.title,
        difficulty: "HARD",
        reward: "4,500 BTC",
        briefing: t.briefing,
        fullDescription: t.fullDescription,
        warnings: t.warnings,
        requiredModules: [
            "Satellite",
            "Decryption",
            "Terminal"
        ],
        estimatedTime: t.estimatedTime,
        target: t.target,
        location: t.location,
        documents: [
            {
                title: t.documents.assessment.title,
                type: "mission",
                meta: t.documents.assessment.meta,
                data: {
                    operation: t.documents.assessment.data.operation,
                    target: t.documents.assessment.data.target,
                    briefing: t.documents.assessment.data.briefing,
                    assets: t.documents.assessment.data.assets,
                    intel_photo: "https://placehold.co/200x200/000/fff?text=SATELLITE"
                }
            }
        ]
    };
};
