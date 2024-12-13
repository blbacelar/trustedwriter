"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  period?: 'monthly' | 'annual';
  priceId: string;
  isCredit?: boolean;
  credits?: number;
}

export default function SubscribeButton({ 
  period = 'monthly', 
  priceId, 
  isCredit = false,
  credits 
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      router.push(`/sign-up?subscribe=true&priceId=${priceId}`);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch("/api/stripe", {
        method: "POST",
        body: JSON.stringify({ 
          priceId,
          isCredit,
          period: isCredit ? undefined : period
        })
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
      {loading 
        ? t("pricing.loading") 
        : isCredit 
          ? t("pricing.credits.buy") 
          : t("pricing.pro.cta")
      }
    </button>
  );
}
