/** Small shared helpers. */
import type { Locale } from "@/lib/dictionaries";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** 65 → "01:05" · 3725 → "1:02:05" */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return h > 0 ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}

/** Clamp a number into [min, max]. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Smooth volume ramp (used for ambient cross-fades). Resolves when done. */
export function rampVolume(el: HTMLAudioElement, target: number, durationMs = 700): Promise<void> {
  return new Promise((resolve) => {
    const start = el.volume;
    const startTime = performance.now();
    if (!Number.isFinite(start)) return resolve();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.volume = start + (target - start) * eased;
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

/** Determine the active verse index for a given time (binary search over ms offsets). */
export function activeVerseIndex(timings: number[], timeSeconds: number): number {
  if (!timings || timings.length === 0) return 0;
  const ms = timeSeconds * 1000;
  if (ms < timings[0]) return 0;
  if (ms >= timings[timings.length - 1]) return timings.length - 1;
  let lo = 0;
  let hi = timings.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (timings[mid] <= ms) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Resolve a localized string field from an object that has an `XAz` companion
 * property. Falls back to the canonical (English) field when the localized one
 * is missing or the locale is not Azerbaijani.
 *
 *   getLocalized({ name: "Foo", nameAz: "Bar" }, "name", "az") → "Bar"
 *   getLocalized({ name: "Foo", nameAz: "Bar" }, "name", "en") → "Foo"
 */
export function getLocalized<T extends object>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  if (locale === "az") {
    const az = (obj as Record<string, unknown>)[`${field}Az`];
    if (typeof az === "string" && az.length > 0) return az;
  }
  const v = (obj as Record<string, unknown>)[field];
  return typeof v === "string" ? v : "";
}
