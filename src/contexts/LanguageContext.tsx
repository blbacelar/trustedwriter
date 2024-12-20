"use client";

import { createContext, useContext, useState, useCallback } from "react";
import en from "@/locales/en";
import es from "@/locales/es";
import pt from "@/locales/pt";

type Languages = "en" | "es" | "pt";

// Make all properties recursively accept any string
type TranslationShape<T> = {
  [P in keyof T]: T[P] extends string
    ? string
    : T[P] extends object
    ? TranslationShape<T[P]>
    : T[P];
};

type Translations = TranslationShape<typeof en>;

interface LanguageContextType {
  language: Languages;
  setLanguage: (lang: Languages) => void;
  t: (key: string) => string;
}

const translations: Record<Languages, Translations> = {
  en,
  es,
  pt,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Languages>("en");

  const t = useCallback(
    (key: string): string => {
      try {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
          value = value[k];
          if (value === undefined) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
          }
        }

        return value as string;
      } catch (error) {
        console.warn(`Translation error for key: ${key}`, error);
        return key;
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
