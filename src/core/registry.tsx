import { createContext, useContext, useState, ReactNode } from 'react';
import { Plugin, RegistryContextType, Language, LanguageContextType } from './types';

// --- PLUGIN REGISTRY ---
const PluginContext = createContext<RegistryContextType | undefined>(undefined);

export const PluginProvider = ({ children }: { children: ReactNode }) => {
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    const [activePluginId, setActivePluginId] = useState<string>('');

    const registerPlugin = (plugin: Plugin) => {
        setPlugins(prev => {
            if (prev.find(p => p.id === plugin.id)) return prev;
            return [...prev, plugin];
        });
        // Set first registered plugin as active if none selected
        if (!activePluginId) {
            setActivePluginId(plugin.id);
        }
    };

    return (
        <PluginContext.Provider value={{ plugins, registerPlugin, activePluginId, setActivePluginId }}>
            {children}
        </PluginContext.Provider>
    );
};

export const usePlugins = () => {
    const context = useContext(PluginContext);
    if (!context) throw new Error('usePlugins must be used within a PluginProvider');
    return context;
};

// --- LANGUAGE REGISTRY ---
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, initialLanguages }: { children: ReactNode, initialLanguages: Language[] }) => {
    const [languages] = useState<Language[]>(initialLanguages);
    const [currentLangCode, setCurrentLangCode] = useState<string>(() => {
        return localStorage.getItem('cyberos_language') || initialLanguages[0]?.code || 'en';
    });

    const setLanguage = (code: string) => {
        setCurrentLangCode(code);
        localStorage.setItem('cyberos_language', code);
    };

    const language = languages.find(l => l.code === currentLangCode) || initialLanguages[0];

    const t = (key: string, params?: Record<string, string | number>) => {
        let text = language.translations[key] || key;
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                text = text.replace(`{${key}}`, String(value));
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: languages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
