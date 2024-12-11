"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Pen, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useState } from "react";
import CreditsIndicator from "./CreditsIndicator";

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
                <Link href="/settings" className="text-gray-600 hover:text-[#00B5B4] transition-colors">
                  {t("navbar.settings")}
                </Link>
                <LanguageSelector />
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <LanguageSelector />
                <Link href="/sign-in" className="border-2 border-[#00B5B4] text-[#00B5B4] px-4 py-2 rounded-full hover:bg-[#00B5B4] hover:text-white transition-colors">
                  {t("navbar.login")}
                </Link>
                <Link href="/sign-up" className="bg-[#00B5B4] text-white px-4 py-2 rounded-full hover:bg-[#00A3A2] transition-colors">
                  {t("navbar.signup")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
              <div className="px-4 py-4 space-y-4">
                {isSignedIn && <CreditsIndicator />}
                {isSignedIn ? (
                  <>
                    <Link href="/settings" className="block text-gray-600 hover:text-[#00B5B4] transition-colors">
                      {t("navbar.settings")}
                    </Link>
                    <div className="py-2">
                      <LanguageSelector />
                    </div>
                    <div className="py-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-2">
                      <LanguageSelector />
                    </div>
                    <Link href="/sign-in" className="block text-center border-2 border-[#00B5B4] text-[#00B5B4] px-4 py-2 rounded-full hover:bg-[#00B5B4] hover:text-white transition-colors">
                      {t("navbar.login")}
                    </Link>
                    <Link href="/sign-up" className="block text-center bg-[#00B5B4] text-white px-4 py-2 rounded-full hover:bg-[#00A3A2] transition-colors">
                      {t("navbar.signup")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
