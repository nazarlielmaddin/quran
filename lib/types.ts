/** Shared domain types for Quran Sanctuary. */

export interface Reciter {
  id: string;
  name: string;
  /** Azerbaijani name (falls back to `name` when missing). */
  nameAz?: string;
  /** Arabic-script name (used for typographic cards when no photo exists). */
  arabicName: string;
  image?: string;
  /** Short biography shown on the reciter card. */
  bio: string;
  /** Azerbaijani biography (falls back to `bio` when missing). */
  bioAz?: string;
  /** Longer bio for the reciter experience view. */
  bioLong: string;
  /** Azerbaijani long bio (falls back to `bioLong` when missing). */
  bioLongAz?: string;
  /** Transliteration style available for this reciter's timestamps. */
  hasTimestamps: boolean;
  origin: string;
  /** Azerbaijani origin (falls back to `origin` when missing). */
  originAz?: string;
  /** Audio provider identifier (everyayah, qdc, mp3quran, etc.). */
  provider?: string;
  /** EveryAyah folder or mp3quran sub-path for building audio URLs. */
  audioFolder?: string;
  /** Source of verse-level timing data (everyayah, qdc, etc.). */
  timingSource?: string | null;
}

export interface Surah {
  id: number;
  number: number;
  arabicName: string;
  englishName: string;
  transliteratedName: string;
  azerbaijaniName: string;
  meaning: string;
  /** Azerbaijani meaning (falls back to `meaning` when missing). */
  meaningAz?: string;
  verses: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Recitation {
  id: string;
  reciterId: string;
  surahId: number;
  audioUrl: string;
  /** Known duration in seconds (null when unknown — filled at runtime). */
  durationSeconds: number | null;
  source: string;
}

export type AmbientCategory = "nature" | "cozy" | "focus";

export interface AmbientSound {
  id: string;
  name: string;
  /** Azerbaijani name (falls back to `name` when missing). */
  nameAz?: string;
  category: AmbientCategory;
  /** Azerbaijani category label override. */
  categoryAz?: string;
  audioUrl: string;
  videoUrl: string;
  /** Two hex colors used to render the CSS-art thumbnail. */
  gradient: [string, string];
  source: string;
  /** Thumbnail photo shown on the sound card (the icon stays as fallback). */
  imageUrl?: string;
  /** Photo credit (visible in the sources registry). */
  imageSource?: string;
  /** Per-sound default volume (0..1). If set, multiplies the global ambientVolume. */
  volume?: number;
}

export interface MediaSource {
  label: string;
  url: string;
  license: string;
  note?: string;
}

export type RepeatMode = "off" | "one" | "all";

export type TransliterationStyle = "accurate" | "simple";
