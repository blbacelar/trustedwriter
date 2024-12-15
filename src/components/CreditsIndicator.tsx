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
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
      <div className="text-sm text-gray-600">
        {t(`credits.remaining`).replace("{{count}}", credits.toString())}
      </div>
      <div className="w-20 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-[#00B5B4] rounded-full transition-all"
          style={{ width: `${(credits / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
