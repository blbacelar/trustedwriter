import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/errorLogging";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  console.log('[Webhook] Received webhook request');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('[Webhook] Signature verification failed:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log('[Webhook] Event:', {
    type: event.type,
    id: event.id,
    metadata: (event.data.object as any).metadata
  });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a credit purchase
      if (session.metadata?.isCredit === 'true') {
        const credits = parseInt(session.metadata.credits || '0', 10);
        
        // Find user by stripeCustomerId
        const user = await prisma.user.findFirst({
          where: {
            stripeCustomerId: session.customer as string,
          },
        });

        if (!user) {
          console.error("User not found for customer:", session.customer);
          return new NextResponse("User not found", { status: 404 });
        }

        // Add new credits to existing credits
        const currentCredits = user.credits || 0;
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            credits: currentCredits + credits,
          },
        });

        console.log("Updated user credits:", {
          userId: updatedUser.id,
          previousCredits: currentCredits,
          addedCredits: credits,
          newTotal: updatedUser.credits
        });

        return new NextResponse(null, { status: 200 });
      }

      // Get the subscription
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      console.log("Processing subscription:", {
        subscriptionId: subscription.id,
        customerId: session.customer,
        status: subscription.status,
      });

      // Find user by stripeCustomerId
      const user = await prisma.user.findFirst({
        where: {
          stripeCustomerId: session.customer as string,
        },
      });

      if (!user) {
        console.error("User not found for customer:", session.customer);
        return new NextResponse("User not found", { status: 404 });
      }

      // Update user with subscription details
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionId: subscription.id,
          subscriptionStatus: "active",
          priceId: subscription.items.data[0].price.id,
          credits: null, // Set credits to null for unlimited access
        },
      });

      console.log("Updated user subscription:", {
        userId: updatedUser.id,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionId: updatedUser.subscriptionId,
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.update({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          subscriptionStatus: subscription.status,
          cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.update({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          subscriptionStatus: "free",
          subscriptionId: null,
          priceId: null,
          credits: 3,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    await logError({
      error: error as Error,
      context: "STRIPE_WEBHOOK",
      additionalData: {
        path: "/api/webhooks/stripe"
      }
    });
    
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
