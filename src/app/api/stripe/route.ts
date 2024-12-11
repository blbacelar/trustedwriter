import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId as string,
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create the checkout session and redirect
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe`, {
      method: "POST",
    });
    const data = await response.json();
    
    if (data.url) {
      return NextResponse.redirect(data.url);
    }
    
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  } catch (error) {
    console.error("[STRIPE_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
