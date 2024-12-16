"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/contexts/CreditsContext";
import { useAuth } from "@clerk/nextjs";

export default function CreditsIndicator() {
  const { credits, isFreePlan, hasUnlimitedCredits } = useCredits();
  const { t } = useLanguage();
  const { isSignedIn } = useAuth();

  if (!isSignedIn || !isFreePlan || hasUnlimitedCredits || credits === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full py-1.5 px-3">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-gray-800">{credits}</span>
        <span className="text-sm text-gray-600">{t("credits.unit")}</span>
      </div>
    </div>
  );
}
