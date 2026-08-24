"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Play, ChevronRight } from "lucide-react";
import { reciters, getReciter } from "@/data/reciters";
import { usePlayer } from "@/lib/audio/player-context";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
        "group relative flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-300",
        active
          ? "border-gold/30 bg-gold/[0.06] shadow-[0_0_40px_-12px_rgba(200,169,124,0.2)]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-300",
          active
            ? "ring-gold/50 shadow-[0_0_16px_-4px_rgba(200,169,124,0.4)]"
            : "ring-white/[0.08] group-hover:ring-white/[0.15]",
        )}
      >
        {reciter.image ? (
          <Image
            src={reciter.image}
            alt={reciter.name}
            fill
            sizes="48px"
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
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "truncate text-[15px] font-medium leading-snug transition-colors duration-300",
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
        <p className="truncate text-xs text-mist-faint">
          {reciter.origin}
          <span className="mx-1.5 opacity-40">·</span>
          {reciter.bio.length > 55 ? reciter.bio.slice(0, 55) + "…" : reciter.bio}
        </p>
      </div>

      {/* Play action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          start();
        }}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
          active
            ? "bg-gold/20 text-gold-soft hover:bg-gold/30"
            : "bg-white/[0.05] text-mist-dim hover:bg-white/[0.1] hover:text-mist",
        )}
      >
        <Play className="h-3.5 w-3.5 fill-current" />
      </button>
    </motion.article>
  );
}

export function ReciterSelector() {
  return (
    <section id="reciters" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 sm:py-28 lg:px-8 lg:py-36">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl text-mist sm:text-4xl">{dict.reciters.title}</h2>
        <p className="mt-3 text-sm text-mist-dim">
          {dict.reciters.subtitle.includes("master voices")
            ? `${reciters.length} master voices — tap to select, press play to listen`
            : dict.reciters.subtitle}
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {reciters.map((r, i) => (
          <ReciterCard key={r.id} reciterId={r.id} index={i} />
        ))}
      </div>
    </section>
  );
}
