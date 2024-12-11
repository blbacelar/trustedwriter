"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SuccessPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/settings");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-[#00B5B4] mb-4">
          {t("billing.success.title")}
        </h1>
        <p className="text-gray-600 mb-8">{t("billing.success.description")}</p>
      </div>
    </div>
  );
} 