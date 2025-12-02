import { Globe } from 'lucide-react';
import { useLanguage } from '../registry';

export const LanguageSelector = () => {
    const { language, setLanguage, availableLanguages } = useLanguage();

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors">
                <Globe size={16} />
                <span className="text-xs font-code uppercase">{language.code}</span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-32 bg-black border border-green-900 hidden group-hover:block z-50">
                {availableLanguages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full text-left px-3 py-2 text-xs font-code hover:bg-green-900/30 transition-colors flex items-center justify-between
                            ${language.code === lang.code ? 'text-green-400 bg-green-900/10' : 'text-green-700'}
                        `}
                    >
                        <span>{lang.name}</span>
                        {language.code === lang.code && <span className="text-[10px] text-green-500">&lt;&lt;</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};
