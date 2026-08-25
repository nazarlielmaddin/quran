import type { Reciter } from "@/lib/types";

// `next/image` requires an explicit base path when the static export is
// hosted below a repository URL (for example, GitHub Pages at `/quran`).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
    image: `${basePath}/images/reciters/yasir-al-dawsari.jpg`,
    bio: "Imam of the Grand Mosque in Mecca, known for a serene, measured style beloved worldwide.",
    bioLong:
      "Yasir Al-Dawsari served as an imam of the Grand Mosque (Masjid al-Haram) in Mecca, where his calm, deliberate recitation earned him a global following. His Hafs 'an 'Asim recordings are among the most widely streamed Qur'an recitations online.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
  },
  {
    id: "haitham-al-dakhin",
    name: "Haitham Al-Dakhin",
    arabicName: "هيثم الدخين",
    bio: "Saudi reciter famed for his warm, flowing Hafs 'an 'Asim recordings shared across the world.",
    bioLong:
      "Haitham Al-Dakhin is a Saudi Qur'an reciter whose Hafs 'an 'Asim recordings — hosted on the official mp3quran.net mushaf — are a favorite for daily listening, tarawih, and sleep. His pacing is gentle and deeply soothing.",
    hasTimestamps: false,
    origin: "Saudi Arabia",
  },
  {
    id: "maher-al-muaiqly",
    name: "Maher Al-Muaiqly",
    arabicName: "ماهر المعيقلي",
    image: `${basePath}/images/reciters/maher-al-muaiqly.jpg`,
    bio: "Imam of the Grand Mosque in Mecca, beloved for his emotionally stirring and soulful recitation.",
    bioLong:
      "Sheikh Maher Al-Muaiqly is an imam of the Grand Mosque in Mecca whose warm, deeply poignant voice and heart-touching tarawih recitations are cherished by millions worldwide.",
    hasTimestamps: true,
    origin: "Saudi Arabia",
  },
];

export function getReciter(id: string): Reciter | undefined {
  return reciters.find((r) => r.id === id);
}
