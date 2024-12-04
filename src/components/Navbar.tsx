"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-[#00B5B4]">
            TrustedWriter
          </Link>

          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Link
                href="/settings"
                className="text-gray-600 hover:text-[#00B5B4] transition-colors"
              >
                Settings
              </Link>
            )}
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
