import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    const session = await auth();
    const { userId } = session || {};
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        subscriptionId: true,
        subscriptionStatus: true,
      },
    });

    console.log("User data from DB:", user);

    if (!user) {
      return NextResponse.json({
        credits: 3,
        subscriptionId: null,
        subscriptionStatus: "free",
      });
    }

    const response = {
      credits: user.credits,
      subscriptionId: user.subscriptionId,
      subscriptionStatus: user.subscriptionStatus || "free",
    };

    console.log("API Response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "[CREDITS_GET]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        credits: null,
        subscriptionId: null,
        subscriptionStatus: null,
        error: "Internal Error",
      },
      { status: 500 }
    );
  }
}
