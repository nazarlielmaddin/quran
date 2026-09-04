"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bird, Cat, CloudLightning, CloudRain, Droplets, Flame, Home, Moon,
  Mountain, Pause, Play, Trees, Waves, Wind, AudioWaveform, CloudFog,
} from "lucide-react";
import { ambientSounds, getAmbientSound } from "@/data/ambientSounds";
import { usePlayer, usePlayback } from "@/lib/audio/player-context";
import { useLocale } from "@/lib/i18n";
import { dict } from "@/lib/dictionaries";
import { cn, getLocalized } from "@/lib/utils";
import { Waveform } from "@/components/Waveform";

const ICONS: Record<string, typeof CloudRain> = {
  rain: CloudRain,
  heavyRain: CloudRain,
  thunder: CloudLightning,
  wind: Wind,
  ocean: Waves,
  river: Droplets,
  water: Droplets,
  forest: Trees,
  birds: Bird,
  night: Moon,
  fireplace: Flame,
  cat: Cat,
  room: Home,
  whiteNoise: AudioWaveform,
  brownNoise: CloudFog,
  deepNoise: CloudFog,
};

function AmbientCard({ soundId }: { soundId: string }) {
  const sound = getAmbientSound(soundId)!;
  const Icon = ICONS[sound.id] ?? Mountain;
  const { soundId: activeId, selectAmbient, toggleAmbient } = usePlayer();
  const { ambientPlaying } = usePlayback();
  const { locale } = useLocale();
  const active = activeId === sound.id;
  const playing = active && ambientPlaying;
  const displayName = getLocalized(sound, "name", locale);
  // Photo thumbnail — falls back to the gradient + icon if it fails to load
  const [imgOk, setImgOk] = useState(true);
  const showPhoto = !!sound.imageUrl && imgOk;

  const handleClick = () => {
    if (active) toggleAmbient();
    else selectAmbient(sound.id);
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={active}
      aria-label={`${displayName} — ${active ? dict.atmosphere.on : dict.atmosphere.off}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-500",
        active
          ? "border-gold/50 bg-white/[0.06] shadow-[0_0_50px_-18px_rgba(200,169,124,0.4)]"
          : "border-line bg-white/[0.03] hover:border-line hover:bg-white/[0.05]",
      )}
    >
      {/* Photo thumbnail (gradient + icon stay behind as loading/fallback layer) */}
      <div
        className="animate-shimmer relative flex aspect-[16/9] items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(110% 110% at 30% 15%, ${sound.gradient[0]}55 0%, ${sound.gradient[1]} 75%)`,
        }}
      >
        {showPhoto ? (
          <img
            src={sound.imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover brightness-[.68] transition-all duration-700 group-hover:scale-105 group-hover:brightness-[.85]"
          />
        ) : (
          <Icon className="h-8 w-8 text-mist/70 transition-transform duration-700 group-hover:scale-110" strokeWidth={1.2} />
        )}
        {/* Readability shade over the photo for the play chip */}
        {showPhoto && <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />}

        {/* Play/pause chip */}
        <span
          className={cn(
            "absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300",
            playing ? "bg-gold text-ink" : "bg-black/40 text-mist group-hover:bg-gold/90 group-hover:text-ink",
          )}
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 translate-x-[1px] fill-current" />}
        </span>

        {playing && <Waveform bars={4} playing className="absolute top-3 right-3 h-4" />}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <span className={cn("text-sm", active ? "text-gold-soft" : "text-mist")}>{displayName}</span>
      </div>
    </motion.button>
  );
}

export function AmbientSelector() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28 lg:px-8 lg:py-36">
      <div id="atmosphere" className="mb-14 scroll-mt-20 text-center">
        <h2 className="font-display text-4xl text-mist lg:text-5xl">{dict.atmosphere.title}</h2>
        <p className="mt-4 text-mist-dim">{dict.atmosphere.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ambientSounds.map((s) => (
          <AmbientCard key={s.id} soundId={s.id} />
        ))}
      </div>
    </section>
  );
}