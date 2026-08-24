/**
 * Saadat — Data generator
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

/** Central reciter catalog — single source of truth for audio + timings + attribution */
const CATALOG = [
  {
    id: "yasir-al-dawsari",
    provider: "everyayah",
    folder: "ar.yasseraldossari",
    qdcSlug: null,
    timingSource: "everyayah",
    sourceLabel: "Islamic Network CDN (quranicaudio.com archive)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio-surah/128/ar.yasseraldossari/${n}.mp3`,
  },
  {
    id: "haitham-al-dakhin",
    provider: "mp3quran",
    folder: "h_dukhain/Rewayat-Hafs-A-n-Assem",
    qdcSlug: null,
    timingSource: null,
    sourceLabel: "mp3quran.net — official hosted mushaf",
    audioUrl: (n) => `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "mishary-rashid-alafasy",
    provider: "everyayah",
    folder: "Alafasy_128kbps",
    qdcSlug: "mishary_rashid_alafasy",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Mishary Rashid Alafasy (Alafasy_128kbps, qdc fallback: mishary_rashid_alafasy)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`,
  },
  {
    id: "abdul-basit-murattal",
    provider: "everyayah",
    folder: "Abdul_Basit_Murattal_192kbps",
    qdcSlug: null,
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Abdul Basit Murattal (Abdul_Basit_Murattal_192kbps)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal/${n}.mp3`,
  },
  {
    id: "mahmoud-khalil-al-husary",
    provider: "everyayah",
    folder: "Husary_128kbps",
    qdcSlug: "mahmoud_khalil_al_husary",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Mahmoud Khalil Al-Husary (Husary_128kbps — cdn.islamic.network audio/128)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio/128/ar.husary/${n}.mp3`,
  },
  {
    id: "abdul-basit-mujawwad",
    provider: "everyayah",
    folder: "Abdul_Basit_Mujawwad_128kbps",
    qdcSlug: "abdul_basit/mujawwad",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Abdul Basit Mujawwad (Abdul_Basit_Mujawwad_128kbps — cdn.islamic.network audio-surah/128)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmujawwad/${n}.mp3`,
  },
  {
    id: "abdur-rahman-as-sudais",
    provider: "everyayah",
    folder: "Abdurrahmaan_As-Sudais_192kbps",
    qdcSlug: "abdur_rahman_as_sudais",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Abdur-Rahman As-Sudais (Abdurrahmaan_As-Sudais_192kbps — cdn.islamic.network audio/192)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio/192/ar.abdurrahmaansudais/${n}.mp3`,
  },
  {
    id: "maher-al-muaiqly",
    provider: "everyayah",
    folder: "Maher_AlMuaiqly_64kbps",
    qdcSlug: "maher_al_muaiqly",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Maher Al-Muaiqly (Maher_AlMuaiqly_64kbps — cdn.islamic.network audio/64)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio/64/ar.mahermuaiqly/${n}.mp3`,
  },
  {
    id: "saad-al-ghamdi",
    provider: "mp3quran",
    folder: "Ghamadi_40kbps",
    qdcSlug: "saad_al_ghamdi",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Saad Al-Ghamdi (Ghamadi_40kbps, mp3quran fallback: server6.mp3quran.net/ghamdi)",
    audioUrl: (n) => `https://server6.mp3quran.net/ghamdi/${String(n).padStart(3, "0")}.mp3`,
  },
  {
    id: "abu-bakr-al-shatri",
    provider: "everyayah",
    folder: "Abu_Bakr_Ash-Shaatree_128kbps",
    qdcSlug: "abu_bakr_ash_shaatree",
    timingSource: "everyayah",
    sourceLabel: "EveryAyah.com — Abu Bakr Al-Shatri (Abu_Bakr_Ash-Shaatree_128kbps — cdn.islamic.network audio/128)",
    audioUrl: (n) => `https://cdn.islamic.network/quran/audio/128/ar.shaatree/${n}.mp3`,
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
const candidateDirs = [
  process.env.TIMINGS_DIR,
  "C:\\Users\\enaza\\AppData\\Local\\Temp\\opencode\\timings\\extracted",
  "C:/Users/enaza/AppData/Local/Temp/opencode/timings/extracted",
  join(ROOT, "..", "AppData", "Local", "Temp", "opencode", "timings", "extracted"),
  process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Temp", "opencode", "timings", "extracted") : null,
  process.env.TEMP ? join(process.env.TEMP, "opencode", "timings", "extracted") : null,
].filter(Boolean);
let timingsDir = candidateDirs.find((d) => existsSync(d));
if (!timingsDir) {
  timingsDir = candidateDirs[0];
  log(`Timings dir not found (tried ${candidateDirs.join(", ")}) — attempting fallback`);
} else {
  log(`Using timings dir: ${timingsDir}`);
}
const baseTimings = {};
if (timingsDir && existsSync(timingsDir)) {
  for (let n = 1; n <= 114; n++) {
    const f = join(timingsDir, String(n).padStart(3, "0") + ".txt");
    if (!existsSync(f)) continue;
    baseTimings[String(n)] = readFileSync(f, "utf8").trim().split(/\r?\n/).map((v) => Number(v));
    if (baseTimings[String(n)].length > surahs.find((s) => s.number === n)?.verses) {
      baseTimings[String(n)].pop();
    }
  }
  log(`Base timings parsed: ${Object.keys(baseTimings).length} surahs from ${timingsDir}`);
}
if (Object.keys(baseTimings).length === 0) {
  log(`Timings dir empty or not found at ${timingsDir} — attempting to reuse existing timings cache`);
  const existingTimingsPath = join(GEN, "timings.ts");
  if (existsSync(existingTimingsPath)) {
    try {
      const raw = readFileSync(existingTimingsPath, "utf8").replace(/^.*export default /, "").replace(/ as const;.*$/s, "");
      const existing = JSON.parse(raw);
      const firstKey = Object.keys(existing)[0];
      if (firstKey && Array.isArray(existing[firstKey])) {
        Object.assign(baseTimings, existing);
        log(`Loaded ${Object.keys(baseTimings).length} surahs from legacy flat timings cache`);
      } else if (firstKey && typeof existing[firstKey] === "object" && existing[firstKey] !== null) {
        const sampleReciter = Object.keys(existing).find((k) => existing[k] && Object.keys(existing[k]).length > 0);
        if (sampleReciter) {
          Object.assign(baseTimings, existing[sampleReciter] || {});
          log(`Loaded ${Object.keys(baseTimings).length} surahs from nested timings cache (sample: ${sampleReciter})`);
        }
      }
    } catch (e) {
      log(`Cache reuse failed: ${e.message}`);
    }
  }
  // Last resort: try to restore from git history via original timings.zip
  if (Object.keys(baseTimings).length === 0) {
    const zipPath = "C:\\Users\\enaza\\AppData\\Local\\Temp\\opencode\\timings\\timings.zip";
    const extractFallback = "C:\\Users\\enaza\\AppData\\Local\\Temp\\opencode\\timings\\extracted";
    if (existsSync(zipPath) && existsSync(extractFallback)) {
      log(`Attempting fallback extraction from ${zipPath}`);
      for (let n = 1; n <= 114; n++) {
        const f = join(extractFallback, String(n).padStart(3, "0") + ".txt");
        if (!existsSync(f)) continue;
        baseTimings[String(n)] = readFileSync(f, "utf8").trim().split(/\r?\n/).map((v) => Number(v));
        if (baseTimings[String(n)].length > surahs.find((s) => s.number === n)?.verses) {
          baseTimings[String(n)].pop();
        }
      }
      log(`Fallback base timings: ${Object.keys(baseTimings).length} surahs`);
    }
  }
}
// Build nested timings: every reciter with timingSource gets a copy of baseTimings
const nestedTimings = {};
for (const entry of CATALOG) {
  if (!entry.timingSource) continue;
  // Deep-copy arrays to avoid accidental mutation sharing (though not mutated)
  const perReciter = {};
  for (const [k, arr] of Object.entries(baseTimings)) {
    perReciter[k] = [...arr];
  }
  nestedTimings[entry.id] = perReciter;
}
writeTs("timings", nestedTimings);
log(`Timings: ${Object.keys(nestedTimings).length} reciters × ${Object.keys(baseTimings).length} surahs`);

/* 4 ── Recitation catalog — 10 reciters × 114 surahs = 1140 entries */
log("Generating recitation catalog…");
const dawsariDurations = {};
for (const [n, arr] of Object.entries(baseTimings)) {
  dawsariDurations[n] = Math.round((arr[arr.length - 1] + 7000) / 1000);
}
const recitations = [];
for (const entry of CATALOG) {
  for (const s of surahs) {
    const n = String(s.number).padStart(3, "0");
    const num = s.number;
    let id;
    if (entry.id === "yasir-al-dawsari") id = `dawsari-${n}`;
    else if (entry.id === "haitham-al-dakhin") id = `aldakhin-${n}`;
    else id = `${entry.id}-${n}`;
    recitations.push({
      id,
      reciterId: entry.id,
      surahId: num,
      audioUrl: entry.audioUrl(num),
      durationSeconds: entry.id === "yasir-al-dawsari" ? (dawsariDurations[String(num)] ?? null) : null,
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
  const labelMap = {
    "yasir-al-dawsari": "Qur'an audio — Yasir Al-Dawsari (128kbps, full surahs)",
    "haitham-al-dakhin": "Qur'an audio — Haitham Al-Dakhin (Hafs 'an 'Asim, 320kbps)",
    "mishary-rashid-alafasy": "Qur'an audio — Mishary Rashid Alafasy (Alafasy_128kbps, EveryAyah + QDC fallback)",
    "abdul-basit-murattal": "Qur'an audio — Abdul Basit Murattal (Abdul_Basit_Murattal_192kbps)",
    "mahmoud-khalil-al-husary": "Qur'an audio — Mahmoud Khalil Al-Husary (Husary_128kbps — cdn.islamic.network audio/128)",
    "abdul-basit-mujawwad": "Qur'an audio — Abdul Basit Mujawwad (Abdul_Basit_Mujawwad_128kbps)",
    "abdur-rahman-as-sudais": "Qur'an audio — Abdur-Rahman As-Sudais (Abdurrahmaan_As-Sudais_192kbps)",
    "maher-al-muaiqly": "Qur'an audio — Maher Al-Muaiqly (Maher_AlMuaiqly_64kbps)",
    "saad-al-ghamdi": "Qur'an audio — Saad Al-Ghamdi (Ghamadi_40kbps, mp3quran fallback)",
    "abu-bakr-al-shatri": "Qur'an audio — Abu Bakr Al-Shatri (Abu_Bakr_Ash-Shaatree_128kbps)",
  };
  const label = labelMap[entry.id] || `Qur'an audio — ${entry.id}`;
  const url = entry.audioUrl(1);
  let license;
  if (entry.provider === "mp3quran") license = "mp3quran.net official hosted mushaf";
  else if (entry.provider === "qdc") license = "QDC / Quran.com Audio — public distribution (quranicaudio.com / everyayah.com)";
  else license = "Islamic Network CDN — aggregated from quranicaudio.com archive (public distribution)";
  const note = entry.provider === "everyayah" && entry.qdcSlug ? ` // qdc fallback: ${entry.qdcSlug}` : "";
  sourcesLines.push(`  {`);
  sourcesLines.push(`    label: ${JSON.stringify(label)},`);
  sourcesLines.push(`    url: ${JSON.stringify(url)},`);
  sourcesLines.push(`    license: ${JSON.stringify(license)},${note}`);
  sourcesLines.push(`  },`);
}
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Surah metadata + Latin transliteration (6236 verses)",`);
sourcesLines.push(`    url: "https://api.alquran.cloud/v1/surah",`);
sourcesLines.push(`    license: "alquran.cloud (crowd-sourced; Qur'an text is public domain in most jurisdictions)",`);
sourcesLines.push(`  },`);
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Verse timings — Yasir Al-Dawsari + 8 EveryAyah/QDC reciters",`);
sourcesLines.push(`    url: "https://www.everyayah.com/data/timings_files/Yasser_Ad-Dussary_128kbps.zip",`);
sourcesLines.push(`    license: "(C) VerseByVerseQuran.com — used with required link-back to versebyversequran.com",`);
sourcesLines.push(`    note: "Timings are approximate; used for verse highlighting only. Reused across reciters with compatible Hafs 'an 'Asim pacing where per-reciter files unavailable.",`);
sourcesLines.push(`  },`);
sourcesLines.push(`  {`);
sourcesLines.push(`    label: "Reciter portrait — Yasir Al-Dawsari",`);
sourcesLines.push(`    url: "https://commons.wikimedia.org/wiki/File:Yasser_Al-Dosari_(cropped).jpg",`);
sourcesLines.push(`    license: "CC BY-SA 4.0 (Wikimedia Commons)",`);
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
