/**
 * Quran Sanctuary — Data generator
 * Fetches surah metadata + Latin transliteration from alquran.cloud,
 * merges hand-curated Azerbaijani names, loads QUL per-ayah segments plus the
 * QDC alignment timings, and generates the full catalog for 10 reciters.
 *
 * Run: node scripts/fetch-data.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GEN = join(ROOT, "data", "generated");
mkdirSync(GEN, { recursive: true });

const log = (m) => console.log(`[fetch-data] ${m}`);

/** Central reciter catalog — single source of truth for audio + timings + attribution
 *
 * Audio strategy (verified 2026-10-19):
 *  - Eight reciters stream from Tarteel's QUL CDN (`audio-cdn.tarteel.ai`).
 *    QUL publishes per-ayah `time_from`/`time_to` segments for exactly these
 *    files, so verse highlighting is sample-accurate — no duration scaling.
 *  - Badr Al-Turki and Haitham Al-Dakhin are not in QUL and stay on
 *    mp3quran.net. Badr's timings come from the QDC forced-alignment dataset.
 *  - `data/audioFallbacks.ts` keeps a second mirror per reciter so a blocked
 *    CDN degrades gracefully instead of showing the "Unable to load" banner.
 *
 * The old QuranicAudio/BunnyCDN host (`download.quranicaudio.com`) resets TLS
 * on some networks; it is no longer a primary source.
 */
const CATALOG = [
  {
    id: "yasir-al-dawsari",
    qdcId: 97,
    qulId: 174,
    provider: "qul",
    folder: "yasserAlDosari/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Yasir Al-Dawsari (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/yasserAlDosari/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "haitham-al-dakhin",
    qdcId: null,
    provider: "mp3quran",
    folder: "haitham-dukhain/r1",
    timingSource: null,
    sourceLabel: "mp3quran.net — Haitham Al-Dakhin (Rewayat Hafs 'an 'Asim, no timings); legacy QDC mirror fallback",
    audioUrl: (n) => `https://cdn.mp3quran.net/audio/haitham-dukhain/r1/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "mishary-rashid-alafasy",
    qdcId: 7,
    qulId: 7,
    provider: "qul",
    folder: "alafasy/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Mishary Rashid Alafasy (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/alafasy/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "abdul-basit-murattal",
    qdcId: 2,
    qulId: 2,
    provider: "qul",
    folder: "abdulBasit/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Abdul Basit Murattal (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/abdulBasit/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "mahmoud-khalil-al-husary",
    qdcId: 6,
    qulId: 6,
    provider: "qul",
    folder: "husary/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Mahmoud Khalil Al-Husary (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/husary/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "badr-al-turki",
    qdcId: null,
    provider: "mp3quran",
    folder: "badr-turki/r1",
    timingSource: "alignment",
    sourceLabel: "mp3quran.net — Badr Al-Turki (Rewayat Hafs 'an 'Asim, murattal); QDC alignment timings; mirror: quranicaudio.com",
    audioUrl: (n) => `https://cdn.mp3quran.net/audio/badr-turki/r1/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "abdur-rahman-as-sudais",
    qdcId: 3,
    qulId: 3,
    provider: "qul",
    folder: "abdulrahmanAlSudais/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Abdur-Rahman as-Sudais (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/abdulrahmanAlSudais/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "maher-al-muaiqly",
    qdcId: 65,
    qulId: 65,
    provider: "qul",
    folder: "maherAlMuaiqly/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Maher Al-Muaiqly (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/maherAlMuaiqly/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "saad-al-ghamdi",
    qdcId: 13,
    qulId: 13,
    provider: "qul",
    folder: "ghamadi/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Saad Al-Ghamdi (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/ghamadi/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "abu-bakr-al-shatri",
    qdcId: 4,
    qulId: 4,
    provider: "qul",
    folder: "abuBakrAlShatri/murattal",
    timingSource: "qul",
    sourceLabel: "Tarteel QUL — Abu Bakr Al-Shatri (Rewayat Hafs 'an 'Asim, murattal); mirror: mp3quran.net",
    audioUrl: (n) => `https://audio-cdn.tarteel.ai/quran/surah/abuBakrAlShatri/murattal/mp3/${String(n).padStart(3, "0")}.mp3`,
  },
];

