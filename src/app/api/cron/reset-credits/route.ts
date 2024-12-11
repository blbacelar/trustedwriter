import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Verify the cron secret to ensure this is a legitimate request
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset credits for all free users (those without subscriptionId)
    const result = await prisma.user.updateMany({
      where: {
        subscriptionId: null,
      },
      data: {
        credits: 3, // Reset to default free credits
        lastCreditReset: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      usersUpdated: result.count,
    });
  } catch (error) {
    console.error('[RESET_CREDITS]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
} 