import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { logError } from "@/lib/errorLogging";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create user if they don't exist
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          credits: 3,
          subscriptionStatus: "free",
          lastCreditReset: new Date(),
        },
      });
    }

    // Create Stripe customer if it doesn't exist
    if (!user.stripeCustomerId) {
      const currentUserData = await currentUser();
      const customer = await stripe.customers.create({
        email: currentUserData?.emailAddresses[0]?.emailAddress,
        metadata: {
          userId,
        },
      });

      user = await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    const body = await request.json();
    const { priceId, isCredit, credits, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&credits=${credits}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: {
        userId,
        credits: credits?.toString(),
        isCredit: "true",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_POST]", error);
    await logError({
      error: error as Error,
      context: "STRIPE_CHECKOUT_POST",
      additionalData: {
        path: "/api/stripe/checkout"
      }
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 