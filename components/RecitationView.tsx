"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, Loader2, MousePointerClick } from "lucide-react";
import { getRecitation, getSurah, getTimings } from "@/data/generated";
import { getReciter } from "@/data/reciters";
import { getVerses } from "@/data/transliterations";
import { usePlayer, usePlayback } from "@/lib/audio/player-context";
import { dict } from "@/lib/i18n";
import { activeVerseIndex, cn, formatTime } from "@/lib/utils";
import type { TransliterationStyle } from "@/lib/types";

const STYLES: Array<{ id: TransliterationStyle; label: string }> = [
  { id: "accurate", label: "Accurate" },
  { id: "simple", label: "Simple" },
];

export function RecitationView() {
  const {
    reciterId, surahId, showRecitation,
    setShowRecitation, transliterationStyle, setTransliterationStyle, seek, playQuran,
  } = usePlayer();
  const { currentTime } = usePlayback();

  const surah = getSurah(surahId);
  const reciter = getReciter(reciterId);
  const recitation = getRecitation(reciterId, surahId);
  const timings = useMemo(() => getTimings(reciterId, surahId), [reciterId, surahId]);

  const [data, setData] = useState<{
    id: number;
    style: TransliterationStyle;
    verses: string[];
  } | null>(null);
  const [errorId, setErrorId] = useState<number | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const userScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getVerses(surahId, transliterationStyle)
      .then((v) => {
        if (cancelled) return;
        if (v) setData({ id: surahId, style: transliterationStyle, verses: v });
        else setErrorId(surahId);
      })
      .catch(() => {
        if (cancelled) return;
        setErrorId(surahId);
      });
    return () => {
      cancelled = true;
    };
  }, [surahId, transliterationStyle]);

  const verses =
    data && data.id === surahId && data.style === transliterationStyle ? data.verses : null;
  const loading = verses === null && errorId !== surahId;
  const failed = errorId === surahId;

  const activeVerse = useMemo(() => {
    if (!timings) return null;
    return activeVerseIndex(timings, currentTime);
  }, [timings, currentTime]);

  /* Auto-scroll the active verse into view — follows recitation (only the box, not the page). */
  useEffect(() => {
    if (activeVerse == null || !activeRef.current || !scrollRef.current) return;
    if (userScrollingRef.current) return;
    // Wait for layout to settle before measuring
    requestAnimationFrame(() => {
      const container = scrollRef.current;
      const el = activeRef.current;
      if (!container || !el) return;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      // If already fully visible, don't scroll
      const isVisible =
        elRect.top >= containerRect.top + 16 &&
        elRect.bottom <= containerRect.bottom - 16;
      if (isVisible) return;
      const offset = elRect.top - containerRect.top + container.scrollTop;
      const targetTop = offset - container.clientHeight / 2 + el.clientHeight / 2;
      const maxTop = container.scrollHeight - container.clientHeight;
      const clampedTop = Math.max(0, Math.min(targetTop, maxTop));
      container.scrollTo({ top: clampedTop, behavior: "smooth" });
    });
  }, [activeVerse]);

  const handleUserScroll = () => {
    userScrollingRef.current = true;
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      userScrollingRef.current = false;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const jumpToVerse = (i: number) => {
    if (!timings) return;
    seek(timings[i] / 1000);
    // Jump AND continue from there — even if the Qur'an layer was OFF.
    playQuran();
  };

  return (
    <section id="now-playing" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 sm:py-28 lg:py-36">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl text-mist lg:text-5xl">
          {surah?.englishName}
          <span className="mt-2 block font-serif text-xl font-normal text-mist-dim">
            {surah?.transliteratedName} · {surah?.azerbaijaniName}
          </span>
        </h2>
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-mist-faint">
          {reciter?.image && (
            <Image
              src={reciter.image}
              alt=""
              width={20}
              height={20}
              className="rounded-full object-cover object-top"
            />
          )}
          {reciter?.name} · {surah?.verses} {dict.surahs.ayahs}
          {recitation?.durationSeconds ? ` · ${formatTime(recitation.durationSeconds)}` : ""}
        </p>

      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <div className="glass flex rounded-full p-1" role="group" aria-label="Transliteration style">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setTransliterationStyle(s.id)}
              aria-pressed={transliterationStyle === s.id}
              className={cn(
                "rounded-full px-4 py-2 text-xs transition-all duration-300",
                transliterationStyle === s.id ? "bg-mist text-ink" : "text-mist-dim hover:text-mist",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowRecitation(!showRecitation)}
          aria-pressed={showRecitation}
          className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft"
        >
          {showRecitation ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showRecitation ? dict.recitation.hide : dict.recitation.show}
        </button>
      </div>

      {/* Reading */}
      <div className="glass relative overflow-hidden rounded-3xl">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-24 text-sm text-mist-faint">
            <Loader2 className="h-4 w-4 animate-spin" /> {dict.recitation.loading}
          </div>
        )}

        {!loading && failed && (
          <div className="px-8 py-24 text-center text-sm text-mist-dim">
            {dict.recitation.unavailable}
          </div>
        )}

        {!loading && !failed && !showRecitation && (
          <div className="flex flex-col items-center gap-4 px-8 py-24 text-center">
            <Eye className="h-6 w-6 text-mist-faint" />
            <p className="text-sm text-mist-faint">{dict.recitation.hide}</p>
            <button
              onClick={() => setShowRecitation(true)}
              className="glass rounded-full px-6 py-3 text-sm text-mist transition-colors hover:border-gold/40 hover:text-gold-soft"
            >
              {dict.recitation.show}
            </button>
          </div>
        )}

        {!loading && !failed && showRecitation && verses && (
          <div
            ref={scrollRef}
            className="max-h-[62vh] overflow-y-auto px-6 py-10 sm:px-12 scroll-smooth"
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
          >
            <div className="mx-auto max-w-2xl space-y-2">
              {verses.map((text, i) => {
                const active = activeVerse === i;
                return (
                  <motion.div
                    key={i}
                    ref={active ? activeRef : undefined}
                    initial={false}
                    animate={{ opacity: active ? 1 : 0.62 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => jumpToVerse(i)}
                    className={cn(
                      "group flex cursor-pointer gap-4 rounded-2xl border border-transparent px-4 py-4 transition-colors duration-500 sm:gap-5",
                      active && "verse-active bg-gold/10",
                      timings && "hover:border-line hover:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums transition-colors duration-500",
                        active
                          ? "border-gold/60 bg-gold/15 text-gold-soft"
                          : "border-line text-mist-faint",
                      )}
                    >
                      {i + 1}
                    </span>
                    <p className="font-serif text-[1.15rem] leading-[1.85] text-mist sm:text-[1.35rem] sm:leading-[1.9]">
                      {text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {timings && (
              <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[11px] text-mist-faint">
                <MousePointerClick className="h-3 w-3" /> {dict.recitation.tapVerse}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}