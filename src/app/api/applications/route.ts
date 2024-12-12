import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const session = await auth();
    const { userId } = session || {};

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, subscriptionId: true }
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has subscription or enough credits
    if (!user.subscriptionId && user.credits <= 0) {
      return NextResponse.json({ 
        error: "No credits remaining. Please upgrade to continue." 
      }, { status: 403 });
    }

    const data = await req.json();
    console.log("Received application data:", data);
    
    // Create the application
    const application = await prisma.application.create({
      data: {
        userId,
        content: data.content,
        listingUrl: data.listingUrl
      }
    });
    console.log("Application created:", application);

    // Decrement credits for free users
    if (!user.subscriptionId) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });
      console.log("Credits decremented for user:", userId);
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await headers();
    const session = await auth();
    const { userId } = session || {};

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
