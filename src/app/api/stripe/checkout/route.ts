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
    const body = await request.json();
    const { priceId, cancelUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user
    const user = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        credits: 3,
        subscriptionStatus: "free",
      },
      update: {},
    });

    // Create Stripe customer if it doesn't exist
    if (!user.stripeCustomerId) {
      const currentUserData = await currentUser();
      const customer = await stripe.customers.create({
        email: currentUserData?.emailAddresses[0]?.emailAddress,
        metadata: {
          userId,
        },
      });

      // Update user with new Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });

      user.stripeCustomerId = customer.id;
    }

    // Get credit amount based on priceId
    let credits = 0;
    switch (priceId) {
      case "price_1QYAEo04BafnFvRo9f1l5Xuw":
        credits = 10;
        break;
      case "price_1QYAEj04BafnFvRoQuxw3lHk":
        credits = 30;
        break;
      case "price_1QYAEe04BafnFvRoY1Na59aK":
        credits = 75;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid price ID" },
          { status: 400 }
        );
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
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
        credits: credits.toString(),
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
        path: "/api/stripe/checkout",
      },
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
