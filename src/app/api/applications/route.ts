import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has completed their settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.profile || !user?.rules?.length) {
      return NextResponse.json(
        { error: "Please complete your profile and rules in settings first" },
        { status: 403 }
      );
    }

    const { content, listingUrl } = await req.json();

    const application = await prisma.application.create({
      data: {
        userId,
        content,
        listingUrl,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
