import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceId = searchParams.get('priceId');
    const period = searchParams.get('period') || 'monthly';
    
    console.log('Setup route params:', { priceId, period, url: req.url });
    
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

    // Create or update user with proper name and email
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        stripeCustomerId: customer.id,
        credits: 3,
        subscriptionStatus: "free",
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
      update: {
        stripeCustomerId: customer.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
    });

    // Create checkout session with the provided priceId
    console.log('Creating checkout session with:', { 
      priceId: priceId || process.env.STRIPE_PRICE_ID,
      period,
      userId 
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/canceled`,
      metadata: {
        userId,
        period,
      },
    });

    console.log('Created session:', { 
      sessionId: session.id,
      sessionUrl: session.url 
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
  } catch (error) {
    console.error("[SETUP_GET] Error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
  }
}

// Keep POST handler for direct subscription flow
export { POST } from "./post";
