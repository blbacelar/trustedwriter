"use server";

import { scrapeAndGetApplication as generateApplication } from "@/utils/gpt";
import { scrapeWebsite } from "@/utils/scrap";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { logError } from "@/lib/errorLogging";
import { encrypt, decrypt } from "../encryption";

export async function scrapeAndGetApplication(houseSittingUrl: string) {
  let session;

  try {
    const headersList = await headers();
    session = await auth();
    const { userId } = session || {};

    if (!userId) {
      return {
        error: true,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      };
    }

    // Get user's profile and rules from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: true,
        rules: true,
        credits: true,
        subscriptionId: true,
      },
    });

    if (!user?.profile) {
      return {
        error: true,
        message: "Please set up your profile first",
        code: "PROFILE_REQUIRED",
      };
    }

    // Check credits for free users
    if (!user.subscriptionId && (user.credits || 0) <= 0) {
      // Calculate time until next reset
      const now = new Date();
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const daysUntilReset = Math.ceil(
        (nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        error: true,
        message: `No credits remaining. Credits will reset in ${daysUntilReset} days.`,
        code: "NO_CREDITS",
        meta: {
          daysUntilReset,
          nextReset,
        },
      };
    }

    const houseSitting = await scrapeWebsite(houseSittingUrl);
    if (!houseSitting) return;

    // Use user's profile and rules from DB
    const decryptedProfile = decrypt(user.profile);
    const decryptedRules = user.rules.map((rule) => decrypt(rule));

    let prompt = `Based on our profile: ${decryptedProfile} \n
    Now follow these rules:
    - Don't add Subject line,
    ${decryptedRules.join("\n")} \n

    They live in ${houseSitting.place} and their name is(are) ${
      houseSitting.parentName
    }

    This is their introduction:
    ${houseSitting.introduction} \n
    ${houseSitting.responsibilities}

    Write an application to ${
      houseSitting.parentName
    } expressing our desire to look after their pets
    `;

    const content = await generateApplication(prompt);
    if (!content) {
      throw new Error("Failed to generate application content");
    }

    // Encrypt content before saving
    const encryptedContent = encrypt(content);

    // Save the application with encrypted content
    const application = await prisma.application.create({
      data: {
        userId,
        content: encryptedContent,
        listingUrl: houseSittingUrl,
      },
    });

    // Decrement credits for free users
    if (!user.subscriptionId) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    // Return decrypted content for the response
    return {
      content, // Original content for immediate use
      id: application.id,
      credits: user.subscriptionId ? null : (user.credits ?? 0) - 1,
    };
  } catch (error: any) {
    // Log the error
    await logError({
      error,
      userId: session?.userId,
      context: "scrapeAndGetApplication",
    });

    // Return a structured error response
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      code: error.code || "UNKNOWN_ERROR",
    };
  }
}
