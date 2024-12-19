import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { logError } from "@/lib/errorLogging";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing user first
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    const upsertedUser = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User",
        profile: "",
        rules: [],
        credits: 3,
        subscriptionStatus: "free",
        lastCreditReset: new Date()
      },
      update: {},
    });

    return NextResponse.json({ success: true, user: upsertedUser });
  } catch (error) {
    console.error("[SETUP_POST]", error);
    await logError({
      error: error as Error,
      context: "SETUP_POST",
      additionalData: {
        path: "/api/setup/post"
      }
    });
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
