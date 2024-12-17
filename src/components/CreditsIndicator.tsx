"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/contexts/CreditsContext";
import { useAuth } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PricingSection from "./PricingSection";

export default function CreditsIndicator() {
  const { credits, isFreePlan, hasUnlimitedCredits } = useCredits();
  const { t } = useLanguage();
  const { isSignedIn } = useAuth();
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  if (!isSignedIn || !isFreePlan || hasUnlimitedCredits || credits === null) {
    return null;
  }

  const handleBuyCreditsClick = () => {
    setShowBuyCredits(true);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full py-1.5 px-3">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-800">{credits}</span>
            <span className="text-sm text-gray-600">{t("credits.unit")}</span>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleBuyCreditsClick}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-900 text-white transition-colors"
              aria-label={t("credits.buyMore")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("credits.buyMore")}</p>
          </TooltipContent>
        </Tooltip>

        <Dialog open={showBuyCredits} onOpenChange={setShowBuyCredits}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                {t("credits.buyTitle")}
              </DialogTitle>
            </DialogHeader>
            <PricingSection hideFreePlan={true} defaultView="credits" />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
