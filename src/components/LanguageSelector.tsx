"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

const languages: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "es", flag: "🇪🇸", label: "Español" }
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      {languages.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            language === code
              ? "ring-2 ring-gray-800 ring-offset-2 scale-110"
              : "hover:scale-105"
          }`}
          title={label}
          aria-label={`Switch to ${label}`}
        >
          <span className="text-xl" role="img" aria-label={label}>
            {flag}
          </span>
        </button>
      ))}
    </div>
  );
} 