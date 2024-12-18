import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    // If user is not authenticated, redirect to home page
    if (!userId) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is authenticated, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));

  } catch (error) {
    console.error("[STRIPE_CANCEL_GET]", error);
    // Default to home page if there's an error
    return NextResponse.redirect(new URL("/", request.url));
  }
} 