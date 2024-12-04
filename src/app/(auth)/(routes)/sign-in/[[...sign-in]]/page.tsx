import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#00B5B4] hover:bg-[#00A3A2]",
          },
        }}
      />
    </div>
  );
}
