"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import ProfileSettings from "@/components/ProfileSettings";

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/settings");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileSettings />
      <SubscriptionManagement />
    </div>
  );
}
