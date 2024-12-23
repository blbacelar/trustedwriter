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

    await serverLogger.debug("Settings form submission started");

    try {
      await serverLogger.debug("Sending settings update request");
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, rules }),
      });

      await serverLogger.debug("Settings API response", {
        status: response.status,
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      await response.json();
      toast.success(t("settings.save.success"));

      await serverLogger.debug(
        "Settings saved, initiating navigation to dashboard"
      );

      // Add a timestamp to force a fresh load
      router.push(`/dashboard?from=settings&t=${Date.now()}`);
    } catch (error) {
      await serverLogger.error("Settings save error", { error });
      toast.error(t("settings.save.error"));
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form content */}</form>;
}
