"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="h-8 w-8 rounded-full bg-gray-800" data-testid="user-avatar">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
          ) : (
            user.firstName?.[0] || user.emailAddresses[0].emailAddress[0]
          )}
        </div>
        <span className="hidden md:inline truncate max-w-[100px]">
          {user.firstName || user.emailAddresses[0].emailAddress}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          {t("nav.settings")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut(() => router.push("/"))}
          className="text-red-600 focus:text-red-600"
        >
          {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 