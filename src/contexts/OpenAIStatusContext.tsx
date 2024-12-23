"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { serverLogger } from "@/utils/serverLogger";

interface OpenAIStatusContextType {
  isOperational: boolean;
  status: string;
  isLoading: boolean;
}

const OpenAIStatusContext = createContext<OpenAIStatusContextType | undefined>(
  undefined
);

export function OpenAIStatusProvider({ children }: { children: ReactNode }) {
  const [isOperational, setIsOperational] = useState(true);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      await serverLogger.debug("Checking OpenAI status");
      try {
        const response = await fetch("/api/openai/status");
        await serverLogger.debug("OpenAI status response", {
          status: response.status,
        });

        const data = await response.json();
        await serverLogger.debug("OpenAI status data", data);

        setIsOperational(data.operational);
        setStatus(data.status);
      } catch (error) {
        await serverLogger.error("OpenAI status check failed", { error });
        setIsOperational(false);
        setStatus("Unable to check service status");
      } finally {
        await serverLogger.debug("Setting OpenAI status loading to false");
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
    throw new Error(
      "useOpenAIStatus must be used within an OpenAIStatusProvider"
    );
  }
  return context;
}
