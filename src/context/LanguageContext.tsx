import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, getItemName, formatUnit } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['hi']) => string;
  getItemName: (item: { name: string; nameHi?: string }) => string;
  formatUnit: (unit?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('khata_lang') as Language | null;
    return saved === 'en' || saved === 'hi' ? saved : 'hi';
  });

  useEffect(() => {
    localStorage.setItem('khata_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const t = (key: keyof typeof translations['hi']): string => {
    const currentDict = translations[language] || translations.hi;
    return currentDict[key] || translations.hi[key] || String(key);
  };

  const resolveItemName = (item: { name: string; nameHi?: string }): string => {
    return getItemName(item, language);
  };

  const resolveUnit = (unit?: string): string => {
    return formatUnit(unit, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getItemName: resolveItemName,
        formatUnit: resolveUnit,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
