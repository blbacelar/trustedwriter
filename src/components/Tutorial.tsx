"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { Settings, MessageSquare, CheckCircle } from "lucide-react";

const Tutorial = () => {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();
  const router = useRouter();
  const { hasSeenTutorial, markTutorialAsSeen } = useTutorial();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      setOpen(true);
    }
  }, [hasSeenTutorial]);

  const steps = [
    {
      title: t("tutorial.welcome.title"),
      description: t("tutorial.welcome.description"),
      Icon: MessageSquare,
    },
    {
      title: t("tutorial.settings.title"),
      description: t("tutorial.settings.description"),
      Icon: Settings,
    },
    {
      title: t("tutorial.ready.title"),
      description: t("tutorial.ready.description"),
      Icon: CheckCircle,
    },
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      setOpen(false);
      markTutorialAsSeen();
      router.push("/settings");
    } else {
      setStep(step + 1);
    }
  };

  if (hasSeenTutorial || !open) return null;

  const CurrentIcon = steps[step].Icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-800/10 flex items-center justify-center">
            <CurrentIcon className="h-6 w-6 text-gray-800" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{steps[step].title}</h2>
          <p className="text-gray-600 mb-6">{steps[step].description}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            {step === steps.length - 1
              ? t("tutorial.button.finish")
              : t("tutorial.button.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial; 