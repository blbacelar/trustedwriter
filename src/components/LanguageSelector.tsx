"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as "en" | "es" | "pt")}
      className="ml-4 px-2 py-1 rounded border border-gray-300 text-sm"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="pt">Português</option>
    </select>
  );
} 