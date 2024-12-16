"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OpenAIStatusContextType {
  isOperational: boolean;
  status: string;
  isLoading: boolean;
}

const OpenAIStatusContext = createContext<OpenAIStatusContextType | undefined>(undefined);

export function OpenAIStatusProvider({ children }: { children: ReactNode }) {
  const [isOperational, setIsOperational] = useState(true);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/openai/status");
        const data = await response.json();
        setIsOperational(data.operational);
        setStatus(data.status);
      } catch (error) {
        setIsOperational(false);
        setStatus("Unable to check service status");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return (
    <OpenAIStatusContext.Provider value={{ isOperational, status, isLoading }}>
      {children}
    </OpenAIStatusContext.Provider>
  );
}

export function useOpenAIStatus() {
  const context = useContext(OpenAIStatusContext);
  if (context === undefined) {
    throw new Error("useOpenAIStatus must be used within an OpenAIStatusProvider");
  }
  return context;
} 