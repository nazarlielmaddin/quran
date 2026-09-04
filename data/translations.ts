/**
 * Azerbaijani translation layer (Məmmədəliyev & Bünyadov).
 *
 * Raw data: alquran.cloud `az.mammadaliyev` (all 6236 verses, 1:1 aligned
 * with the transliteration layer),
 * bundled at build time into `public/data/translations-az.json` and fetched
 * lazily at runtime (keeps the JS bundle lean).
 *
 * Mirrors the Arabic layer: base-path aware, cached, force-cache.
 */

let cache: Record<string, string[]> | null = null;

export async function loadTranslations(): Promise<Record<string, string[]>> {
  if (cache) return cache;
  // Base-path aware: works on localhost and under GitHub Pages subpaths.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const res = await fetch(`${base}/data/translations-az.json`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`translations-az HTTP ${res.status}`);
  cache = (await res.json()) as Record<string, string[]>;
  return cache;
}

export async function getTranslationVerses(surahId: number): Promise<string[] | null> {
  const all = await loadTranslations();
  const verses = all[String(surahId)];
  if (!verses) return null;
  return verses;
}
