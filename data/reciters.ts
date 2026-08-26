import type { Reciter } from "@/lib/types";

// `next/image` requires an explicit base path when the static export is
// hosted below a repository URL (for example, GitHub Pages at `/quran`).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Reciter catalog — 10 reciters with official per-surah audio streams.
 * Each entry has canonical (en) + Azerbaijani (Az) fields. getLocalized()
 * in the UI picks the right one based on locale.
 */
export const reciters: Reciter[] = [
  {
    id: "yasir-al-dawsari",
    name: "Yasir Al-Dawsari",
    nameAz: "Yasir Əl-Dovsari",
    arabicName: "ياسر الدوسري",
    image: `${basePath}/images/reciters/yasir-al-dawsari.jpg`,
    bio: "Imam of the Grand Mosque in Mecca, known for a serene, measured style beloved worldwide.",
    bioAz: "Məkkə Böyük Məscid imamı, sakit və ölçülü qiraəti ilə tanınır.",
    bioLong:
      "Yasir Al-Dawsari served as an imam of the Grand Mosque (Masjid al-Haram) in Mecca, where his calm, deliberate recitation earned him a global following. His Hafs 'an 'Asim recordings are among the most widely streamed Qur'an recitations online.",
    bioLongAz:
      "Yasir Əl-Dovsari Məscidül-Həramın imamı kimi xidmət edib, sakit və tələsməz qiraəti ilə qlobal şöhrət qazanıb. Onun Həfs rəvayəti ilə tilavətləri internetdə ən çox dinlənilən Quran oxunuşlarındandır.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "qdc",
    audioFolder: "yasser_ad-dussary",
    timingSource: "qdc",
  },
  {
    id: "haitham-al-dakhin",
    name: "Haitham Al-Dakhin",
    nameAz: "Heytəm Əl-Daxin",
    arabicName: "هيثم الدخين",
    image: `${basePath}/images/reciters/haitham-al-dakhin.jpg`,
    bio: "Saudi reciter famed for his warm, flowing Hafs 'an 'Asim recordings shared across the world.",
    bioAz: "İsti və axıcı səsi ilə sevilən səudiyyəli qari.",
    bioLong:
      "Haitham Al-Dakhin is a Saudi Qur'an reciter whose Hafs 'an 'Asim recordings — hosted on the official mp3quran.net mushaf — are a favorite for daily listening, tarawih, and sleep. His pacing is gentle and deeply soothing.",
    bioLongAz:
      "Heytəm Əl-Daxin səudiyyəli qaridir, Həfs rəvayəti ilə mp3quran.net mushafında yerləşən axıcı və isidici qiraətləri gündəlik dinləmə, tərāvih və istirahət üçün çox sevilir. Onun ahəngi sakit və dərin hüzur verir.",
    hasTimestamps: false,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "mp3quran",
    audioFolder: "h_dukhain/Rewayat-Hafs-A-n-Assem",
    timingSource: null,
  },
  {
    id: "mishary-rashid-alafasy",
    name: "Mishary Rashid Alafasy",
    nameAz: "Mişari Rəşid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    image: `${basePath}/images/reciters/mishary-rashid-alafasy.jpg`,
    bio: "Kuwaiti imam celebrated worldwide for his emotive, melodic Hafs 'an 'Asim recitation.",
    bioAz: "Küveyt imamı, duyğulu və melodik əfsanəvi səs.",
    bioLong:
      "Mishary Rashid Alafasy is the imam of Masjid Al-Kabir in Kuwait and one of the most beloved Qur'an reciters globally. His recordings are renowned for crystal-clear tajwīd, deeply moving melodic phrasing, and complete verse-level synchronization.",
    bioLongAz:
      "Mişari Rəşid Alafasy Küveytdə Məscid əl-Kəbirdə imamdır və dünyada ən sevilən qarilərdəndir. Kristal təcvidi, dərin duyğulu melodik ifadəsi və tam ayə səviyyəsində sinxronizasiyası ilə tanınır.",
    hasTimestamps: true,
    origin: "Kuwait",
    originAz: "Küveyt",
    provider: "qdc",
    audioFolder: "mishari_al_afasy/murattal",
    timingSource: "qdc",
  },
  {
    id: "abdul-basit-murattal",
    name: "Abdul Basit — Murattal",
    nameAz: "Əbdül Basit — Murəttəl",
    arabicName: "عبد الباسط عبد الصمد (مرتل)",
    image: `${basePath}/images/reciters/abdul-basit-murattal.jpg`,
    bio: "Egyptian legend whose measured murattal style set the gold standard for Hafs 'an 'Asim recitation.",
    bioAz: "Misir əfsanəsi, murəttəl üslubun qızıl standartı.",
    bioLong:
      "Sheikh Abdul Basit Abdus Samad (1927–1988) was Egypt's most iconic qari. His canonical Murattal recordings remain the universal reference for precise, unhurried Hafs 'an 'Asim recitation, studied and revered by Muslims worldwide.",
    bioLongAz:
      "Şeyx Əbdül Basit Əbdüs-Səməd (1927–1988) Misirin ən ikonik qarisi olub. Onun Murəttəl qiraətləri dəqiq və tələsməz Həfs oxunuşunun universal etalonu sayılır, bütün dünyada öyrənilir və sevilir.",
    hasTimestamps: true,
    origin: "Egypt",
    originAz: "Misir",
    provider: "qdc",
    audioFolder: "abdul_baset/murattal",
    timingSource: "qdc",
  },
  {
    id: "mahmoud-khalil-al-husary",
    name: "Mahmoud Khalil Al-Husary",
    nameAz: "Mahmud Xəlil Əl-Husari",
    arabicName: "محمود خليل الحصري",
    image: `${basePath}/images/reciters/mahmoud-khalil-al-husary.jpg`,
    bio: "Egyptian master renowned for flawless tajwīd and the archetypal Hafs 'an 'Asim murattal.",
    bioAz: "Misirli ustad, qüsursuz təcvidin örnəyi.",
    bioLong:
      "Sheikh Mahmoud Khalil Al-Husary (1917–1980) was the Shaykh al-Maqari of Egypt and is celebrated as the most precise reciter in history, revered for immaculate makhārij and a measured, contemplative pace ideal for learning.",
    bioLongAz:
      "Şeyx Mahmud Xəlil Əl-Husari (1917–1980) Misirin Şeyx əl-Məqarii olub, tarixin ən dəqiq qarisi kimi tanınır. Qüsursuz məxaric və ölçülü, təfəkkürə sövq edən ahəngi öyrənmək üçün idealdır.",
    hasTimestamps: true,
    origin: "Egypt",
    originAz: "Misir",
    provider: "qdc",
    audioFolder: "khalil_al_husary/murattal",
    timingSource: "qdc",
  },
  {
    id: "abdul-basit-mujawwad",
    name: "Abdul Basit — Mujawwad",
    nameAz: "Əbdül Basit — Mucəvvəd",
    arabicName: "عبد الباسط عبد الصمد (مجود)",
    image: `${basePath}/images/reciters/abdul-basit-mujawwad.jpg`,
    bio: "The golden voice of Egypt, famed for majestic, breath-taking mujawwad recitation.",
    bioAz: "Misirin qızıl səsi, əzəmətli mucəvvəd qiraəti.",
    bioLong:
      "Sheikh Abdul Basit's Mujawwad recitation is considered one of the greatest masterpieces of Qur'anic vocal art, featuring awe-inspiring melodic mastery, incredible breath capacity, and deep emotional resonance.",
    bioLongAz:
      "Şeyx Əbdül Basitin Mucəvvəd qiraəti Quran səs sənətinin ən böyük şah əsərlərindən sayılır — heyrətamiz melodik ustalıq, inanılmaz nəfəs gücü və dərin emosional təsir ilə seçilir.",
    hasTimestamps: true,
    origin: "Egypt",
    originAz: "Misir",
    provider: "qdc",
    audioFolder: "abdul_baset/mujawwad",
    timingSource: "qdc",
  },
  {
    id: "abdur-rahman-as-sudais",
    name: "Abdur-Rahman as-Sudais",
    nameAz: "Əbdür-Rəhman əs-Sudais",
    arabicName: "عبد الرحمن السديس",
    image: `${basePath}/images/reciters/abdur-rahman-as-sudais.jpg`,
    bio: "Chief Imam of the Grand Mosque in Mecca, renowned for his resonant, authoritative tone.",
    bioAz: "Məkkə Böyük Məscid baş imamı, gur və nüfuzlu səs.",
    bioLong:
      "Sheikh Abdur-Rahman as-Sudais has served for decades as the chief imam of the Grand Mosque (Masjid al-Haram) in Mecca, leading millions in prayer with his unmistakable, passionate, and commanding recitation.",
    bioLongAz:
      "Şeyx Əbdür-Rəhman əs-Sudais onilliklərdir Məkkədə Məscidül-Həramın baş imamı kimi xidmət edir, unudulmaz, ehtiraslı və əmr edici qiraəti ilə milyonlarla insana namaz qıldırır.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "qdc",
    audioFolder: "abdurrahmaan_as_sudais/murattal",
    timingSource: "qdc",
  },
  {
    id: "maher-al-muaiqly",
    name: "Maher Al-Muaiqly",
    nameAz: "Mahir Əl-Muaiqly",
    arabicName: "ماهر المعيقلي",
    image: `${basePath}/images/reciters/maher-al-muaiqly.jpg`,
    bio: "Imam of the Grand Mosque in Mecca, beloved for his emotionally stirring and soulful recitation.",
    bioAz: "Məkkə imamı, qəlbə toxunan ruhani qiraət.",
    bioLong:
      "Sheikh Maher Al-Muaiqly is an imam of the Grand Mosque in Mecca whose warm, deeply poignant voice and heart-touching tarawih recitations are cherished by millions worldwide.",
    bioLongAz:
      "Şeyx Mahir Əl-Muaiqly Məkkədə Məscidül-Həramın imamıdır, isti və dərin təsiredici səsi, qəlbə işləyən tərāvih qiraətləri milyonlarla insan tərəfindən sevilir.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "qdc",
    audioFolder: "maher_almu3aiqly/year1440",
    timingSource: "qdc",
  },
  {
    id: "saad-al-ghamdi",
    name: "Saad Al-Ghamdi",
    nameAz: "Səəd Əl-Ghamdi",
    arabicName: "سعد الغامدي",
    image: `${basePath}/images/reciters/saad-al-ghamdi.jpg`,
    bio: "Saudi reciter and imam famous for a calm, gentle, and deeply soothing recitation.",
    bioAz: "Səudiyyəli qari, hüzurlu və sakit qiraəti ilə sevilir.",
    bioLong:
      "Sheikh Saad Al-Ghamdi is an internationally celebrated Saudi qari whose gentle, tranquil pacing and consistent melodic sweetness make his recitations ideal for peaceful contemplation, rest, and memorization.",
    bioLongAz:
      "Şeyx Səəd Əl-Ghamdi beynəlxalq şöhrətli səudiyyəli qaridir, sakit və hüzurlu ahəngi, ardıcıl melodik şirinliyi onun qiraətlərini hüzurlu təfəkkür, istirahət və əzbərləmək üçün ideal edir.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "qdc",
    audioFolder: "sa3d_al-ghaamidi/complete",
    timingSource: "qdc",
  },
  {
    id: "abu-bakr-al-shatri",
    name: "Abu Bakr Al-Shatri",
    nameAz: "Əbu Bəkr Əl-Şatri",
    arabicName: "أبو بكر الشاطري",
    image: `${basePath}/images/reciters/abu-bakr-al-shatri.jpg`,
    bio: "Jeddah-born imam acclaimed for his distinct, unhurried, and exceptionally clear style.",
    bioAz: "Ciddəli imam, aydın və fərqli üslubu ilə tanınır.",
    bioLong:
      "Sheikh Abu Bakr Al-Shatri is a prominent Saudi reciter whose measured, resonant delivery and crystal-clear pronunciation make following along and learning the Holy Qur'an an inspiring experience.",
    bioLongAz:
      "Şeyx Əbu Bəkr Əl-Şatri tanınmış səudiyyəli qaridir, ölçülü və gur tələffüzü, kristal kimi aydın oxunuşu Quranı izləməyi və öyrənməyi ilhamverici edir.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
    originAz: "Səudiyyə Ərəbistanı",
    provider: "qdc",
    audioFolder: "abu_bakr_shatri/murattal",
    timingSource: "qdc",
  },
];

export function getReciter(id: string): Reciter | undefined {
  return reciters.find((r) => r.id === id);
}
