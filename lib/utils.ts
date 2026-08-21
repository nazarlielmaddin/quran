/** Small shared helpers. */

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

/** Determine the active verse index for a given time (binary search over ms offsets).
 *  NOTE: timings[0] is the start of verse 2 — the time before it (0..timings[0]) belongs to verse 1.
 *  So verse 1 = [0, timings[0]), verse 2 = [timings[0], timings[1]), etc.
 */
export function activeVerseIndex(timings: number[], timeSeconds: number): number {
  const ms = timeSeconds * 1000;
  // 1st ayah has no timestamp — time before 2nd ayah's start belongs to verse 1
  // So timings[0] = start of verse 2, [0, timings[0]) = verse 1, [timings[0], timings[1]) = verse 2, etc.
  if (ms < timings[0]) return 0;
  if (ms >= timings[timings.length - 1]) return timings.length - 1;
  let lo = 0;
  let hi = timings.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (timings[mid] <= ms) lo = mid;
    else hi = mid - 1;
  }
  return Math.min(lo + 1, timings.length - 1);
}
