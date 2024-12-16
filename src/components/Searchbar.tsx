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
          component: "Searchbar"
        }
      });
      
      console.error("Error checking profile:", error);
      toast.error(t("dashboard.searchbar.failed"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("dashboard.searchbar.placeholder")}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          {t("dashboard.searchbar.button")}
        </button>
      </div>
    </form>
  );
}
