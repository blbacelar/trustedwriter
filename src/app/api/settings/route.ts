import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { logError } from "@/lib/errorLogging";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log('1. Auth session:', { userId: session?.userId });

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
      console.log('2. Request body:', body);
    } catch (e) {
      console.error('3. Failed to parse body:', e);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { profile, rules } = body || {};
    console.log('4. Parsed data:', { profile, rules });

    try {
      const updatedUser = await prisma.user.upsert({
        where: { 
          id: session.userId 
        },
        create: {
          id: session.userId,
          profile,
          rules: rules || [],
          credits: 3,
          subscriptionStatus: 'free'
        },
        update: {
          profile,
          rules: rules || []
        }
      });

      console.log('5. Updated user:', updatedUser);

      revalidatePath("/settings");
      revalidatePath("/dashboard");

      return NextResponse.json({ 
        success: true, 
        data: updatedUser,
        message: 'Settings saved successfully'
      });

    } catch (e) {
      const dbError = {
        code: e instanceof Prisma.PrismaClientKnownRequestError ? e.code : 'unknown',
        message: e instanceof Error ? e.message : 'Unknown error'
      };
      console.error('6. Database error:', dbError);

      return NextResponse.json({ 
        success: false,
        error: "Database error",
        message: dbError.message
      }, { status: 500 });
    }
  } catch (error) {
    await logError({
      error: error as Error,
      context: "POST_SETTINGS",
      additionalData: {
        path: "/api/settings"
      }
    });
    
    const safeError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    };
    
    console.error('POST settings - error:', safeError);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    console.log("GET settings - session:", { userId: session?.userId });

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        profile: true,
        rules: true,
      },
    });

    console.log("GET settings - found user:", user);

    if (!user) {
      return NextResponse.json({ 
        success: true, 
        data: { profile: "", rules: [] } 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
