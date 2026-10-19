/**
 * Secondary audio mirrors for the Qur'an layer.
 *
 * Eight reciters stream from Tarteel's QUL CDN (`audio-cdn.tarteel.ai`).
 * If that host errors, the player retries once with the matching mp3quran.net
 * file before surfacing the error banner. Note: the mirror is a different edit
 * of the same recitation, so verse highlighting falls back to approximate
 * alignment while the mirror is playing.
 *
 * Badr Al-Turki and Haitham Al-Dakhin stream from mp3quran.net directly; their
 * mirrors are the legacy QDC file (Badr) and the old mp3quran server (Haitham).
 */

const pad3 = (n: number) => String(n).padStart(3, "0");

const FALLBACK_AUDIO: Record<string, (surahId: number) => string> = {
  "yasir-al-dawsari": (n) =>
    `https://cdn.mp3quran.net/audio/yasser-dosari/r1/${pad3(n)}.mp3`,
  "haitham-al-dakhin": (n) =>
    `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${pad3(n)}.mp3`,
  "mishary-rashid-alafasy": (n) =>
    `https://cdn.mp3quran.net/audio/mishary-alafasy/r1/${pad3(n)}.mp3`,
  "abdul-basit-murattal": (n) =>
    `https://cdn.mp3quran.net/audio/abdulbasit-abdulsamad/r3/${pad3(n)}.mp3`,
  "mahmoud-khalil-al-husary": (n) =>
    `https://cdn.mp3quran.net/audio/mahmoud-husary/r1/${pad3(n)}.mp3`,
  "badr-al-turki": (n) =>
    `https://download.quranicaudio.com/quran/badr_al_turki/mp3/${pad3(n)}.mp3`,
  "abdur-rahman-as-sudais": (n) =>
    `https://cdn.mp3quran.net/audio/abdulrahman-sudais/r1/${pad3(n)}.mp3`,
  "maher-al-muaiqly": (n) =>
    `https://cdn.mp3quran.net/audio/maher-muaiqly/r1/${pad3(n)}.mp3`,
  "saad-al-ghamdi": (n) =>
    `https://cdn.mp3quran.net/audio/saad-ghamdi/r1/${pad3(n)}.mp3`,
  "abu-bakr-al-shatri": (n) =>
    `https://cdn.mp3quran.net/audio/abubakr-shatri/r1/${pad3(n)}.mp3`,
};

/** Returns the mirror URL for a recitation, or null when none is known. */
export function getFallbackAudioUrl(reciterId: string, surahId: number): string | null {
  return FALLBACK_AUDIO[reciterId]?.(surahId) ?? null;
}
