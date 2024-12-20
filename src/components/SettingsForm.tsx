import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Profile {
  name?: string;
  bio?: string;
  // add other profile fields as needed
}

interface Rules {
  // add rule fields as needed
  enabled?: boolean;
  preferences?: string[];
}

export default function SettingsForm() {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [rules, setRules] = useState<Rules>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, rules }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();
      toast.success(t("settings.save.success"));
    } catch (error) {
      console.error("Settings save error:", error);
      toast.error(t("settings.save.error"));
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form content */}</form>;
}
