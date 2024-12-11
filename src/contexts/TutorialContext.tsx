"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

interface TutorialContextType {
  hasSeenTutorial: boolean;
  markTutorialAsSeen: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      const seen = localStorage.getItem("hasSeenTutorial");
      setHasSeenTutorial(!!seen);
    }
  }, [isSignedIn]);

  const markTutorialAsSeen = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setHasSeenTutorial(true);
  };

  return (
    <TutorialContext.Provider value={{ hasSeenTutorial, markTutorialAsSeen }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
} 