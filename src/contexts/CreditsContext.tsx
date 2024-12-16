"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

interface CreditsContextType {
  credits: number | null;
  isFreePlan: boolean;
  refreshCredits: () => Promise<void>;
  hasUnlimitedCredits: boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [hasUnlimitedCredits, setHasUnlimitedCredits] = useState(false);
  const { isSignedIn } = useAuth();

  const fetchCredits = async () => {
    if (!isSignedIn) return;
    
    try {
      const response = await fetch("/api/credits");
      if (response.ok) {
        const data = await response.json();
        setIsFreePlan(data.subscriptionStatus === 'free');
        setHasUnlimitedCredits(data.subscriptionStatus === 'active');
        setCredits(data.subscriptionStatus === 'active' ? Infinity : (data.credits ?? 3));
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [isSignedIn]);

  return (
    <CreditsContext.Provider value={{ 
      credits, 
      isFreePlan, 
      refreshCredits: fetchCredits,
      hasUnlimitedCredits 
    }}>
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