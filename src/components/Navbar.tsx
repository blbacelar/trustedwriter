"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Pen, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";
import CreditsIndicator from "./CreditsIndicator";
import CustomUserButton from "./CustomUserButton";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#00B5B4]">
            <Pen className="h-6 w-6" />
            TrustedWriter
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn && <CreditsIndicator />}
            {isSignedIn ? (
              <>
                <LanguageSelector />
                <CustomUserButton />
              </>
            ) : (
              <>
                <LanguageSelector />
                <Link href="/sign-in" className="border-2 border-[#00B5B4] text-[#00B5B4] px-4 py-2 rounded-full hover:bg-[#00B5B4] hover:text-white transition-colors">
                  {t("nav.login")}
                </Link>
                <Link href="/sign-up" className="bg-[#00B5B4] text-white px-4 py-2 rounded-full hover:bg-[#00A3A2] transition-colors">
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-2 space-y-2">
            {isSignedIn ? (
              <>
                <div className="py-2">
                  <CreditsIndicator />
                </div>
                <Link
                  href="/settings"
                  className="block py-2 text-gray-600 hover:text-[#00B5B4] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("navbar.settings")}
                </Link>
                <div className="py-2">
                  <LanguageSelector />
                </div>
                <div className="py-2">
                  <CustomUserButton />
                </div>
              </>
            ) : (
              <>
                <div className="py-2">
                  <LanguageSelector />
                </div>
                <Link
                  href="/sign-in"
                  className="block py-2 text-[#00B5B4] hover:text-[#00A3A2] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/sign-up"
                  className="block py-2 text-[#00B5B4] hover:text-[#00A3A2] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
