import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const session = await auth();
    const { userId } = session || {};
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
        email: userId,
        name: userId,
      },
    });

    // Revalidate the settings cache
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const headersList = await headers();
    const session = await auth();
    const { userId } = session || {};

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
