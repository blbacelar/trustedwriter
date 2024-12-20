import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { logError } from "@/lib/errorLogging";
import { encrypt, decrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log("1. Auth session:", { userId: session?.userId });

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
      console.log("2. Request body:", { ...body, profile: "[REDACTED]" });
    } catch (e) {
      console.error("3. Failed to parse body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { profile, rules } = body || {};

    try {
      const encryptedProfile = profile ? encrypt(profile) : "";
      const encryptedRules = rules
        ? rules.map((rule: string) => encrypt(rule))
        : [];

      const updatedUser = await prisma.user.upsert({
        where: {
          id: session.userId,
        },
        create: {
          id: session.userId,
          profile: encryptedProfile,
          rules: encryptedRules,
          credits: 3,
          subscriptionStatus: "free",
        },
        update: {
          profile: encryptedProfile,
          rules: encryptedRules,
        },
      });

      // Decrypt data before sending response
      const decryptedUser = {
        ...updatedUser,
        profile: updatedUser.profile ? decrypt(updatedUser.profile) : "",
        rules: updatedUser.rules.map((rule) => decrypt(rule)),
      };

      console.log("5. Updated user:", {
        ...decryptedUser,
        profile: "[REDACTED]",
      });

      revalidatePath("/settings");
      revalidatePath("/dashboard");

      return NextResponse.json({
        success: true,
        data: decryptedUser,
        message: "Settings saved successfully",
      });
    } catch (e) {
      const dbError = {
        code:
          e instanceof Prisma.PrismaClientKnownRequestError
            ? e.code
            : "unknown",
        message: e instanceof Error ? e.message : "Unknown error",
      };
      console.error("6. Database error:", dbError);

      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: dbError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    await logError({
      error: error as Error,
      context: "POST_SETTINGS",
      additionalData: {
        path: "/api/settings",
      },
    });

    const safeError = {
      message: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.constructor.name : typeof error,
    };

    console.error("POST settings - error:", safeError);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    console.log("GET settings - session:", { userId: session?.userId });

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        profile: true,
        rules: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        data: { profile: "", rules: [] },
      });
    }

    // Decrypt data before sending response
    const decryptedUser = {
      profile: user.profile ? decrypt(user.profile) : "",
      rules: user.rules.map((rule) => decrypt(rule)),
    };

    return NextResponse.json({
      success: true,
      data: decryptedUser,
    });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
