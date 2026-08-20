import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";

import { useLocalStorage } from "./storage";

export type ThemeMode = "light" | "dark" | "system";
export type Tone = "Formal" | "Friendly" | "Persuasive";
export type ResearchStyle = "Executive Brief" | "Detailed Overview" | "Actionable Recommendations";

export type Preferences = {
  theme: ThemeMode;
  defaultTone: Tone;
  defaultResearchStyle: ResearchStyle;
  toolsUsed: number;
};

const DEFAULTS: Preferences = {
  theme: "system",
  defaultTone: "Formal",
  defaultResearchStyle: "Executive Brief",
  toolsUsed: 0,
};

type Ctx = {
  prefs: Preferences;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  countToolUse: () => void;
  resolvedTheme: "light" | "dark";
};

const PreferencesContext = createContext<Ctx | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { value: prefs, setValue } = useLocalStorage<Preferences>("workmate.prefs.v1", DEFAULTS);

  const setPref = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
      setValue((prev) => ({ ...prev, [key]: value })),
    [setValue],
  );

  const countToolUse = useCallback(
    () => setValue((prev) => ({ ...prev, toolsUsed: prev.toolsUsed + 1 })),
    [setValue],
  );

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = prefs.theme === "dark" || (prefs.theme === "system" && media.matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [prefs.theme]);

  const resolvedTheme: "light" | "dark" =
    prefs.theme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : prefs.theme;

  const value = useMemo(
    () => ({ prefs, setPref, countToolUse, resolvedTheme }),
    [prefs, setPref, countToolUse, resolvedTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
