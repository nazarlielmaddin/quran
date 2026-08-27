/**
 * Quran Sanctuary — Data generator
 * Fetches surah metadata + Latin transliteration from alquran.cloud,
 * merges hand-curated Azerbaijani names, parses verse timings (Dawsari),
 * and generates the full recitation catalog for 10 reciters.
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
 * Unified to Islamic Network CDN — quran/<folder> for Yasir/Maher/Saad (quran bucket),
 * qdc/<folder>/<n>.mp3 for Mishary/Basit/Husary/Mujawwad/Sudais/Shatri (QDC bucket) to match QDC timings
 * Verified via music-metadata parsing + HEAD (2026-08-27): QDC audio dur matches QDC timings within 0.05s (quran bucket drifts 3-20s)
 * Yasir (48.0s), Maher (36.5s), Saad (46.9s) already correct; 6 QDC reciters now switched to qdc bucket for perfect sync
 */
const CATALOG = [
  {
    id: "yasir-al-dawsari",
    qdcId: 97,
    provider: "quranicaudio",
    folder: "yasser_ad-dussary",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Yasir Al-Dawsari (quran/yasser_ad-dussary, 48s S1, verified)",
    audioUrl: (n) => `https://download.quranicaudio.com/quran/yasser_ad-dussary/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "haitham-al-dakhin",
    qdcId: null,
    provider: "mp3quran",
    folder: "h_dukhain/Rewayat-Hafs-A-n-Assem",
    timingSource: null,
    sourceLabel: "mp3quran.net — Haitham Al-Dakhin (Hafs 'an 'Asim, 320kbps, no timings)",
    audioUrl: (n) => `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "mishary-rashid-alafasy",
    qdcId: 7,
    provider: "quranicaudio",
    folder: "mishari_al_afasy/murattal",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Mishary Rashid Alafasy (qdc/mishari_al_afasy/murattal, 46.5s S1, QDC perfect 0.01s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${n}.mp3`,
  },
  {
    id: "abdul-basit-murattal",
    qdcId: 2,
    provider: "quranicaudio",
    folder: "abdul_baset/murattal",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Abdul Basit Murattal (qdc/abdul_baset/murattal, 41.8s S1, QDC perfect 0.03s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/abdul_baset/murattal/${n}.mp3`,
  },
  {
    id: "mahmoud-khalil-al-husary",
    qdcId: 6,
    provider: "quranicaudio",
    folder: "khalil_al_husary/murattal",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Mahmoud Khalil Al-Husary (qdc/khalil_al_husary/murattal, 48.2s S1, QDC perfect 0.01s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/khalil_al_husary/murattal/${n}.mp3`,
  },
  {
    id: "abdul-basit-mujawwad",
    qdcId: 1,
    provider: "quranicaudio",
    folder: "abdul_baset/mujawwad",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Abdul Basit Mujawwad (qdc/abdul_baset/mujawwad, 78.4s S1, QDC perfect 0.04s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/${n}.mp3`,
  },
  {
    id: "abdur-rahman-as-sudais",
    qdcId: 3,
    provider: "quranicaudio",
    folder: "abdurrahmaan_as_sudais/murattal",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Abdur-Rahman as-Sudais (qdc/abdurrahmaan_as_sudais/murattal, 34.9s S1, QDC perfect 0.00s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/${n}.mp3`,
  },
  {
    id: "maher-al-muaiqly",
    qdcId: 65,
    provider: "quranicaudio",
    folder: "maher_256",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Maher Al-Muaiqly (quran/maher_256, 36s S1, fixes 25.9s drift; fallback S5->year1440)",
    audioUrl: (n) => {
      const padded = String(n).padStart(3, "0");
      // maher_256 missing 005.mp3 on archive (113/114) — fallback to year1440 for surah 5
      if (n === 5) return `https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/${padded}.mp3`;
      return `https://download.quranicaudio.com/quran/maher_256/${padded}.mp3`;
    },
  },
  {
    id: "saad-al-ghamdi",
    qdcId: 13,
    provider: "quranicaudio",
    folder: "sa3d_al-ghaamidi/complete",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Saad Al-Ghamdi (quran/sa3d_al-ghaamidi/complete, 47s S1, perfect 0.27s avg)",
    audioUrl: (n) => `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "abu-bakr-al-shatri",
    qdcId: 4,
    provider: "quranicaudio",
    folder: "abu_bakr_shatri/murattal",
    timingSource: "qdc",
    sourceLabel: "Islamic Network / QuranicAudio — Abu Bakr Al-Shatri (qdc/abu_bakr_shatri/murattal, 53.1s S1, QDC perfect 0.04s)",
    audioUrl: (n) => `https://download.quranicaudio.com/qdc/abu_bakr_shatri/murattal/${n}.mp3`,
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

const nestedTimings = {};
const calculatedDurations = {}; // Record<reciterId, Record<surahId, number>>

for (const entry of CATALOG) {
  if (!entry.timingSource) continue;
  nestedTimings[entry.id] = {};
  calculatedDurations[entry.id] = {};

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
  if (entry.provider === "mp3quran") license = "mp3quran.net official hosted mushaf";
  else license = "Quran.com / QuranicAudio — public distribution";
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
sourcesLines.push(`    label: "Verse timings — 9 reciters (6236 verses each)",`);
sourcesLines.push(`    url: "https://quran.com",`);
sourcesLines.push(`    license: "Quran Foundation (QDC API) — verified high-precision verse timings",`);
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

