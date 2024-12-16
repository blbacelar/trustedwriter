import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const CREDIT_PRICE_IDS = [
  'price_1QV5Mr04BafnFvRo949kW8y5', // 10 credits
  'price_1QV5Pl04BafnFvRoKHf3V4mu', // 30 credits
  'price_1QV5Qb04BafnFvRoiLl17ZP3'  // 75 credits
];

const getCreditAmount = (priceId: string): number => {
  switch (priceId) {
    case 'price_1QV5Mr04BafnFvRo949kW8y5': return 10;
    case 'price_1QV5Pl04BafnFvRoKHf3V4mu': return 30;
    case 'price_1QV5Qb04BafnFvRoiLl17ZP3': return 75;
    default: return 0;
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceId = searchParams.get('priceId');
    const period = searchParams.get('period');
    const isCredit = priceId ? CREDIT_PRICE_IDS.includes(priceId) : false;
    const creditAmount = priceId ? getCreditAmount(priceId) : 0;
    
    console.log('Setup route params:', { 
      priceId, 
      period, 
      isCredit,
      creditAmount,
      url: req.url 
    });
    
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      // Create user if doesn't exist
      await prisma.user.create({
        data: {
          id: userId,
          email: user.emailAddresses[0]?.emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User",
          profile: "",
          rules: [],
          credits: 3,
          subscriptionStatus: "free",
          lastCreditReset: new Date()
        }
      });
      console.log("Created new user during setup");
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      metadata: {
        userId,
      },
    });

    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    // Create checkout session with the provided priceId
    console.log('Creating checkout session with:', { 
      priceId: priceId || process.env.STRIPE_PRICE_ID,
      period,
      isCredit,
      creditAmount,
      userId 
    });

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: isCredit ? "payment" : "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/canceled`,
      metadata: {
        userId,
        isCredit: String(isCredit),
        ...(period && !isCredit && { period }),
        ...(isCredit && { credits: String(creditAmount) })
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
