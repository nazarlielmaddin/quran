import type { RepeatMode, TransliterationStyle } from "@/lib/types";
import { reciters } from "@/data/reciters";

/** Versioned persistence — bump when the saved shape changes. */
const KEY = "saadat:prefs:v1";

const VALID_RECITER_IDS = new Set(reciters.map((r) => r.id));

export interface PersistedPrefs {
  reciterId: string;
  surahId: number;
  soundId: string | null;
  quranVolume: number;
  ambientVolume: number;
  quranEnabled: boolean;
  ambientEnabled: boolean;
  repeat: RepeatMode;
  autoNext: boolean;
  positionSeconds: number;
  showRecitation: boolean;
  transliterationStyle: TransliterationStyle;
  ambientMuted: boolean;
  ambientLoop: boolean;
}

export const DEFAULT_PREFS: PersistedPrefs = {
  reciterId: "yasir-al-dawsari",
  surahId: 1,
  soundId: null,
  quranVolume: 0.85,
  ambientVolume: 0.25,
  quranEnabled: true,
  ambientEnabled: false,
  repeat: "off",
  autoNext: true,
  positionSeconds: 0,
  showRecitation: true,
  transliterationStyle: "accurate",
  ambientMuted: false,
  ambientLoop: true,
};

export function loadPrefs(): PersistedPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<PersistedPrefs>;
    const merged: PersistedPrefs = { ...DEFAULT_PREFS, ...parsed };
    // Guard: if stored reciter was removed/renamed, fall back to default (yasir)
    if (typeof merged.reciterId !== "string" || !VALID_RECITER_IDS.has(merged.reciterId)) {
      merged.reciterId = DEFAULT_PREFS.reciterId;
    }
    // Clamp surahId into valid 1..114 range
    if (typeof merged.surahId !== "number" || merged.surahId < 1 || merged.surahId > 114) {
      merged.surahId = DEFAULT_PREFS.surahId;
    }
    return merged;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: PersistedPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* storage full / private mode — ignore */
  }
}
