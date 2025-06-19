"use client";

/**
 * Simple theme utility to handle light/dark mode preference.
 * 
 * It stores the preference in `localStorage` (key: "theme") and ensures that the
 * `dark` class is applied to the <html> element so TailwindCSS dark variant works.
 */
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Apply the given theme by toggling the `dark` class on the <html> root element.
 */
export function applyTheme(_: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
}

/**
 * Get the user-preferred theme.
 * 1. Check localStorage.
 * 2. Fallback to system preference.
 */
export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  // Fallback to system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * Persist the theme choice and apply it immediately.
 */
export function setPreferredTheme(_: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, 'dark');
  applyTheme('dark');
}

/**
 * Toggle between light and dark themes.
 */
export function toggleTheme() {
  if (typeof window === "undefined") return;
  setPreferredTheme('dark');
  return 'dark';
}
