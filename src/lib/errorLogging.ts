import { PrismaClient } from "@prisma/client";

// Create a new instance of PrismaClient for error logging
const prismaError = new PrismaClient();

export async function logError({
  error,
  userId,
  context,
  additionalData,
}: {
  error: Error | unknown;
  userId?: string | null;
  context: string;
  additionalData?: Record<string, any>;
}) {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    await prismaError.errorLog.create({
      data: {
        userId,
        message: errorMessage,
        stack: errorStack,
        context,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
        timestamp: new Date(),
      },
    });
  } catch (loggingError) {
    console.error("Failed to log error:", loggingError);
  }
} 