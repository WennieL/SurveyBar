
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from local storage if available
  useEffect(() => {
    const storedLang = localStorage.getItem('surveybar_lang') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'zh-TW')) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('surveybar_lang', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Safety check: ensure dictionary exists for the language, fallback to 'en'
    const dict = translations[language] || translations['en'];
    // Safety check: ensure dict exists (in case 'en' is somehow missing too, though unlikely)
    if (!dict) return key;

    let text = dict[key as keyof typeof dict] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
