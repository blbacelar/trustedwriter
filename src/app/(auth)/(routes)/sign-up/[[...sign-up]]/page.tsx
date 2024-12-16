"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const subscribe = searchParams.get("subscribe");
  const priceId = searchParams.get("priceId");
  const period = searchParams.get("period");
  const isCredit = !period; // If there's no period, it's a credit purchase

  // Construct the redirect URL with all parameters
  const afterSignUpUrl = subscribe 
    ? `/api/setup?subscribe=true&priceId=${priceId}${isCredit ? '&isCredit=true' : `&period=${period}`}`
    : "/dashboard";

  console.log('Sign-up page params:', { subscribe, priceId, period, isCredit, afterSignUpUrl });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#00B5B4] hover:bg-[#00A3A2]",
          },
        }}
        afterSignUpUrl={afterSignUpUrl}
      />
    </div>
  );
}
