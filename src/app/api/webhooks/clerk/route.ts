import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logError } from "@/lib/errorLogging";

const prisma = new PrismaClient();

// Webhook secret from Clerk Dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

async function validateRequest(request: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Log webhook headers for testing
  console.log("Webhook Headers:", {
    svix_id,
    svix_timestamp,
    svix_signature: svix_signature ? "present" : "missing"
  });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("Missing required headers");
    return false;
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  if (!webhookSecret) {
    console.log("Missing CLERK_WEBHOOK_SECRET");
    throw new Error("Missing CLERK_WEBHOOK_SECRET!");
  }

  const wh = new Webhook(webhookSecret);
  try {
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("Verified webhook payload:", evt);
    return evt;
  } catch (error) {
    console.log("Webhook verification failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    console.log("Received webhook request");
    
    const payload = await validateRequest(request);
    if (!payload) {
      console.log("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = payload as WebhookEvent;
    console.log("Webhook event type:", event.type);
    console.log("Full event data:", JSON.stringify(event.data, null, 2));

    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name, primary_email_address_id } = event.data;
      console.log("Processing user creation:", {
        id,
        email_addresses,
        first_name,
        last_name,
        primary_email_address_id
      });
      
      const primaryEmail = email_addresses?.find(email => email.id === primary_email_address_id);

      if (!primaryEmail?.email_address) {
        console.log("No primary email found for user:", id);
        throw new Error("No primary email found");
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous User";
      const userData = {
        id,
        email: primaryEmail.email_address,
        name,
        rules: [],
        credits: 3,
        lastCreditReset: new Date(),
      };
      console.log("Creating user with data:", userData);

      const createdUser = await prisma.user.create({ data: userData });
      console.log("User created successfully:", createdUser);

      await logError({
        error: new Error("User created successfully - Test log"),
        userId: id,
        context: "clerkWebhook",
        additionalData: { 
          event: "user.created",
          userData,
          createdUser
        }
      });

      return NextResponse.json({ success: true, user: createdUser });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    await logError({
      error: error as Error,
      context: "clerkWebhook",
      additionalData: { 
        event: "user.created",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 