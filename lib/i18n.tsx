"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { locales, defaultLocale, type Locale, dictionaries } from "@/lib/dictionaries";

const LOCALE_KEY = "quran:locale:v1";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: typeof dictionaries.en;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (locales as readonly string[]).includes(v);
}

/**
 * Wraps the app and exposes the active locale + dictionary. The user's choice
 * is persisted in localStorage and rehydrated on next visit. SSR-safe — it
 * renders children with the default locale on the server.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Hydrate from storage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(LOCALE_KEY);
      if (isLocale(raw)) setLocaleState(raw);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(LOCALE_KEY, l);
      // Reflect locale on <html lang="…">
      document.documentElement.lang = l;
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, dict: dictionaries[locale] ?? dictionaries[defaultLocale] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Access the active locale and dictionary inside client components. */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Outside the provider — fall back to defaults so SSR and unit tests work.
    return { locale: defaultLocale, setLocale: () => {}, dict: dictionaries[defaultLocale] };
  }
  return ctx;
}