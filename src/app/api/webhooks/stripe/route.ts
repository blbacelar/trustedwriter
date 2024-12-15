import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log("Received webhook event:", {
    type: event.type,
    id: event.id,
    object: event.data.object,
  });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

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
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
