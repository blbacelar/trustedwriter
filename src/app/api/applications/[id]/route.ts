import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await auth();
    const { userId } = session || {};

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received update request:', { id: context.params.id, body });

    const { content } = body;
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id: context.params.id },
      select: { userId: true }
    });

    console.log('Found application:', application);

    if (!application || application.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update the application
    const updatedApplication = await prisma.application.update({
      where: { id: context.params.id },
      data: { content }
    });

    console.log('Updated application:', updatedApplication);

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("[APPLICATION_PATCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 