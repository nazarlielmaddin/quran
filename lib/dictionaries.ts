/**
 * Lightweight i18n layer.
 * UI strings live here — the dictionary shape makes it trivial to add new
 * locales without touching components.
 *
 * `en` is the canonical/authoritative dictionary. Other locales mirror its
 * shape and fall back to `en` when a key is missing.
 */
export const locales = ["en", "az", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

const en = {
  brand: "Quran Sanctuary",
  brandSub: "Qur'an Sanctuary",
  nav: { reciters: "Reciters", surahs: "Surahs", atmosphere: "Atmosphere", nowPlaying: "Now Playing" },
  hero: {
    titleA: "Qur'an",
    titleB: "Peace and Focus",
    subtitle: "Choose your reciter, select your atmosphere, and listen in peace.",
    cta: "Start Listening",
    secondary: "Explore Surahs",
    anfalAyah:
      "The true believers are only those whose hearts tremble at the remembrance of Allah, whose faith increases when His revelations are recited to them, and who put their trust in their Lord.",
    anfalCite: "Surah Al-Anfal, 8:2",
    scroll: "Scroll",
  },
  reciters: {
    title: "Choose your reciter",
    subtitle: "Ten master voices. Echoing from the Haramayn to your heart.",
    subtitleCount: "{count} master voices — tap to select, press play to listen",
    listen: "Listen",
    select: "Choose reciter",
  },
  surahs: {
    title: "Choose a surah",
    subtitle: "Search by name or number — in English, transliteration, or Azerbaijani.",
    searchPlaceholder: "Search surahs… e.g. Ar-Rahman, Yasin, 67",
    ayahs: "Ayahs",
    duration: "Duration",
    play: "Play",
    noneFound: "No surahs match your search.",
    clear: "Clear",
    meccan: "Meccan",
    medinan: "Medinan",
  },
  atmosphere: {
    title: "Choose your atmosphere",
    subtitle: "An ambient layer that stays independent from the recitation.",
    nature: "Nature",
    cozy: "Cozy",
    focus: "Focus",
    on: "Ambient on",
    off: "Ambient off",
    preview: "Play sound",
  },
  recitation: {
    title: "Recitation",
    verse: "Verse",
    show: "Show recitation",
    hide: "Hide recitation",
    loading: "Loading transliteration…",
    unavailable: "Transliteration is unavailable for this surah.",
    translationLoading: "Loading translation…",
    translationUnavailable: "Translation is unavailable for this surah.",
    synced: "Synchronized with recitation",
    tapVerse: "Tap a verse to jump",
    bismillahHint: "Bismillah — click to play from start",
    displayModes: {
      transliteration: "Transliteration",
      arabic: "العربية",
      both: "Both",
    },
    styles: {
      accurate: "Accurate",
      simple: "Simple",
    },
  },
  player: {
    quran: "Qur'an",
    ambient: "Ambience",
    on: "On",
    off: "Off",
    play: "Play",
    pause: "Pause",
    previous: "Previous surah",
    next: "Next surah",
    quranVolume: "Qur'an volume",
    ambientVolume: "Ambient volume",
    repeat: "Repeat",
    autoNext: "Auto-next",
    resume: "Resume listening",
    loading: "Loading…",
    none: "None",
    seek: "Seek",
    loopAmbient: "Loop ambient",
    dismiss: "Dismiss",
  },
  repeats: {
    off: "Off",
    one: "One",
    all: "All",
  },
  repeatStatus: {
    off: "Repeat off",
    one: "Repeat current surah",
    all: "Repeat all surahs",
  },
  settings: { title: "Settings" },
  errors: {
    audio: "Unable to load this recitation. Please try again or choose another source.",
    ambient: "Unable to load this ambient sound. Please choose another.",
    video: "Background video unavailable — atmosphere still plays.",
  },
  footer: {
    madeWith: "Crafted for peaceful listening",
    tagline: "Qur'an. Peace. Focus.",
  },
  developedBy: "Developed by",
};

export type TranslationKey = keyof typeof en;

/* ─────────────────────────  AZERBAIJANI  ───────────────────────── */
const az: typeof en = {
  brand: "Quran ziyarətgahı",
  brandSub: "Quran ziyarətgahı",
  nav: {
    reciters: "Qiraətçilər",
    surahs: "Surələr",
    atmosphere: "Atmosfer",
    nowPlaying: "İndi Oynadılır",
  },
  hero: {
    titleA: "Quran",
    titleB: "Hüzur və Diqqət",
    subtitle:
      "Öz oxucunuzu seçin, atmosferinizi seçin və rahatlıqla qulaq asın.",
    cta: "Dinləməyə Başlayın",
    secondary: "Surələri araşdırın",
    anfalAyah:
      "Həqiqi möminlər yalnız Allahı zikr etməklə qəlbləri titrəyən, ayələri onlara oxunduqda imanları artan və yalnız Rəbbinə təvəkkül edənlərdir.",
    anfalCite: "Ənfal surəsi, 8:2",
    scroll: "Sürüşdürün",
  },
  reciters: {
    title: "Öz oxucunuzu seçin",
    subtitle: "On usta səs — Hərameyn'dən qəlbinizə qədər.",
    subtitleCount: "{count} usta səs — seçmək üçün toxunun, dinləmək üçün oxut düyməsini basın",
    listen: "Dinlə",
    select: "Oxucu seç",
  },
  surahs: {
    title: "Bir surə seçin",
    subtitle:
      "Ad və ya nömrə ilə axtarış — ingilis, transliterasiya və ya azərbaycan dilində.",
    searchPlaceholder: "Surələri axtarın... məsələn, Rəhman, Yasin, 67",
    ayahs: "ayə",
    duration: "Müddət",
    play: "Oynat",
    noneFound: "Axtarışınıza uyğun surə tapılmadı.",
    clear: "Təmizlə",
    meccan: "Məkkə",
    medinan: "Mədinə",
  },
  atmosphere: {
    title: "Atmosferinizi seçin",
    subtitle:
      "Oxumadan müstəqil qalan mühit təbəqəsi.",
    nature: "Təbiət",
    cozy: "Rahat",
    focus: "Diqqət",
    on: "Atmosfer açıq",
    off: "Atmosfer bağlı",
    preview: "Səsi oynat",
  },
  recitation: {
    title: "Oxunuş",
    verse: "Ayə",
    show: "Oxunuşu göstər",
    hide: "Oxunuşu gizlət",
    loading: "Transliterasiya yüklənir…",
    unavailable: "Bu surə üçün transliterasiya mövcud deyil.",
    translationLoading: "Tərcümə yüklənir…",
    translationUnavailable: "Bu surə üçün tərcümə mövcud deyil.",
    synced: "Oxunuşla sinxronlaşdırılıb",
    tapVerse: "Ayəyə keçmək üçün toxunun",
    bismillahHint: "Bismillah — başdan oynatmaq üçün klikləyin",
    displayModes: {
      transliteration: "Transliterasiya",
      arabic: "العربية",
      both: "Hər ikisi",
    },
    styles: {
      accurate: "Dəqiq",
      simple: "Sadə",
    },
  },
  player: {
    quran: "Quran",
    ambient: "Ab-hava",
    on: "Açıq",
    off: "Bağlı",
    play: "Oynat",
    pause: "Dayandır",
    previous: "Əvvəlki surə",
    next: "Növbəti surə",
    quranVolume: "Quran səsi",
    ambientVolume: "Ab-hava səsi",
    repeat: "Təkrarla",
    autoNext: "Avto-davam",
    resume: "Dinləməyə davam et",
    loading: "Yüklənir…",
    none: "Heç biri",
    seek: "Yer dəyiş",
    loopAmbient: "Ab-havanı təkrarla",
    dismiss: "Bağla",
  },
  repeats: {
    off: "Bağlı",
    one: "Bir",
    all: "Hamısı",
  },
  repeatStatus: {
    off: "Təkrarlama bağlıdır",
    one: "Cari surəni təkrarla",
    all: "Bütün surələri təkrarla",
  },
  settings: { title: "Parametrlər" },
  errors: {
    audio:
      "Bu oxunuşu yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin və ya başqa mənbə seçin.",
    ambient:
      "Bu mühit səsini yükləmək mümkün olmadı. Zəhmət olmasa başqasını seçin.",
    video: "Arxa fon videosu əlçatmazdır — atmosfer hələ də oynadılır.",
  },
  footer: {
    madeWith: "Hüzur içində dinləmə üçün hazırlanıb",
    tagline: "Quran. Hüzur. Diqqət.",
  },
  developedBy: "Hazırlayan",
};

const tr: typeof en = en; // Placeholder — to be filled later
const ar: typeof en = en; // Placeholder — to be filled later

export const dictionaries: Record<Locale, typeof en> = { en, az, tr, ar };

/** Resolve a dotted key path against a flat-or-nested object. */
function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (acc && typeof acc === "object" && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
}

/**
 * Translate a dotted key. Falls back to English when the active locale is
 * missing the key — this guarantees a usable UI even mid-translation.
 *
 * Supports `{var}` interpolation from the optional `vars` map.
 */
export function t(key: string, locale: Locale = defaultLocale, vars?: Record<string, string | number>): string {
  const active = getPath(dictionaries[locale] as Record<string, unknown>, key);
  const fallback = getPath(dictionaries[defaultLocale] as Record<string, unknown>, key);
  const raw = (active ?? fallback ?? key) as string;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    return v == null ? `{${k}}` : String(v);
  });
}

/** Active dictionary for the given locale (defaults to English for back-compat). */
export function dictFor(locale: Locale = defaultLocale): typeof en {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Back-compat export — components currently import `dict` directly. */
export const dict = dictionaries[defaultLocale];
