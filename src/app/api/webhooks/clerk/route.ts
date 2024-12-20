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
    svix_signature: svix_signature ? "present" : "missing",
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

    // Validate webhook signature
    const payload = await validateRequest(request);
    if (!payload) {
      console.error("❌ Webhook validation failed");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = payload as WebhookEvent;
    console.log("✅ Processing event:", event.type);

    if (event.type === "user.created" || event.type === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        primary_email_address_id,
        external_accounts,
      } = event.data;

      console.log("🔍 Processing user data:", {
        userId: id,
        hasEmails: !!email_addresses?.length,
        primaryEmailId: primary_email_address_id,
        hasExternalAccounts: !!external_accounts?.length,
      });

      // Get primary email
      const primaryEmail = email_addresses?.find(
        (email) => email.id === primary_email_address_id
      );

      // Get Google account data
      const googleAccount = external_accounts?.find(
        (account) => "google_id" in account
      ) as any; // Type assertion for accessing google-specific fields

      // Prepare user data
      const firstName = first_name || googleAccount?.given_name;
      const lastName = last_name || googleAccount?.family_name;
      const name =
        [firstName, lastName].filter(Boolean).join(" ") || "Anonymous User";
      const email =
        primaryEmail?.email_address || googleAccount?.email_address || "";

      console.log("📝 Prepared user data:", {
        name,
        hasEmail: !!email,
        source: googleAccount ? "Google" : "Direct",
      });

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { id },
          select: { id: true },
        });

        console.log("🔍 User check:", existingUser ? "Exists" : "New user");

        const userData = {
          id,
          email,
          name,
          profile: "",
          rules: [],
          credits: 3,
          subscriptionStatus: "free",
          lastCreditReset: new Date(),
        };

        const upsertedUser = await prisma.user.upsert({
          where: { id },
          create: userData,
          update: {
            email,
            name,
          },
        });

        console.log("✅ User upserted:", {
          id: upsertedUser.id,
          name: upsertedUser.name,
          hasEmail: !!upsertedUser.email,
        });

        return NextResponse.json({
          success: true,
          user: {
            id: upsertedUser.id,
            name: upsertedUser.name,
            hasEmail: !!upsertedUser.email,
          },
        });
      } catch (error) {
        console.error("❌ Database operation failed:", {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });

        await logError({
          error: error as Error,
          context: "CLERK_WEBHOOK_USER_OPERATION",
          additionalData: {
            userId: id,
            operation: (await prisma.user.findUnique({ where: { id } }))
              ? "update"
              : "create",
          },
        });

        return NextResponse.json(
          {
            error: "Failed to process user",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    console.log("=== Webhook End ===");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook handler failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
