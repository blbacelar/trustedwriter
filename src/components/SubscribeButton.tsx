"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      router.push("/sign-up?subscribe=true");
      return;
    }

    try {
      setLoading(true);
      
      // First create/setup the customer
      const setupResponse = await fetch("/api/setup", {
        method: "POST",
      });
      
      if (!setupResponse.ok) {
        toast.error("Failed to setup subscription");
        return;
      }

      // Then create checkout session
      const response = await fetch("/api/stripe", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-[#00B5B4] hover:bg-[#00A3A2] text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50"
    >
      {loading ? t("pricing.pro.loading") : t("pricing.pro.cta")}
    </button>
  );
}
