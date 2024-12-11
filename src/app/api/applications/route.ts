import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, listingUrl } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const application = await prisma.applications.create({
      data: {
        user_id: userId,
        content,
        listing_url: listingUrl,
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

    const applications = await prisma.applications.findMany({
      where: { user_id: userId },
      orderBy: { created_time: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
