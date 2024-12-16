"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomUserButton from "@/components/CustomUserButton";
import CreditsIndicator from "@/components/CreditsIndicator";
import { useAuth } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/sign-");
  const { isSignedIn } = useAuth();
  const { t } = useLanguage();

  if (isAuthPage) return null;

  const handleSignUpClick = (e: React.MouseEvent) => {
    // Only handle scroll if we're on the landing page
    if (pathname === "/") {
      e.preventDefault();
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          TrustedWriter
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {isSignedIn ? (
            <>
              <CreditsIndicator />
              <CustomUserButton />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/sign-up"
                onClick={handleSignUpClick}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full transition-colors"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
