import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      metadata: {
        userId,
      },
    });

    // Create or update user with proper data
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        stripeCustomerId: customer.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User",
        profile: "",
        rules: [],
        credits: 3,
        subscriptionStatus: "free",
        lastCreditReset: new Date()
      },
      update: {
        stripeCustomerId: customer.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETUP_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
