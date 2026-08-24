"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Play } from "lucide-react";
import { reciters, getReciter } from "@/data/reciters";
import { usePlayer } from "@/lib/audio/player-context";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function ReciterCard({ reciterId, index }: { reciterId: string; index: number }) {
  const { reciterId: activeId, selectReciter, selectSurah } = usePlayer();
  const reciter = getReciter(reciterId)!;
  const active = activeId === reciter.id;

  const start = () => {
    if (!active) selectReciter(reciter.id);
    selectSurah(1, true);
    document.getElementById("now-playing")?.scrollIntoView({ behavior: "smooth" });
  };

  const choose = () => {
    selectReciter(reciter.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={choose}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center rounded-3xl border px-5 py-7 text-center transition-all duration-300",
        active
          ? "border-gold/35 bg-[linear-gradient(180deg,rgba(200,169,124,0.08),rgba(255,255,255,0.02))] shadow-[0_0_46px_-14px_rgba(200,169,124,0.28)]"
          : "border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] hover:border-white/[0.14] hover:bg-white/[0.05]",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/20 ring-1 ring-white/20 transition-all duration-300",
          active
            ? "border-gold/60 ring-gold/55 shadow-[0_0_0_2px_rgba(200,169,124,0.25),0_0_34px_-10px_rgba(200,169,124,0.5)]"
            : "group-hover:border-white/30 group-hover:ring-white/35",
        )}
      >
        {reciter.image ? (
          <Image
            src={reciter.image}
            alt={reciter.name}
            fill
            sizes="112px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
            <span className="font-arabic text-lg text-gold-soft">
              {reciter.arabicName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-5 flex min-w-0 flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className={cn(
            "text-[15px] font-medium leading-snug tracking-[0.01em] transition-colors duration-300",
            active ? "text-gold-soft" : "text-mist",
          )}>
            {reciter.name}
          </h3>
          {active && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
            </motion.span>
          )}
        </div>
        <p className="max-w-[20ch] text-[12px] leading-relaxed text-mist-faint">
          {reciter.origin}
          <span className="mx-1.5 opacity-40">·</span>
          {reciter.bio.length > 62 ? reciter.bio.slice(0, 62) + "…" : reciter.bio}
        </p>
      </div>

      {/* Play action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          start();
        }}
        className={cn(
          "mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
          active
            ? "border-gold/45 bg-gold/20 text-gold-soft shadow-[0_0_20px_-8px_rgba(200,169,124,0.65)] hover:bg-gold/30"
            : "border-white/15 bg-white/[0.05] text-mist-dim hover:border-white/30 hover:bg-white/[0.11] hover:text-mist",
        )}
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
    </motion.article>
  );
}

export function ReciterSelector() {
  return (
    <section
      id="reciters"
      className="mx-auto max-w-[1200px] scroll-mt-24 rounded-[2.25rem] border border-white/[0.08] bg-[#0c0c0d] px-6 py-16 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl text-mist sm:text-4xl">{dict.reciters.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist-dim">
          {dict.reciters.subtitle.includes("master voices")
            ? `${reciters.length} master voices — tap to select, press play to listen`
            : dict.reciters.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {reciters.map((r, i) => (
          <ReciterCard key={r.id} reciterId={r.id} index={i} />
        ))}
      </div>
    </section>
  );
}
