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
    setSaving(true);

    try {
      // Log before any action
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

      // Show success toast
      toast.success(t("settings.save.success"));

      await serverLogger.debug("Settings saved successfully", {
        timestamp: new Date().toISOString(),
      });

      // Wait for logs to be sent
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log navigation intent
      await serverLogger.debug("Initiating navigation to dashboard", {
        timestamp: new Date().toISOString(),
      });

      // Navigate with timestamp
      const timestamp = Date.now();
      await serverLogger.debug("Navigation starting", {
        destination: `/dashboard?from=settings&t=${timestamp}`,
        timestamp: new Date().toISOString(),
      });

      // Wait again for final log
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/dashboard?from=settings&t=${timestamp}`);
    } catch (error) {
      await serverLogger.error("Settings save failed", {
        error,
        timestamp: new Date().toISOString(),
      });
      toast.error(t("settings.save.error"));
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form content */}</form>;
}
