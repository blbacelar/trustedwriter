import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, level, data, source } = await req.json();

    // Store log in database
    await prisma.log.create({
      data: {
        message,
        level,
        data: data ? JSON.stringify(data) : null,
        source,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to store log:", error);
    return NextResponse.json({ error: "Failed to store log" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
