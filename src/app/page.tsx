import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingContent from "@/components/LandingContent";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <LandingContent />;
}
