"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language } from "@/lib/translations";

const languages: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "es", flag: "🇪🇸", label: "Español" }
];

export default function CustomUserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <img
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">
            {user.fullName}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-gray-500 text-xs uppercase">
          {t("nav.language")}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {languages.map(({ code, flag, label }) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setLanguage(code)}
              className={cn(
                "cursor-pointer",
                language === code && "bg-gray-100"
              )}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span className="mr-2">{flag}</span>
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("nav.settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("nav.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 