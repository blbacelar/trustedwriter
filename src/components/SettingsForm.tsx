import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { serverLogger } from "@/utils/serverLogger";

interface Profile {
  name?: string;
  bio?: string;
}

interface Rules {
  enabled?: boolean;
  preferences?: string[];
}

export default function SettingsForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [rules, setRules] = useState<Rules>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await serverLogger.debug("Settings form submission started", {
        timestamp: new Date().toISOString(),
      });

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, rules }),
      });

      await serverLogger.debug("Settings API response received", {
        status: response.status,
        timestamp: new Date().toISOString(),
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      await response.json();
      await serverLogger.debug("Settings saved successfully");

      toast.success(t("settings.save.success"));

      // Wait for all logs to be saved before navigation
      await Promise.all([
        serverLogger.debug("Preparing for navigation", {
          destination: "/dashboard",
          timestamp: new Date().toISOString(),
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      // Use router.push instead of window.location for smoother navigation
      router.push(`/dashboard?from=settings&t=${Date.now()}`);
    } catch (error: unknown) {
      await serverLogger.error("Settings save failed", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
      toast.error(t("settings.save.error"));
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form content */}</form>;
}
