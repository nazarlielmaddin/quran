/**
 * Legacy audio mirrors for the Qur'an layer.
 *
 * Primary playback uses mp3quran.net's CDN, which is reachable from regions
 * where `download.quranicaudio.com` (BunnyCDN) is blocked or drops the TLS
 * connection. If the primary source errors, the player retries once with the
 * original QDC/QuranicAudio URL listed here before surfacing an error.
 */

const pad3 = (n: number) => String(n).padStart(3, "0");

const LEGACY_AUDIO: Record<string, (surahId: number) => string> = {
  "yasir-al-dawsari": (n) =>
    `https://download.quranicaudio.com/quran/yasser_ad-dussary/${pad3(n)}.mp3`,
  "haitham-al-dakhin": (n) =>
    `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${pad3(n)}.mp3`,
  "mishary-rashid-alafasy": (n) =>
    `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${n}.mp3`,
  "abdul-basit-murattal": (n) =>
    `https://download.quranicaudio.com/qdc/abdul_baset/murattal/${n}.mp3`,
  "mahmoud-khalil-al-husary": (n) =>
    `https://download.quranicaudio.com/qdc/khalil_al_husary/murattal/${n}.mp3`,
  "badr-al-turki": (n) =>
    `https://download.quranicaudio.com/quran/badr_al_turki/mp3/${pad3(n)}.mp3`,
  "abdur-rahman-as-sudais": (n) =>
    `https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/${n}.mp3`,
  "maher-al-muaiqly": (n) =>
    n === 5
      ? `https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/005.mp3`
      : `https://download.quranicaudio.com/quran/maher_256/${pad3(n)}.mp3`,
  "saad-al-ghamdi": (n) =>
    `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/${pad3(n)}.mp3`,
  "abu-bakr-al-shatri": (n) =>
    `https://download.quranicaudio.com/qdc/abu_bakr_shatri/murattal/${n}.mp3`,
};

/** Returns the legacy mirror URL for a recitation, or null when none is known. */
export function getFallbackAudioUrl(reciterId: string, surahId: number): string | null {
  return LEGACY_AUDIO[reciterId]?.(surahId) ?? null;
}
