import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function GET() {
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

    // Create or update user with Stripe customer ID and initialize as free plan
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        stripeCustomerId: customer.id,
        credits: 3,
        subscriptionStatus: "free", // Initialize as free plan
        email: userId,
        name: userId,
      },
      update: {
        stripeCustomerId: customer.id,
      },
    });

    // Get auth token from headers
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    // Create checkout session directly instead of using fetch
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/canceled`,
      metadata: {
        userId,
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
  } catch (error) {
    console.error("[SETUP_GET]", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
  }
}

// Keep POST handler for direct subscription flow
export { POST } from "./post";
