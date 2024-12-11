"use client";

import { scrapeAndGetApplication } from "@/lib/actions/index";
import { FormEvent, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCredits } from "@/contexts/CreditsContext";

interface SearchbarProps {
  onApplicationData: (data: string | null) => void;
}

const isValidTrustedHouseSitterURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    return parsedURL.hostname.includes("trustedhousesitters.com");
  } catch (error) {
    return false;
  }
};

const Searchbar: React.FC<SearchbarProps> = ({ onApplicationData }) => {
  const { t } = useLanguage();
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setHasProfile(Boolean(data.profile && data.rules?.length));
        }
      } catch (error) {
        console.error("Failed to check profile:", error);
      }
    };

    checkProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await scrapeAndGetApplication(searchPrompt);
      if (response) {
        await onApplicationData(response.content);
        // Refresh credits after generation
        const { refreshCredits } = useCredits();
        await refreshCredits();
      }
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard.searchbar.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        {!hasProfile && (
          <div className="px-6 py-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="text-sm">
              {t("dashboard.searchbar.profileRequired")}{" "}
              <button
                onClick={() => router.push("/settings")}
                className="text-yellow-900 underline hover:text-yellow-700"
              >
                {t("dashboard.searchbar.setupProfile")}
              </button>
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder={t("dashboard.searchbar.placeholder")}
            className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={searchPrompt === "" || isLoading}
            className="px-8 py-4 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">{t("dashboard.searchbar.button")}</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-l-transparent rounded-full" />
                </div>
              </>
            ) : (
              t("dashboard.searchbar.button")
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Searchbar;
