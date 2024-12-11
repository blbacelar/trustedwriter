"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

interface CreditsContextType {
  credits: number | null;
  isFreePlan: boolean;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const { isSignedIn } = useAuth();

  const fetchCredits = async () => {
    if (!isSignedIn) return;
    
    try {
      const response = await fetch("/api/credits");
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits ?? 3);
        setIsFreePlan(data.subscriptionStatus === 'free' || !data.subscriptionId);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [isSignedIn]);

  return (
    <CreditsContext.Provider value={{ credits, isFreePlan, refreshCredits: fetchCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
} 