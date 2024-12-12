import { logError } from "@/lib/errorLogging";

export interface ServiceStatus {
  operational: boolean;
  status: string;
}

export async function checkOpenAIStatus(): Promise<ServiceStatus> {
  try {
    const response = await fetch("/api/openai/status");
    return await response.json();
  } catch (error) {
    await logError({
      error: error as Error,
      context: "checkOpenAIStatus",
      additionalData: { endpoint: "/api/openai/status" }
    });
    return {
      operational: false,
      status: "Unable to check OpenAI status"
    };
  }
}

export async function scrapeAndGetApplication(data: string): Promise<string> {
  try {
    const response = await fetch("/api/openai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate application");
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    await logError({
      error: error as Error,
      context: "scrapeAndGetApplication",
      additionalData: { endpoint: "/api/openai/generate" }
    });
    throw error;
  }
}
