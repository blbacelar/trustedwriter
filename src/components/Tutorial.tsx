"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { Settings, MessageSquare, CheckCircle, ListChecks } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Tutorial() {
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
      title: t("tutorial.rules.title"),
      description: t("tutorial.rules.description"),
      Icon: ListChecks,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="sr-only">{steps[step].title}</DialogTitle>
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-800/10 flex items-center justify-center">
            <CurrentIcon className="h-6 w-6 text-gray-800" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{steps[step].title}</h2>
          <p className="text-gray-600 mb-6">{steps[step].description}</p>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={handleNext}>
            {t("tutorial.buttons.skip")}
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                {t("tutorial.buttons.prev")}
              </Button>
            )}
            <Button onClick={handleNext}>
              {step === steps.length - 1
                ? t("tutorial.buttons.finish")
                : t("tutorial.buttons.next")}
            </Button>
          </div>
        </div>
        {step === 2 && (
          <div className="mt-4 space-y-2 text-left">
            <p className="text-sm text-gray-600 mb-2">Examples:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {t("tutorial.rules.examples").map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
