// Add better error handling and loading state management
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
    setSaving(false); // Ensure loading state is always cleared
  }
};
