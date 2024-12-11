'use server'

import { profile, rules } from '@/utils/rules'
import { queryGPT } from '@/utils/gpt'
import { scrapeWebsite } from '@/utils/scrap'
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function scrapeAndGetApplication(houseSittingUrl: string) {
  if (!houseSittingUrl) return

  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check credits/subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        credits: true, 
        subscriptionId: true,
        lastCreditReset: true 
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.subscriptionId && user.credits <= 0) {
      // Calculate time until next reset
      const now = new Date();
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const daysUntilReset = Math.ceil((nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      throw new Error(`No credits remaining. Credits will reset in ${daysUntilReset} days.`);
    }

    const houseSitting = await scrapeWebsite(houseSittingUrl)
    if (!houseSitting) return

    let prompt = `Based on our profile: ${profile} \n
    Now follow these rules:
    ${rules.toString()} \n

    They live in ${houseSitting.place} and their name is(are) ${houseSitting.parentName}

    This is their introduction:
    ${houseSitting.introduction} \n
    ${houseSitting.responsibilities}

    Write an application to ${houseSitting.parentName} expressing our desire to look after their pets
    `

    const content = await queryGPT(prompt)
    if (!content) {
      throw new Error("Failed to generate application content");
    }

    // Save the application
    const application = await prisma.application.create({
      data: {
        userId,
        content,
        listingUrl: houseSittingUrl
      }
    });

    // Decrement credits for free users
    if (!user.subscriptionId) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });
    }

    // Return both content and updated credits
    return {
      content,
      credits: user.subscriptionId ? null : user.credits - 1
    };
  } catch (error: any) {
    console.error("Failed to get application:", error);
    throw error;
  }
}
