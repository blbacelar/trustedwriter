import { NextResponse } from "next/server";
import { logError } from "@/lib/errorLogging";

const STATUS_URL = "https://status.openai.com/api/v2/status.json";

export async function GET() {
  try {
    const response = await fetch(STATUS_URL);
    const data = await response.json();

    const status = {
      operational: data.status.indicator === "none",
      status: data.status.description
    };

    // Log non-operational status
    if (!status.operational) {
      await logError({
        error: new Error("OpenAI Service Degraded"),
        context: "checkOpenAIStatus",
        additionalData: {
          statusUrl: STATUS_URL,
          statusResponse: data,
          indicator: data.status.indicator,
          description: data.status.description
        }
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    await logError({
      error: error as Error,
      context: "checkOpenAIStatus",
      additionalData: { statusUrl: STATUS_URL }
    });

    return NextResponse.json({
      operational: false,
      status: "Unable to check OpenAI status"
    });
  }
} 