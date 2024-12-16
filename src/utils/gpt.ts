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
    console.log('Starting application generation with data:', data);

    const requestBody = { data };
    console.log('Request body:', requestBody);

    // Use absolute URL with environment variable
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/openai/generate`;
    
    console.log('Making request to:', url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.error || "Failed to generate application");
    }

    const result = await response.json();
    console.log('API success response:', result);

    if (!result.result) {
      console.error('Missing result in API response');
      throw new Error("Invalid API response format");
    }

    return result.result;
  } catch (error) {
    console.error('Application generation error:', {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });

    await logError({
      error: error as Error,
      context: "scrapeAndGetApplication",
      additionalData: { 
        endpoint: "/api/openai/generate",
        inputDataLength: data?.length
      }
    });
    throw error;
  }
}
