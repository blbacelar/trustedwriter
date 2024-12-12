import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export async function DashboardServer() {
  const headersList = await headers();
  const session = await auth();
  const { userId } = session || {};

  if (!userId) {
    return null; // Or handle unauthorized access
  }

  return { userId };
} 