"use client";

import { scrapeAndGetApplication } from "@/lib/actions/index";
import { FormEvent, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCredits } from "@/contexts/CreditsContext";
import { useUser } from "@clerk/nextjs";
import { logError } from "@/lib/errorLogging";

interface SearchbarProps {
  onApplicationData: (data: string | null) => void;
}

export default function Searchbar({ onApplicationData }: SearchbarProps) {
  const [url, setUrl] = useState("");
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      console.log(`Profile: ${JSON.stringify(data, null, 2)}`);

      if (!data.data?.profile) {
        toast.error(t("dashboard.searchbar.noProfile"));
        router.push("/settings");
        return;
      }

      if (url) {
        await onApplicationData(url);
        setUrl("");
      }
    } catch (error) {
      await logError({
        error: error as Error,
        context: "SUBMIT_SEARCH_CLIENT",
        additionalData: {
          component: "Searchbar",
        },
      });

      console.error("Error checking profile:", error);
      toast.error(t("dashboard.searchbar.failed"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("dashboard.searchbar.placeholder")}
          className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors disabled:opacity-50 mx-auto sm:mx-0"
        >
          {t("dashboard.searchbar.button")}
        </button>
      </div>
    </form>
  );
}
