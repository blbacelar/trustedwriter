"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Pen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[#00B5B4]"
          >
            <Pen className="h-6 w-6" />
            TrustedWriter
          </Link>

          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Link
                href="/settings"
                className="text-gray-600 hover:text-[#00B5B4] transition-colors"
              >
                {t("navbar.settings")}
              </Link>
            )}
            <LanguageSelector />
            <div className="ml-auto flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
