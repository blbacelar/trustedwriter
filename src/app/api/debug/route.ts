import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, data, source } = await req.json();

    // Store debug log in database
    await prisma.debugLog.create({
      data: {
        message,
        data: data ? JSON.stringify(data) : null,
        source,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Debug logging failed:", error);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
