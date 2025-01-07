import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use standard Prisma client
    const result = await prisma.user.updateMany({
      where: {
        subscriptionId: null,
      },
      data: {
        credits: 3,
      },
    });

    return NextResponse.json({ success: true, updated: result });
  } catch (error) {
    console.error("Error in reset-credits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
