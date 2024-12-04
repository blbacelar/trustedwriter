"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const LoadingSpinner = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00B5B4]" />
        <p className="mt-4 text-gray-700 text-lg">
          {t("dashboard.editor.loading.title")}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 