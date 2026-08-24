import type { Reciter } from "@/lib/types";

/**
 * Reciter catalog.
 * To add a reciter: add an entry here, then add `{reciterId} × 114` entries
 * to `src/data/generated/recitations.json` (see `scripts/fetch-data.mjs`).
 */
export const reciters: Reciter[] = [
  {
    id: "yasir-al-dawsari",
    name: "Yasir Al-Dawsari",
    arabicName: "ياسر الدوسري",
    image: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/reciters/yasir-al-dawsari.jpg`,
    bio: "Imam of the Grand Mosque in Mecca, known for a serene, measured style beloved worldwide.",
    bioLong:
      "Yasir Al-Dawsari served as an imam of the Grand Mosque (Masjid al-Haram) in Mecca, where his calm, deliberate recitation earned him a global following. His Hafs 'an 'Asim recordings are among the most widely streamed Qur'an recitations online.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    provider: "everyayah",
    audioFolder: "ar.yasseraldossari",
    timingSource: "everyayah",
  },
  {
    id: "haitham-al-dakhin",
    name: "Haitham Al-Dakhin",
    arabicName: "هيثم الدخين",
    image: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/reciters/haitham-al-dakhin.jpg`,
    bio: "Saudi reciter famed for his warm, flowing Hafs 'an 'Asim recordings shared across the world.",
    bioLong:
      "Haitham Al-Dakhin is a Saudi Qur'an reciter whose Hafs 'an 'Asim recordings — hosted on the official mp3quran.net mushaf — are a favorite for daily listening, tarawih, and sleep. His pacing is gentle and deeply soothing.",
    hasTimestamps: false,
    origin: "Saudi Arabia",
    provider: "mp3quran",
    audioFolder: "h_dukhain/Rewayat-Hafs-A-n-Assem",
    timingSource: null,
  },
  {
    id: "mishary-rashid-alafasy",
    name: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    bio: "Kuwaiti imam celebrated worldwide for his emotive, melodic Hafs 'an 'Asim recitation.",
    bioLong:
      "Mishary Rashid Alafasy is the imam of Masjid Al-Kabir in Kuwait and one of the most beloved Qur'an reciters globally. His EveryAyah (Alafasy_128kbps) recordings with QDC fallback are among the most streamed, known for crystal-clear tajwīd and deeply moving melodic phrasing.",
    hasTimestamps: true,
    origin: "Kuwait",
    provider: "everyayah",
    audioFolder: "Alafasy_128kbps",
    timingSource: "everyayah",
  },
  {
    id: "abdul-basit-murattal",
    name: "Abdul Basit — Murattal",
    arabicName: "عبد الباسط عبد الصمد (مرتل)",
    bio: "Egyptian legend whose measured murattal style set the gold standard for Hafs 'an 'Asim recitation.",
    bioLong:
      "Sheikh Abdul Basit Abdus Samad (1927–1988) was Egypt's most iconic qari. His Murattal (Abdul_Basit_Murattal_192kbps) EveryAyah recordings remain the reference for precise, unhurried Hafs 'an 'Asim recitation, studied by students worldwide.",
    hasTimestamps: true,
    origin: "Egypt",
    provider: "everyayah",
    audioFolder: "Abdul_Basit_Murattal_192kbps",
    timingSource: "everyayah",
  },
  {
    id: "mahmoud-khalil-al-husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    bio: "Egyptian master renowned for flawless tajwīd and the archetypal Hafs 'an 'Asim murattal.",
    bioLong:
      "Sheikh Mahmoud Khalil Al-Husary (1917–1980) is celebrated as the most precise reciter in history. His Husary_128kbps EveryAyah recordings are the canonical Hafs 'an 'Asim reference, revered for impeccable makhārij and measured, contemplative pace.",
    hasTimestamps: true,
    origin: "Egypt",
    provider: "everyayah",
    audioFolder: "Husary_128kbps",
    timingSource: "everyayah",
  },
  {
    id: "abdul-basit-mujawwad",
    name: "Abdul Basit — Mujawwad",
    arabicName: "عبد الباسط عبد الصمد (مجود)",
    bio: "The mujawwad embodiment of Abdul Basit — ornate, soulful, and profoundly moving.",
    bioLong:
      "The Mujawwad style of Abdul Basit Abdus Samad showcases his celebrated ornamental recitation. Distributed via the QDC archive (qdc/abdul_basit/mujawwad), it contrasts his murattal with elaborate, melodic elongation cherished for reflection and ceremony.",
    hasTimestamps: true,
    origin: "Egypt",
    provider: "qdc",
    audioFolder: "qdc/abdul_basit/mujawwad",
    timingSource: "qdc",
  },
  {
    id: "abdur-rahman-as-sudais",
    name: "Abdur-Rahman As-Sudais",
    arabicName: "عبد الرحمن السديس",
    bio: "Imam of Masjid al-Haram, famed for his powerful, uplifting Hafs 'an 'Asim recitation.",
    bioLong:
      "Abdur-Rahman As-Sudais has served as imam of the Grand Mosque in Mecca since 1984. His QDC archive (qdc/abdur_rahman_as_sudais) Hafs 'an 'Asim recordings are among the most played worldwide, known for emotional intensity and commanding clarity.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    provider: "qdc",
    audioFolder: "qdc/abdur_rahman_as_sudais",
    timingSource: "qdc",
  },
  {
    id: "maher-al-muaiqly",
    name: "Maher Al-Muaiqly",
    arabicName: "ماهر المعيقلي",
    bio: "Imam of Masjid al-Haram, beloved for his tender, heartfelt Hafs 'an 'Asim style.",
    bioLong:
      "Maher Al-Muaiqly is an imam of the Grand Mosque in Mecca whose soft, deeply emotive Hafs 'an 'Asim recitation has earned a devoted global following. His QDC archive (qdc/maher_al_muaiqly) recordings are a favorite for prayer and quiet reflection.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    provider: "qdc",
    audioFolder: "qdc/maher_al_muaiqly",
    timingSource: "qdc",
  },
  {
    id: "saad-al-ghamdi",
    name: "Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    bio: "Saudi reciter cherished for his warm, flowing Hafs 'an 'Asim murattal.",
    bioLong:
      "Saad Al-Ghamdi is a Saudi Qur'an reciter and imam whose gentle, lyrical Hafs 'an 'Asim voice has captivated listeners for decades. His EveryAyah recording (Ghamadi_40kbps) is celebrated for serene, measured delivery ideal for memorization and daily listening.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    provider: "everyayah",
    audioFolder: "Ghamadi_40kbps",
    timingSource: "everyayah",
  },
  {
    id: "abu-bakr-al-shatri",
    name: "Abu Bakr Al-Shatri",
    arabicName: "أبو بكر الشاطري",
    bio: "Saudi reciter admired for his calm, nurturing Hafs 'an 'Asim voice.",
    bioLong:
      "Abu Bakr Al-Shatri is a Saudi Qur'an reciter and imam known for his soothing, fatherly Hafs 'an 'Asim recitation. His EveryAyah recording (Abu_Bakr_Ash-Shaatree_128kbps) is widely cherished for its clarity and tranquil, contemplative pace.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    provider: "everyayah",
    audioFolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    timingSource: "everyayah",
  },
];

export function getReciter(id: string): Reciter | undefined {
  return reciters.find((r) => r.id === id);
}
