"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import ProfileSettings from "@/components/ProfileSettings";
import LoadingPage from "@/components/LoadingPage";

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const isLoggingOut = window.location.href.includes('logout');
      if (!isLoggingOut) {
        router.push("/sign-in?redirect_url=/settings");
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return <LoadingPage />;
  }

  // Don't render anything if not signed in
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileSettings />
      <SubscriptionManagement />
    </div>
  );
}
