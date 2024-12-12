import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth();
  const { userId } = session || {};

  if (!userId) {
    redirect("/sign-in");
  }

  return <>{children}</>;
} 