import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.subscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 });
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 