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
      where: { user_id: userId },
      update: {
        first_name: profile,
        subscription: rules.join(","),
      },
      create: {
        user_id: userId,
        email: "",
        first_name: profile,
        subscription: rules.join(","),
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
      where: { user_id: userId },
    });

    return NextResponse.json({
      profile: user?.first_name || "",
      rules: user?.subscription?.split(",") || [],
    });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
