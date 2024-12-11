"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const subscribe = searchParams.get("subscribe");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#00B5B4] hover:bg-[#00A3A2]",
          },
        }}
        redirectUrl={subscribe ? "/api/setup" : "/dashboard"}
      />
    </div>
  );
}
