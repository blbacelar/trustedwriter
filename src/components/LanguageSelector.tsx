"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";
import { Globe } from "lucide-react";

const languages: { code: Language; flag: string }[] = [
  { code: "en", flag: "🇺🇸" },
  { code: "pt", flag: "🇧🇷" },
  { code: "es", flag: "🇪🇸" },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-white rounded-full shadow-lg"
    >
      <Globe className="h-4 w-4" />
      <div className="flex gap-2">
        {languages.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`flex items-center transition-transform ${
              language === code ? "scale-125" : "hover:scale-110"
            }`}
          >
            <span className="text-lg">{flag}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
