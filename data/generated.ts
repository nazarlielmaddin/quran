import surahsJson from "@/data/generated/surahs";
import recitationsJson from "@/data/generated/recitations";
import timingsJson from "@/data/generated/timings";
import type { Recitation, Surah } from "@/lib/types";

export const surahs = surahsJson as unknown as Surah[];
export const recitations = recitationsJson as unknown as Recitation[];
/** Nested timings: reciterId → surahId → verse offsets (ms) — per-reciter QDC verified */
export const timingsByReciter = timingsJson as unknown as Record<string, Record<string, number[]>>;
/** @deprecated — legacy flat access; use timingsByReciter[reciterId][surahId] */
export const timingsBySurah = (timingsByReciter["yasir-al-dawsari"] ?? {}) as Record<string, number[]>;

export function getSurah(id: number): Surah | undefined {
  return surahs.find((s) => s.number === id);
}

export function getRecitation(reciterId: string, surahId: number): Recitation | undefined {
  return recitations.find((r) => r.reciterId === reciterId && r.surahId === surahId);
}

/** Verse start offsets (ms) for a reciter+surah — null when unavailable. */
export function getTimings(reciterId: string, surahId: number): number[] | null {
  if (!recitersWithTimings.has(reciterId)) return null;
  return timingsByReciter[reciterId]?.[String(surahId)] ?? null;
}

/** Reciters that ship verified verse-level timestamps. */
export const recitersWithTimings = new Set(["yasir-al-dawsari", "maher-al-muaiqly"]);
