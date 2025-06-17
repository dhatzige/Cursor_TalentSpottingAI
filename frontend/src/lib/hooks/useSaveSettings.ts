"use client";

import { useState } from "react";

/**
 * Reusable hook for persisting dashboard settings.
 * In production this would talk to a real API/DB. For now it POSTS to /api/settings
 * which simply logs and returns success. You get `saving` & `saved` flags for UI feedback.
 */
export function useSaveSettings<T>() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = async (settings: T) => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      // drop the saved flag after a short delay so UI resets
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings", err);
      // Could show toast / error state here
    } finally {
      setSaving(false);
    }
  };

  return { saveSettings, saving, saved };
}
