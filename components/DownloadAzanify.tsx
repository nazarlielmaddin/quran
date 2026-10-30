"use client";

import { useEffect, useState } from "react";
import { Apple, Download, Smartphone, X } from "lucide-react";

type OS = "ios" | "android" | "other";

const ANDROID_URL =
  "https://github.com/nazarlielmaddin/quran/releases/latest/download/Azanify-latest.apk";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || "").toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (platform === "macintel" && navigator.maxTouchPoints > 1) return "ios";
  if (/android/.test(ua)) return "android";
  return "other";
}

export function DownloadAzanify() {
  const [os, setOs] = useState<OS>("other");
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOs(detectOS()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const iosButton = (
    <button
      type="button"
      onClick={() => setShowInstallGuide(true)}
      className="glass inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft"
    >
      <Apple className="h-4 w-4" />
      iPhone-a quraşdır
    </button>
  );

  if (os === "android") {
    return (
      <a
        href={ANDROID_URL}
        download
        className="glass inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft"
      >
        <Download className="h-4 w-4" />
        Azanify endir (Android)
      </a>
    );
  }

  return (
    <>
      {os === "ios" ? (
        iosButton
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={ANDROID_URL}
            download
            className="glass inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft"
          >
            <Smartphone className="h-4 w-4" />
            Android
          </a>
          {iosButton}
        </div>
      )}
      {showInstallGuide && <IOSInstallGuide close={() => setShowInstallGuide(false)} />}
    </>
  );
}

function IOSInstallGuide({ close }: { close: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
      onClick={close}
    >
      <div
        className="glass relative w-full max-w-md rounded-3xl p-7 text-left"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Pəncərəni bağla"
          className="absolute right-5 top-5 rounded-full p-2 text-mist-faint transition hover:text-mist"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <Apple className="h-6 w-6 text-gold" />
          <h2 id="ios-install-title" className="font-display text-xl text-mist">
            iPhone-a pulsuz quraşdır
          </h2>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mist-dim">
          Bu sayt iPhone-da tətbiq kimi işləyən PWA-dır. App Store və ödənişli
          developer hesabı lazım deyil.
        </p>
        <ol className="mt-5 space-y-3 text-sm text-mist">
          <li><span className="mr-2 text-gold">1.</span>Bu səhifəni Safari-də aç.</li>
          <li><span className="mr-2 text-gold">2.</span>Aşağıdakı Share düyməsinə toxun.</li>
          <li><span className="mr-2 text-gold">3.</span><strong>Add to Home Screen</strong> seç.</li>
          <li><span className="mr-2 text-gold">4.</span>Add düyməsinə toxun və Quran ikonunu ana ekrandan aç.</li>
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-mist-faint">
          Quraşdırıldıqdan sonra tam ekran açılır, seçimlər cihazda saxlanılır və
          əsas səhifə internet zəif olanda da açılır.
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-6 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition hover:scale-[1.02]"
        >
          Başa düşdüm
        </button>
      </div>
    </div>
  );
}
