import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { profile, rules } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        profile,
        rules,
      },
      create: {
        id: userId,
        profile,
        rules,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({
      profile: user?.profile || "",
      rules: user?.rules || [],
    });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
