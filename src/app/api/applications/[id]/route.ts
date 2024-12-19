import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/errorLogging";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log("[DEBUG] PATCH request received for application:", id);

  let userId: string | null | undefined;

  try {
    const session = await auth();
    userId = session?.userId;

    console.log("[DEBUG] Auth session:", { userId });

    if (!userId) {
      console.log("[DEBUG] No userId found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
      console.log("[DEBUG] Parsed request body:", body);
    } catch (e) {
      console.error("[DEBUG] Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { content } = body;
    if (!content) {
      console.log("[DEBUG] Missing content in request");
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Verify the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    });

    console.log("[DEBUG] Found application:", application);

    if (!application || application.userId !== userId) {
      console.log("[DEBUG] Application not found or unauthorized:", {
        applicationId: id,
        userId,
        applicationUserId: application?.userId,
      });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update the application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    console.log(
      "[DEBUG] Successfully updated application:",
      updatedApplication
    );

    return NextResponse.json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("[DEBUG] Error in PATCH handler:", error);
    await logError({
      error: error as Error,
      userId: userId,
      context: "APPLICATION_UPDATE",
      additionalData: {
        applicationId: id,
      },
    });
    return NextResponse.json(
      {
        error: "Internal Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update application",
      },
      { status: 500 }
    );
  }
}
