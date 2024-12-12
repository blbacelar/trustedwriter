import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { logError } from "@/lib/errorLogging";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data) {
      const error = new Error("No data provided");
      await logError({
        error,
        context: "generateApplication",
        additionalData: { endpoint: "/api/openai/generate" },
      });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that helps write house sitting applications.",
        },
        {
          role: "user",
          content: data,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    // Log all errors with their specific details
    await logError({
      error: error as Error,
      context: "generateApplication",
      additionalData: {
        endpoint: "/api/openai/generate",
        isOpenAIError: error instanceof OpenAI.APIError,
        openAIErrorDetails:
          error instanceof OpenAI.APIError
            ? {
                status: error.status,
                code: error.code,
                type: error.type,
              }
            : undefined,
      },
    });

    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      { error: "Failed to generate application" },
      { status: 500 }
    );
  }
}
