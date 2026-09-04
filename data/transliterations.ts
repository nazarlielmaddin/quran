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
 *  - "simple": Azerbaijani alphabet (ə, ş, ğ, x, etc.) — converted from raw via toAzerbaijani().
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

/** Azerbaijani transliteration — converts English-based simple transliteration to Azerbaijani alphabet (ə, ş, ğ, x, etc.) */
export function toAzerbaijani(text: string): string {
  let t = text;

  // 1. Word-level fixes FIRST (before general clusters, so "Rahmaan" is caught before "aa" -> "â")
  const wordFixes: Array<[RegExp, string]> = [
    [/\bRahmaan/g, "Rəhmân"],
    [/\bRahman/g, "Rəhman"],
    [/\brahmaan/g, "rəhmân"],
    [/\bRaheem/g, "Rəhîm"],
    [/\bRahem/g, "Rəhim"],
    [/\braheem/g, "rəhîm"],
    [/\bRabb/g, "Rəbb"],
    [/\brabb/g, "rəbb"],
    [/\bAlhamdu/g, "Əlhəmdu"],
    [/\balhamdu/g, "əlhəmdu"],
    [/\bAalameen/g, "Aləmîn"],
    [/\baalameen/g, "aləmîn"],
    [/\bDeen/g, "Dîn"],
    [/\bSiraat/g, "Sirât"],
    [/\bsiraat/g, "sirât"],
    [/\bMustaqeem/g, "Mustəqîm"],
    [/\bmustaqeem/g, "mustəqîm"],
    [/\bMaghdoobi/g, "Məğzûbi"],
    [/\bmaghdoobi/g, "məğzûbi"],
    [/\bDaaalleen/g, "Dâllîn"],
    [/\bdaaalleen/g, "dâllîn"],
    [/\bQur-aan/g, "Qur-ân"],
    [/\bqur-aan/g, "qur-ân"],
    [/\bHakeem/g, "Həkîm"],
    [/\bhakeem/g, "həkîm"],
    [/\bMuzzammil/g, "Müzzəmmil"],
    [/\bmuzzammil/g, "müzzəmmil"],
    [/\bAyyuhal/g, "Əyyuhəl"],
    [/\bayyuhal/g, "əyyuhəl"],
    [/\bYaw\b/g, "Ya"],
    [/\byaw\b/g, "ya"],
    // More common Quranic terms with ayn (ə) instead of a
    [/\bMaal/g, "Məal"],
    [/\bmaal/g, "məal"],
    [/\bFalaq/g, "Fələq"],
    [/\bfalaq/g, "fələq"],
    [/\bNas\b/g, "Nəs"],
    [/\bnas\b/g, "nəs"],
    [/\bAalim/g, "Alim"],
    [/\baalim/g, "alim"],
    [/\bAalimin/g, "Alimin"],
    [/\baalimin/g, "alimin"],
    [/\bMalik/g, "Malik"],
    [/\bmalik/g, "malik"],
    [/\bMaliki/g, "Maliki"],
    [/\bmaliki/g, "maliki"],
    [/\bTaw\b/g, "Tov"],
    [/\btaw\b/g, "tov"],
    [/\bLaw\b/g, "Lo"],
    [/\blaw\b/g, "lo"],
    [/\bAman\b/g, "Əman"],
    [/\baman\b/g, "əman"],
    [/\bAmani/g, "Əmani"],
    [/\bamani/g, "əmani"],
    [/\bSaadiq/g, "Sadiq"],
    [/\bsaadiq/g, "sadiq"],
    [/\bSadiqin/g, "Sadiqin"],
    [/\bsadiqin/g, "sadiqin"],
    [/\bKaafir/g, "Kafir"],
    [/\bkaafir/g, "kafir"],
    [/\bKaafirun/g, "Kafirun"],
    [/\bkaafirun/g, "kafirun"],
    [/\bMufsid/g, "Müfsid"],
    [/\bmufsid/g, "müfsid"],
    [/\bMufsidoon/g, "Müfsidun"],
    [/\bmufsidoon/g, "müfsidun"],
    [/\bMuta/g, "Müta"],
    [/\bmuta/g, "müta"],
    [/\bMutaa/g, "Müta"],
    [/\bmutaa/g, "müta"],
    [/\bSaaghar/g, "Səqər"],
    [/\bsaaghar/g, "səqər"],
    [/\bWaswas/g, "Vəsvəs"],
    [/\bwaswas/g, "vəsvəs"],
    [/\bWaswasa/g, "Vəsvəsə"],
    [/\bwaswasa/g, "vəsvəsə"],
    [/\bAasif/g, "Əsif"],
    [/\baasif/g, "əsif"],
    [/\bAasifa/g, "Əsifə"],
    [/\baasifa/g, "əsifə"],
    [/\bAakif/g, "Əkif"],
    [/\baakif/g, "əkif"],
    [/\bAakifin/g, "Əkifin"],
    [/\baakifin/g, "əkifin"],
    // Ali-İmran 3:4 qızıl standartı — necə oxunursa elə (ə/a fərqi)
    [/\bAayaatil laahi\b/g, "Əyətilləhi"],
    [/\baayaatil laahi\b/g, "əyətilləhi"],
    [/\bWa\b/g, "Və"],
    [/\bwa\b/g, "və"],
    [/naasi/g, "nəsi"],
    [/Naasi/g, "Nəsi"],
    [/\banzalal/g, "ənzələl"],
    [/\bAnzalal/g, "Ənzələl"],
    [/\binnallazeena\b/g, "innəlləzînə"],
    [/\bInnallazeena\b/g, "Innəlləzînə"],
    [/allazeena\b/g, "əlləzînə"],
    [/Allazeena\b/g, "Əlləzînə"],
    [/kafaroo/g, "kəfərû"],
    [/Kafaroo/g, "Kəfərû"],
    [/\bhudal\b/g, "hudəl"],
    [/\bHudal\b/g, "Hudəl"],
    [/lahum/g, "ləhum"],
    [/Lahum/g, "Ləhum"],
    [/shadeed/g, "şədîd"],
    [/Shadeed/g, "Şədîd"],
    [/laahi/g, "ləhi"],
    [/Laahi/g, "Ləhi"],
    [/Aayaa/g, "Əyə"],
    [/aayaa/g, "əyə"],
    [/\binna/g, "innə"],
    [/\bInna/g, "Innə"],
    [/\banna/g, "ənnə"],
    [/\bAnna/g, "Ənnə"],
    // Regresiya yoxlamasından (Fatihə, İxlas, Fələq, Nas, Bəqərə) çıxan əlavələr
    [/ahad/g, "əhəd"],
    [/Ahad/g, "Əhəd"],
    [/naas\b/g, "nəs"],
    [/Naas\b/g, "Nəs"],
    [/rabb/g, "rəbb"],
    [/Rabb/g, "Rəbb"],
    [/\ba'/g, "ə"],
    [/\bA'/g, "Ə"],
    [/Laaam/g, "Lâm"],
    [/laaam/g, "lâm"],
    [/Meeem/g, "Mîm"],
    [/meeem/g, "mîm"],
    [/taq/g, "təq"],
    [/Taq/g, "Təq"],
  ];
  for (const [re, rep] of wordFixes) {
    t = t.replace(re, rep);
  }

  // 2. Multi-letter clusters (longest first)
  t = t.replace(/sh/g, "ş");
  t = t.replace(/Sh/g, "Ş");
  t = t.replace(/SH/g, "Ş");
  t = t.replace(/gh/g, "ğ");
  t = t.replace(/Gh/g, "Ğ");
  t = t.replace(/GH/g, "Ğ");
  t = t.replace(/kh/g, "x");
  t = t.replace(/Kh/g, "X");
  t = t.replace(/KH/g, "X");
  t = t.replace(/th/g, "s");
  t = t.replace(/Th/g, "S");
  t = t.replace(/TH/g, "S");
  t = t.replace(/dh/g, "z");
  t = t.replace(/Dh/g, "Z");
  t = t.replace(/DH/g, "Z");
  // Long vowels - keep circumflex to indicate elongation (â, î, û)
  t = t.replace(/aa/g, "â");
  t = t.replace(/AA/g, "Â");
  t = t.replace(/ee/g, "î");
  t = t.replace(/EE/g, "Î");
  t = t.replace(/ii/g, "î");
  t = t.replace(/II/g, "Î");
  t = t.replace(/oo/g, "û");
  t = t.replace(/OO/g, "Û");
  t = t.replace(/uu/g, "û");
  t = t.replace(/UU/g, "Û");

  // 3. Definite article Al- -> Əl- (word boundary)
  t = t.replace(/\bAl-/g, "Əl-");
  t = t.replace(/\bAL-/g, "ƏL-");
  t = t.replace(/\bAl /g, "Əl ");
  t = t.replace(/\bal /g, "əl ");

  // 4. General a -> ə in specific contexts (conservative, only where obvious)
  // a before double consonant often is ə in Azerbaijani: muzzammil -> muzzəmmil
  // This is handled via the word fixes above for common cases; keep general a as is to avoid over-conversion

  // 5. Handle apostrophe for ayn/hamza -> ə (e.g., 'aalameen -> aləmin already handled, but general 'a -> ə)
  // Replace 'a at word start with ə (e.g., 'aalameen -> aləmin, but we already did)
  // General: ' -> ə when followed by vowel
  t = t.replace(/'a/g, "ə");
  t = t.replace(/'A/g, "Ə");
  t = t.replace(/'i/g, "i");
  t = t.replace(/'u/g, "u");
  // Remaining standalone ' (for ayn) -> ə
  // Keep ' as is if not followed by vowel to avoid breaking

  // 6. w -> v (Azerbaijani uses v, not w)
  t = t.replace(/w/g, "v");
  t = t.replace(/W/g, "V");

  return t;
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
  if (style === "simple") return raw.map(toAzerbaijani);
  const curated = CURATED_ACCURATE[String(surahId)];
  if (curated) return curated;
  return raw.map(upgradeToAccurate);
}
