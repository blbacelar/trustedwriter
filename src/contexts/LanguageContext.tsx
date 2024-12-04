"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Language, translations } from "@/lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const detectLanguage = () => {
      try {
        // First try to get from localStorage
        const savedLanguage = localStorage.getItem("preferredLanguage") as Language;
        console.log("🔍 Checking localStorage:", { savedLanguage });

        if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
          console.log("✅ Using saved language:", savedLanguage);
          setLanguage(savedLanguage);
          return;
        }

        // Then try to get from browser
        const browserLanguages = navigator.languages;
        const browserLang = navigator.language;
        console.log("🌐 Browser language info:", {
          primaryLanguage: browserLang,
          allLanguages: browserLanguages,
          languageWithoutRegion: browserLang.split("-")[0]
        });

        const detectedLang = browserLang.split("-")[0];
        if (detectedLang === "pt" || detectedLang === "es") {
          console.log("✅ Setting detected language:", detectedLang);
          setLanguage(detectedLang as Language);
          localStorage.setItem("preferredLanguage", detectedLang);
        } else {
          console.log("ℹ️ Using default language: en");
        }
      } catch (error) {
        console.error("❌ Error detecting language:", error);
      }
    };

    detectLanguage();
  }, []);

  // Log whenever language changes
  useEffect(() => {
    console.log("🌍 Current active language:", language);
  }, [language]);

  const handleSetLanguage = (newLang: Language) => {
    console.log("🔄 Changing language to:", newLang);
    setLanguage(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  const t = (path: string) => {
    const keys = path.split(".");
    let current: any = translations[language];

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      current = current[key];
    }

    return current;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
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
