import type { TransliterationStyle } from "@/lib/types";

/**
 * Transliteration layer.
 *
 * Raw data: alquran.cloud `en.transliteration` (simple Latin, all 6236 verses),
 * bundled at build time into `public/data/transliterations.json` and fetched
 * lazily at runtime (keeps the JS bundle lean).
 *
 * Two styles:
 *  - "accurate" (default): rule-based upgrade (long vowels ā/ī/ū + ʿayn) with
 *    hand-curated, fully diacritized overrides for the daily surahs
 *    (Al-Fātiḥah, Al-Ikhlāṣ, Al-Falaq, An-Nās) written in the standard
 *    transliteration system (ḥ ṣ ḍ ṭ ẓ ʿ …).
 *  - "simple": the raw dataset as-is.
 *
 * Replace/improve the datasets here without touching any component.
 */

export const ACCURATE_STYLE: TransliterationStyle = "accurate";
export const SIMPLE_STYLE: TransliterationStyle = "simple";

let cache: Record<string, string[]> | null = null;

export async function loadTransliterations(): Promise<Record<string, string[]>> {
  if (cache) return cache;
  // Base-path aware: works on localhost and under GitHub Pages subpaths.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const res = await fetch(`${base}/data/transliterations.json`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`transliterations HTTP ${res.status}`);
  cache = (await res.json()) as Record<string, string[]>;
  return cache;
}

/** Rule-based upgrade: long vowels + ʿayn (safe, deterministic). */
export function upgradeToAccurate(text: string): string {
  return text
    .replace(/'/g, "ʿ")
    .replace(/aa/g, "ā")
    .replace(/ee/g, "ī")
    .replace(/oo/g, "ū");
}

/** Hand-curated accurate transliteration — the daily surahs (guaranteed correct). */
export const CURATED_ACCURATE: Record<string, string[]> = {
  "1": [
    "Bismillāhir-Raḥmānir-Raḥīm",
    "Al-ḥamdu lillāhi rabbil-ʿālamīn",
    "Ar-Raḥmānir-Raḥīm",
    "Māliki yawmi d-dīn",
    "Iyyāka naʿbudu wa iyyāka nastaʿīn",
    "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    "Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa lā ḍ-ḍāllīn",
  ],
  "112": [
    "Qul huwa llāhu aḥad",
    "Allāhu ṣ-ṣamad",
    "Lam yalid wa lam yūlad",
    "Wa lam yakun lahū kufuwan aḥad",
  ],
  "113": [
    "Qul aʿūdhu birabbil-falaq",
    "Min sharri mā khalaq",
    "Wa min sharri ghāsiqin idhā waqab",
    "Wa min sharrin-naffāthāti fil-ʿuqad",
    "Wa min sharri ḥāsidin idhā ḥasad",
  ],
  "114": [
    "Qul aʿūdhu birabbin-nās",
    "Malikin-nās",
    "Ilāhin-nās",
    "Min sharril-waswāsil-khannās",
    "Alladhī yuwaswisu fī ṣudūrin-nās",
    "Minal-jinnati wan-nās",
  ],
};

export async function getVerses(
  surahId: number,
  style: TransliterationStyle = "accurate",
): Promise<string[] | null> {
  const all = await loadTransliterations();
  const raw = all[String(surahId)];
  if (!raw) return null;
  if (style === "simple") return raw;
  const curated = CURATED_ACCURATE[String(surahId)];
  if (curated) return curated;
  return raw.map(upgradeToAccurate);
}
