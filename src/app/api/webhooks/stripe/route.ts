import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { logError } from "@/lib/errorLogging";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  console.log("[Webhook] Received webhook request");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("[Webhook] Signature verification failed:", error.message);
    await logError({
      error: error as Error,
      context: "STRIPE_WEBHOOK_VERIFICATION",
      additionalData: { signature }
    });
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log("[Webhook] Event:", {
    type: event.type,
    id: event.id,
    metadata: (event.data.object as any).metadata,
  });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a credit purchase
      if (session.metadata?.isCredit === "true") {
        const credits = parseInt(session.metadata.credits || "0", 10);
        const userId = session.metadata.userId;

        console.log("[Webhook] Processing credit purchase:", {
          userId,
          credits,
          sessionId: session.id
        });

        if (!userId) {
          console.error("[Webhook] No userId in metadata");
          return new NextResponse("Missing userId", { status: 400 });
        }

        // Find user directly by userId from metadata
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          console.error("[Webhook] User not found:", userId);
          return new NextResponse("User not found", { status: 404 });
        }

        // Add new credits to existing credits
        const currentCredits = user.credits || 0;
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            credits: currentCredits + credits,
            stripeCustomerId: session.customer as string, // Update customer ID if needed
          },
        });

        console.log("[Webhook] Updated user credits:", {
          userId: updatedUser.id,
          previousCredits: currentCredits,
          addedCredits: credits,
          newTotal: updatedUser.credits,
        });

        return new NextResponse(null, { status: 200 });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    await logError({
      error: error as Error,
      context: "STRIPE_WEBHOOK_PROCESSING",
      additionalData: {
        eventType: event.type,
        eventId: event.id,
      }
    });
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
