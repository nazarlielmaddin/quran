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
      className="group relative flex cursor-pointer flex-col items-center px-2 py-2 text-center"
    >
      <div
        className={cn(
          "relative rounded-full p-1.5 transition-all duration-300",
          active
            ? "bg-[radial-gradient(circle,rgba(200,169,124,0.24)_0%,rgba(200,169,124,0.09)_44%,rgba(200,169,124,0)_72%)] shadow-[0_0_58px_-14px_rgba(200,169,124,0.58)]"
            : "",
        )}
      >
        <div
          className={cn(
            "relative h-40 w-40 overflow-hidden rounded-full border-[3px] transition-all duration-300",
            active
              ? "border-gold/65 ring-2 ring-gold/40"
              : "border-white/35 ring-1 ring-white/20 group-hover:border-white/50",
          )}
        >
          {reciter.image ? (
            <Image
              src={reciter.image}
              alt={reciter.name}
              fill
              sizes="160px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
              <span className="font-arabic text-2xl text-gold-soft">
                {reciter.arabicName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            start();
          }}
          className={cn(
            "absolute bottom-[6px] right-[6px] flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] transition-all duration-300",
            active
              ? "border-gold/45 bg-[radial-gradient(circle_at_30%_25%,#f7e4c7_0%,#d8b98d_44%,#9a7c52_100%)] text-[#2c2316]"
              : "border-white/45 bg-[radial-gradient(circle_at_30%_25%,#fdfdfd_0%,#cfd3d9_44%,#7d8188_100%)] text-[#23262b]",
          )}
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
      </div>

      <div className="mt-5 flex min-w-0 max-w-[19ch] flex-col items-center gap-1">
        <div className="flex items-center justify-center gap-1.5">
          <h3
            className={cn(
                    "text-[clamp(1rem,0.82rem+0.18vw,1.12rem)] font-medium leading-tight tracking-tight transition-colors duration-300",
              active ? "text-gold-soft" : "text-mist",
            )}
          >
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
        <p
          className={cn(
                  "text-[clamp(0.78rem,0.7rem+0.08vw,0.86rem)] leading-snug",
            active ? "text-gold/80" : "text-mist-faint",
          )}
        >
          {reciter.origin}
                <span className="mx-1 opacity-40">·</span>
          {reciter.bio.length > 44 ? reciter.bio.slice(0, 44) + "…" : reciter.bio}
        </p>
      </div>
    </motion.article>
  );
}

export function ReciterSelector() {
  return (
    <section
      id="reciters"
      className="mx-auto max-w-[1500px] scroll-mt-24 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mb-14 text-center">
              <h2 className="font-sans text-[clamp(2rem,1.55rem+0.7vw,2.6rem)] font-medium tracking-tight text-mist">
          {dict.reciters.title}
        </h2>
              <p className="mx-auto mt-3 max-w-3xl text-[clamp(0.95rem,0.78rem+0.25vw,1.1rem)] leading-relaxed text-mist-dim">
          {dict.reciters.subtitle.includes("master voices")
            ? `${reciters.length} master voices — tap to select, press play to listen`
            : dict.reciters.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-12">
        {reciters.map((r, i) => (
          <ReciterCard key={r.id} reciterId={r.id} index={i} />
        ))}
      </div>
    </section>
  );
}
