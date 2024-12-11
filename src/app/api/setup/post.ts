import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      metadata: {
        userId,
      },
    });

    // Create or update user with Stripe customer ID
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        stripeCustomerId: customer.id,
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