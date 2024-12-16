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
  const headerPayload = await headers();
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
    console.log("=== Webhook Start ===");
    console.log("Received webhook request at:", new Date().toISOString());
    
    const headerPayload = await headers();
    console.log("Headers:", {
      'svix-id': headerPayload.get("svix-id"),
      'svix-timestamp': headerPayload.get("svix-timestamp"),
      'svix-signature': headerPayload.get("svix-signature") ? "present" : "missing"
    });

    const payload = await validateRequest(request);
    if (!payload) {
      console.log("❌ Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = payload as WebhookEvent;
    console.log("✅ Webhook event type:", event.type);
    console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name, primary_email_address_id } = event.data;
      console.log("👤 Creating user with ID:", id);
      
      const primaryEmail = email_addresses?.find(email => email.id === primary_email_address_id);
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous User";

      try {
        const userData = {
          id,
          email: primaryEmail?.email_address,
          name,
          profile: "",
          rules: [],
          credits: 3,
          subscriptionStatus: "free",
          lastCreditReset: new Date()
        };

        console.log("📝 User data to create:", userData);

        const createdUser = await prisma.user.create({ 
          data: userData,
          select: {
            id: true,
            email: true,
            name: true,
            profile: true,
            rules: true,
            credits: true,
            subscriptionStatus: true
          }
        });

        console.log("✅ User created successfully:", createdUser);
        return NextResponse.json({ success: true, user: createdUser });
      } catch (error) {
        console.error("❌ Database error:", error);
        throw error;
      }
    }

    console.log("=== Webhook End ===");
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { status: 500 }
    );
  }
} 