/** Azerbaijani names (hand-curated, all 114) */
const AZ = {
  1: "Fatihə", 2: "Bəqərə", 3: "Ali-İmran", 4: "Nisa", 5: "Maidə", 6: "Ənam",
  7: "Əraf", 8: "Ənfal", 9: "Tövbə", 10: "Yunus", 11: "Hud", 12: "Yusif",
  13: "Rəd", 14: "İbrahim", 15: "Hicr", 16: "Nəhl", 17: "İsra", 18: "Kəhf",
  19: "Məryəm", 20: "Taha", 21: "Ənbiya", 22: "Həcc", 23: "Möminun", 24: "Nur",
  25: "Furqan", 26: "Şüəra", 27: "Nəml", 28: "Qəsəs", 29: "Ənkəbut", 30: "Rum",
  31: "Loğman", 32: "Səcdə", 33: "Əhzab", 34: "Səba", 35: "Fatir", 36: "Yasin",
  37: "Saffat", 38: "Sad", 39: "Zümər", 40: "Qafir", 41: "Fussilət", 42: "Şura",
  43: "Zuxruf", 44: "Duxan", 45: "Casiyə", 46: "Əhqaf", 47: "Muhəmməd", 48: "Fəth",
  49: "Hucurat", 50: "Qaf", 51: "Zariyat", 52: "Tur", 53: "Nəcm", 54: "Qəmər",
  55: "Rəhman", 56: "Vaqiə", 57: "Hədid", 58: "Mücadilə", 59: "Həşr", 60: "Mümtəhinə",
  61: "Səff", 62: "Cümə", 63: "Münafiqun", 64: "Təğabun", 65: "Talaq", 66: "Təhrim",
  67: "Mülk", 68: "Qələm", 69: "Haqqə", 70: "Məaric", 71: "Nuh", 72: "Cinn",
  73: "Muzzəmmil", 74: "Muddəssir", 75: "Qiyamə", 76: "İnsan", 77: "Mürsəlat", 78: "Nəbə",
  79: "Naziat", 80: "Abəsə", 81: "Təkvir", 82: "İnfitar", 83: "Mutəffifin", 84: "İnşiqaq",
  85: "Buruc", 86: "Tariq", 87: "Əla", 88: "Ğaşiyə", 89: "Fəcr", 90: "Bələd",
  91: "Şəms", 92: "Leyl", 93: "Züha", 94: "İnşirah", 95: "Tin", 96: "Ələq",
  97: "Qədr", 98: "Bəyyinə", 99: "Zilzal", 100: "Adiyat", 101: "Qariə", 102: "Təkasür",
  103: "Əsr", 104: "Hüməzə", 105: "Fil", 106: "Qureyş", 107: "Maun", 108: "Kövsər",
  109: "Kafirun", 110: "Nəsr", 111: "Məsəd", 112: "İxlas", 113: "Fələq", 114: "Nas",
};

