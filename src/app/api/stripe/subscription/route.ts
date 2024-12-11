import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.subscriptionId) {
      return NextResponse.json({ status: "inactive" });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

    return NextResponse.json({
      status: subscription.status,
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 