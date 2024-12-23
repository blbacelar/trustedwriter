import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

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
    console.log("[SettingsForm] Starting form submission");
    setSaving(true);

    try {
      console.log("[SettingsForm] Sending request to /api/settings");
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, rules }),
      });

      console.log("[SettingsForm] Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      const data = await response.json();
      console.log("[SettingsForm] Settings saved successfully:", data);

      toast.success(t("settings.save.success"), {
        duration: 2000,
        onClose: () => {
          console.log("[SettingsForm] Toast closed, initiating navigation");
          // Clear any cached data
          localStorage.clear();
          sessionStorage.clear();

          // Force reload and redirect
          console.log("[SettingsForm] Performing hard redirect to dashboard");
          window.location.href = `${
            window.location.origin
          }/dashboard?t=${Date.now()}`;
        },
      });
    } catch (error) {
      console.error("[SettingsForm] Error saving settings:", error);
      toast.error(t("settings.save.error"));
    } finally {
      console.log("[SettingsForm] Completing submission process");
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form content */}</form>;
}
