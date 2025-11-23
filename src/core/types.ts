import { LucideIcon } from 'lucide-react';


export interface Plugin {
    id: string;
    name: string; // Display name (can be a key for translation)
    icon: LucideIcon;
    component: React.ComponentType;
}

export interface Language {
    code: string;
    name: string;
    translations: Record<string, string>;
}

export interface RegistryContextType {
    plugins: Plugin[];
    registerPlugin: (plugin: Plugin) => void;
    activePluginId: string;
    setActivePluginId: (id: string) => void;
}

export interface LanguageContextType {
    language: Language;
    setLanguage: (code: string) => void;
    t: (key: string) => string;
    availableLanguages: Language[];
}
