import { prisma } from "./prisma";
import { logger } from "@/utils/logger";

export async function logError({
  error,
  context,
  additionalData,
  userId,
}: {
  error: Error;
  context: string;
  additionalData?: Record<string, any>;
  userId?: string;
}) {
  try {
    await prisma.errorLog.create({
      data: {
        message: error.message,
        stack: error.stack,
        context,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
        userId,
      },
    });
  } catch (loggingError) {
    logger.error("Failed to log error:", loggingError);
  }
}
