"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { dict } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

const LOGO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo.png`;

const NAV = [
  { href: "#reciters", label: dict.nav.reciters },
  { href: "#surahs", label: dict.nav.surahs },
  { href: "#atmosphere", label: dict.nav.atmosphere },
  { href: "#now-playing", label: dict.nav.nowPlaying },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-500",
        scrolled ? "border-transparent bg-ink/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 pt-[env(safe-area-inset-top)] lg:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label={dict.brand}>
          <Image src={LOGO_SRC} alt={dict.brand} width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-display text-lg tracking-wide text-mist">{dict.brand}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-mist-dim transition-colors duration-300 hover:text-mist"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#now-playing"
          className="glass rounded-full px-4 py-2 text-sm text-mist transition-all duration-300 hover:border-gold/40 hover:text-gold-soft md:hidden"
        >
          {dict.nav.nowPlaying}
        </a>
      </div>
    </motion.header>
  );
}
