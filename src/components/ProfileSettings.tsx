"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          setRules(data.rules);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile, rules }),
      });

      if (response.ok) {
        toast.success(t("settings.save.success"));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t("settings.save.error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-[#00B5B4] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      <h1 className="text-3xl font-bold text-[#1B1B1B]">
        {t("settings.title")}
      </h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("settings.profile.title")}
        </h2>
        <textarea
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B5B4]"
          placeholder={t("settings.profile.placeholder")}
        />
      </div>

      {/* Rules Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("settings.rules.title")}
        </h2>
        <ul className="space-y-1 mb-6">
          {rules.map((rule, index) => (
            <li
              key={index}
              className={`flex items-center justify-between group p-3 rounded-lg
                ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                hover:bg-gray-100 transition-colors`}
            >
              <span className="text-gray-700">{rule}</span>
              <button
                onClick={() => handleDeleteRule(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                title={t("settings.rules.deleteButton")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        {/* Add New Rule */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B5B4]"
            placeholder={t("settings.rules.addPlaceholder")}
          />
          <button
            onClick={handleAddRule}
            className="px-6 py-2 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-lg transition-colors"
          >
            {t("settings.rules.addButton")}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t("settings.save.saving")}
          </div>
        ) : (
          t("settings.save.button")
        )}
      </button>
    </div>
  );
} 