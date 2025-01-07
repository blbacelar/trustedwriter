import { prisma } from "./prisma";
import { logger } from "@/utils/logger";

export async function logError({
  error,
  context,
  additionalData,
}: {
  error: Error;
  context: string;
  additionalData?: Record<string, any>;
}) {
  try {
    await prisma.errorLog.create({
      data: {
        message: error.message,
        stack: error.stack,
        context,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
      },
    });
  } catch (loggingError) {
    logger.error("Failed to log error:", loggingError);
  }
}