/** Accurate transliterated names (diacritic standard) — hand-curated */
const TRANS = {
  1: "Al-Fātiḥah", 2: "Al-Baqarah", 3: "Āli ʿImrān", 4: "An-Nisāʾ", 5: "Al-Māʾidah",
  6: "Al-Anʿām", 7: "Al-Aʿrāf", 8: "Al-Anfāl", 9: "At-Tawbah", 10: "Yūnus",
  11: "Hūd", 12: "Yūsuf", 13: "Ar-Raʿd", 14: "Ibrāhīm", 15: "Al-Ḥijr",
  16: "An-Naḥl", 17: "Al-Isrāʾ", 18: "Al-Kahf", 19: "Maryam", 20: "Ṭā Hā",
  21: "Al-Anbiyāʾ", 22: "Al-Ḥajj", 23: "Al-Muʾminūn", 24: "An-Nūr", 25: "Al-Furqān",
  26: "Ash-Shuʿarāʾ", 27: "An-Naml", 28: "Al-Qaṣaṣ", 29: "Al-ʿAnkabūt", 30: "Ar-Rūm",
  31: "Luqmān", 32: "As-Sajdah", 33: "Al-Aḥzāb", 34: "Sabaʾ", 35: "Fāṭir",
  36: "Yā Sīn", 37: "Aṣ-Ṣāffāt", 38: "Ṣād", 39: "Az-Zumar", 40: "Ghāfir",
  41: "Fuṣṣilat", 42: "Ash-Shūrā", 43: "Az-Zukhruf", 44: "Ad-Dukhān", 45: "Al-Jāthiyah",
  46: "Al-Aḥqāf", 47: "Muḥammad", 48: "Al-Fatḥ", 49: "Al-Ḥujurāt", 50: "Qāf",
  51: "Adh-Dhāriyāt", 52: "Aṭ-Ṭūr", 53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Raḥmān",
  56: "Al-Wāqiʿah", 57: "Al-Ḥadīd", 58: "Al-Mujādilah", 59: "Al-Ḥashr", 60: "Al-Mumtaḥanah",
  61: "Aṣ-Ṣaff", 62: "Al-Jumuʿah", 63: "Al-Munāfiqūn", 64: "At-Taghābun", 65: "Aṭ-Ṭalāq",
  66: "At-Taḥrīm", 67: "Al-Mulk", 68: "Al-Qalam", 69: "Al-Ḥāqqah", 70: "Al-Maʿārij",
  71: "Nūḥ", 72: "Al-Jinn", 73: "Al-Muzzammil", 74: "Al-Muddaththir", 75: "Al-Qiyāmah",
  76: "Al-Insān", 77: "Al-Mursalāt", 78: "An-Nabaʾ", 79: "An-Nāziʿāt", 80: "ʿAbasa",
  81: "At-Takwīr", 82: "Al-Infiṭār", 83: "Al-Muṭaffifīn", 84: "Al-Inshiqāq", 85: "Al-Burūj",
  86: "Aṭ-Ṭāriq", 87: "Al-Aʿlā", 88: "Al-Ghāshiyah", 89: "Al-Fajr", 90: "Al-Balad",
  91: "Ash-Shams", 92: "Al-Layl", 93: "Aḍ-Ḍuḥā", 94: "Ash-Sharḥ", 95: "At-Tīn",
  96: "Al-ʿAlaq", 97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-ʿĀdiyāt",
  101: "Al-Qāriʿah", 102: "At-Takāthur", 103: "Al-ʿAṣr", 104: "Al-Humazah", 105: "Al-Fīl",
  106: "Quraysh", 107: "Al-Māʿūn", 108: "Al-Kawthar", 109: "Al-Kāfirūn", 110: "An-Naṣr",
  111: "Al-Masad", 112: "Al-Ikhlāṣ", 113: "Al-Falaq", 114: "An-Nās",
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

const writeTs = (name, value) =>
  writeFileSync(join(GEN, `${name}.ts`), `// Generated by scripts/fetch-data.mjs — do not edit by hand.\nexport default ${JSON.stringify(value)} as const;\n`);

/* 1 ── Surah metadata (alquran.cloud) */
log("Fetching surah metadata…");
let surahs;
try {
  const surahMeta = await fetchJson("https://api.alquran.cloud/v1/surah");
  surahs = surahMeta.data.map((s) => ({
    id: s.number,
    number: s.number,
    arabicName: s.name,
    englishName: s.englishName,
    transliteratedName: TRANS[s.number] ?? s.englishName,
    azerbaijaniName: AZ[s.number] ?? s.englishName,
    meaning: s.englishNameTranslation,
    verses: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
} catch (e) {
  log(`Surah metadata fetch failed: ${e.message} — falling back to local cache`);
  const fallbackPath = join(GEN, "surahs.ts");
  if (existsSync(fallbackPath)) {
    const raw = readFileSync(fallbackPath, "utf8").replace(/^.*export default /, "").replace(/ as const;.*$/s, "");
    surahs = JSON.parse(raw);
    log(`Loaded ${surahs.length} surahs from cache`);
  } else {
    throw e;
  }
}
writeTs("surahs", surahs);
log(`Surahs: ${surahs.length}`);

/* 2 ── Latin transliteration (alquran.cloud en.transliteration) */
log("Fetching transliteration (6236 verses)…");
try {
  const transRes = await fetchJson("https://api.alquran.cloud/v1/quran/en.transliteration");
  const perSurah = {};
  for (const s of transRes.data.surahs) {
    const key = String(s.number);
    perSurah[key] = s.ayahs.map((a) => (a.text ?? "").replace(/^\uFEFF/, ""));
  }
  writeFileSync(
    join(ROOT, "public", "data", "transliterations.json"),
    JSON.stringify(perSurah)
  );
  log(`Transliteration: ${Object.keys(perSurah).length} surahs covered`);
} catch (e) {
  log(`Transliteration fetch failed: ${e.message} — keeping existing file if present`);
  const transPath = join(ROOT, "public", "data", "transliterations.json");
  if (!existsSync(transPath)) throw e;
  log("Transliteration cache kept");
}

/* 2b ── Arabic (Uthmani, alquran.cloud quran-uthmani) */
log("Fetching Arabic Uthmani (6236 verses)…");
try {
  const arabicRes = await fetchJson("https://api.alquran.cloud/v1/quran/quran-uthmani");
  const perSurahAr = {};
  for (const s of arabicRes.data.surahs) {
    const key = String(s.number);
    perSurahAr[key] = s.ayahs.map((a) => (a.text ?? "").replace(/^\uFEFF/, ""));
  }
  writeFileSync(
    join(ROOT, "public", "data", "arabic.json"),
    JSON.stringify(perSurahAr)
  );
  log(`Arabic: ${Object.keys(perSurahAr).length} surahs covered`);
} catch (e) {
  log(`Arabic fetch failed: ${e.message} — writing fallback if missing`);
  const arabicPath = join(ROOT, "public", "data", "arabic.json");
  if (!existsSync(arabicPath)) {
    const fallback = {};
    for (const s of surahs) fallback[String(s.number)] = [];
    fallback["1"] = [
      "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "مَٰلِكِ يَوْمِ ٱلدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    ];
    writeFileSync(arabicPath, JSON.stringify(fallback));
    log("Arabic fallback written (surah 1 placeholder + empty others)");
  } else {
    log("Arabic fallback already exists — keeping it");
  }
}

/* 2c ── Azerbaijani translation (alquran.cloud az.mammadaliyev — Məmmədəliyev & Bünyadov) */
log("Fetching Azerbaijani translation (6236 verses)…");
try {
  const azRes = await fetchJson("https://api.alquran.cloud/v1/quran/az.mammadaliyev");
  const perSurahAz = {};
  for (const s of azRes.data.surahs) {
    const key = String(s.number);
    perSurahAz[key] = s.ayahs.map((a) => (a.text ?? "").replace(/^\uFEFF/, "").trim());
  }
  writeFileSync(
    join(ROOT, "public", "data", "translations-az.json"),
    JSON.stringify(perSurahAz)
  );
  log(`Azerbaijani translation: ${Object.keys(perSurahAz).length} surahs covered`);
} catch (e) {
  log(`Azerbaijani translation fetch failed: ${e.message} — keeping existing file if present`);
  const azPath = join(ROOT, "public", "data", "translations-az.json");
  if (!existsSync(azPath)) throw e;
  log("Azerbaijani translation cache kept");
}

/* 3 ── Verse timings — nested Record<reciterId, Record<surahId, number[]>> */
log("Parsing verse timings…");
let qdcTimings = {};
const dumpPath = join(ROOT, "scripts", "data", "qdc_timings.json");
if (existsSync(dumpPath)) {
  try {
    qdcTimings = JSON.parse(readFileSync(dumpPath, "utf8"));
    log(`Loaded QDC timings cache from ${dumpPath} (${Object.keys(qdcTimings).length} reciters)`);
  } catch (e) {
    log(`Failed to load QDC timings cache: ${e.message}`);
  }
}

/* QUL per-ayah segments for the Tarteel-hosted files. Structure:
 *   { [reciterId]: { [surahId]: { from: number[], duration: number } } }
 * These timestamps belong to the exact audio URL in CATALOG, so they are used
 * verbatim (no duration scaling). */
let qulTimings = {};
const qulPath = join(ROOT, "scripts", "data", "qul_timings.json");
if (existsSync(qulPath)) {
  try {
    qulTimings = JSON.parse(readFileSync(qulPath, "utf8"));
    log(`Loaded QUL timings from ${qulPath} (${Object.keys(qulTimings).length} reciters)`);
  } catch (e) {
    log(`Failed to load QUL timings cache: ${e.message}`);
  }
}

const nestedTimings = {};
const calculatedDurations = {}; // Record<reciterId, Record<surahId, number>>

for (const entry of CATALOG) {
  if (!entry.timingSource) continue;
  nestedTimings[entry.id] = {};
  calculatedDurations[entry.id] = {};

  if (entry.timingSource === "qul") {
    const reciterData = qulTimings[entry.id];
    if (reciterData) {
      for (let s = 1; s <= 114; s++) {
        const sKey = String(s);
        const item = reciterData[sKey];
        if (item && Array.isArray(item.from) && item.from.length > 0) {
          nestedTimings[entry.id][sKey] = item.from;
          if (typeof item.duration === "number") {
            calculatedDurations[entry.id][sKey] = item.duration;
          }
        }
      }
    }
    continue;
  }

  const reciterData = qdcTimings[entry.id];
  if (reciterData) {
    for (let s = 1; s <= 114; s++) {
      const sKey = String(s);
      const verseArray = reciterData[sKey];
      if (Array.isArray(verseArray) && verseArray.length > 0) {
        // Map each verse to its starting millisecond (vt.from)
        nestedTimings[entry.id][sKey] = verseArray.map((v) => v.from);
        const lastVerse = verseArray[verseArray.length - 1];
        if (lastVerse && typeof lastVerse.to === "number") {
          calculatedDurations[entry.id][sKey] = Math.round((lastVerse.to + 1000) / 1000);
        }
      }
    }
  }
}

writeTs("timings", nestedTimings);
log(`Timings: ${Object.keys(nestedTimings).length} reciters with verified timestamps`);

/* 4 ── Recitation catalog — 10 reciters × 114 surahs = 1140 entries */
log("Generating recitation catalog…");
const recitations = [];
for (const entry of CATALOG) {
  for (const s of surahs) {
    const n = String(s.number).padStart(3, "0");
    const num = s.number;
    let id;
    if (entry.id === "yasir-al-dawsari") id = `dawsari-${n}`;
    else if (entry.id === "haitham-al-dakhin") id = `aldakhin-${n}`;
    else id = `${entry.id}-${n}`;

    const duration = calculatedDurations[entry.id]?.[String(num)] ?? null;

    recitations.push({
      id,
      reciterId: entry.id,
      surahId: num,
      audioUrl: entry.audioUrl(num),
      durationSeconds: duration,
      source: entry.sourceLabel,
    });
  }
}
writeTs("recitations", recitations);
log(`Recitations: ${recitations.length} (${CATALOG.length} reciters × 114 surahs)`);

/* 5 ── Sources attribution — generate data/sources.ts from CATALOG */
log("Generating sources attribution…");
const sourcesLines = [];
sourcesLines.push(`import type { MediaSource } from "@/lib/types";`);
sourcesLines.push(``);
sourcesLines.push(`/**`);
sourcesLines.push(` * Attribution registry — every external media/data dependency is tracked here`);
sourcesLines.push(` * so sources are visible in config, not hidden in components.`);
sourcesLines.push(` * Generated by scripts/fetch-data.mjs — do not edit by hand (CATALOG-driven).`);
sourcesLines.push(` */`);
sourcesLines.push(`export const sources: MediaSource[] = [`);
for (const entry of CATALOG) {
  const label = `Qur'an audio — ${entry.sourceLabel}`;
  const url = entry.audioUrl(1);
  let license;
  if (entry.provider === "qul") {
    license = "Quranic Universal Library (QUL) / Tarteel — open recitation dataset; audio hosted on audio-cdn.tarteel.ai";
  } else if (entry.provider === "mp3quran") {
    license = "mp3quran.net official hosted mushaf";
  } else {
    license = "Quran.com / QuranicAudio — public distribution";
  }
  sourcesLines.push(`  {`);
  sourcesLines.push(`    label: ${JSON.stringify(label)},`);
  sourcesLines.push(`    url: ${JSON.stringify(url)},`);
  sourcesLines.push(`    license: ${JSON.stringify(license)},`);
  sourcesLines.push(`  },`);
}
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Surah metadata + Latin transliteration (6236 verses)",`);
sourcesLines.push(`    url: "https://api.alquran.cloud/v1/surah",`);
sourcesLines.push(`    license: "alquran.cloud (crowd-sourced; Qur'an text is public domain in most jurisdictions)",`);
sourcesLines.push(`  },`);
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Verse timings — QUL segments (8 reciters) + QDC alignment (Badr Al-Turki)",`);
sourcesLines.push(`    url: "https://qul.tarteel.ai",`);
sourcesLines.push(`    license: "QUL / Tarteel (open data) + Quran Foundation QDC API — high-precision per-ayah segments",`);
sourcesLines.push(`  },`);
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Reciter portraits",`);
sourcesLines.push(`    url: "https://commons.wikimedia.org",`);
sourcesLines.push(`    license: "Wikimedia Commons / Public Domain / Fair Use",`);
sourcesLines.push(`  },`);
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Ambient audio + background videos (16 sounds)",`);
sourcesLines.push(`    url: "https://pixabay.com/sound-effects/",`);
sourcesLines.push(`    license: "Pixabay Content License — free for commercial use, no attribution required",`);
sourcesLines.push(`  },`);
sourcesLines.push(`];`);
sourcesLines.push(``);
writeFileSync(join(ROOT, "data", "sources.ts"), sourcesLines.join("\n"));
log(`Sources: ${CATALOG.length} reciter attributions + 4 static entries`);

log("Done ✅");

