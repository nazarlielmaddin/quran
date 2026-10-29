"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, Apple, Mail } from "lucide-react";

type OS = "ios" | "android" | "other";

const ANDROID_URL =
  "https://github.com/nazarlielmaddin/quran/releases/latest/download/Azanify-latest.apk";
const IOS_URL = process.env.NEXT_PUBLIC_IOS_DOWNLOAD_URL || "";

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
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const handleIOS = (e: React.MouseEvent) => {
    if (IOS_URL) return; // let the link open TestFlight
    e.preventDefault();
    setShowModal(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const list = JSON.parse(localStorage.getItem("azanify.ios.notify") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("azanify.ios.notify", JSON.stringify(list));
    } catch {}
    setThanks(true);
  };

  const close = () => {
    setShowModal(false);
    setThanks(false);
    setEmail("");
  };

  const iosHref = IOS_URL || "#";
  const iosOnClick = IOS_URL ? undefined : handleIOS;

  if (os === "android") {
    return (
      <a
        href={ANDROID_URL}
        download
        className="glass rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft inline-flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Azanify endir (Android)
      </a>
    );
  }

  if (os === "ios") {
    return (
      <>
        <a
          href={iosHref}
          onClick={iosOnClick}
          className="glass rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft inline-flex items-center gap-2"
        >
          <Apple className="h-4 w-4" />
          Azanify endir (iOS)
        </a>
        {showModal && <IOSModal email={email} setEmail={setEmail} thanks={thanks} submit={submit} close={close} />}
      </>
    );
  }

  // Desktop / unknown: offer both.
  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={ANDROID_URL}
          download
          className="glass rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft inline-flex items-center gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Android
        </a>
        <a
          href={iosHref}
          onClick={iosOnClick}
          className="glass rounded-full px-9 py-4 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft inline-flex items-center gap-2"
        >
          <Apple className="h-4 w-4" />
          iOS
        </a>
      </div>
      {showModal && <IOSModal email={email} setEmail={setEmail} thanks={thanks} submit={submit} close={close} />}
    </>
  );
}

function IOSModal({
  email,
  setEmail,
  thanks,
  submit,
  close,
}: {
  email: string;
  setEmail: (v: string) => void;
  thanks: boolean;
  submit: (e: React.FormEvent) => void;
  close: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      onClick={close}
    >
      <div
        className="glass w-full max-w-md rounded-3xl p-7 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Apple className="h-6 w-6 text-gold" />
          <h3 className="font-display text-xl text-mist">iOS versiyası hazırlanır</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-mist-dim">
          Azanify-nin iPhone versiyası hazır olanda TestFlight linki ilə paylaşılacaq.
          Emailini yaz, ilk sən xəbər tut.
        </p>
        {thanks ? (
          <p className="mt-5 text-sm text-gold-soft">
            Təşəkkür! Hazır olanda xəbər verəcəyik.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@ünvan.com"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist placeholder:text-mist-faint focus:outline-none focus:border-gold/40"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" />
            </button>
          </form>
        )}
        <button
          onClick={close}
          className="mt-5 text-xs text-mist-faint transition hover:text-mist"
        >
          Bağla
        </button>
      </div>
    </div>
  );
}
