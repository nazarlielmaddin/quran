import type { Metadata, Viewport } from "next";
import { Amiri, Fraunces, Inter, Lora } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/lib/audio/player-context";
import { LocaleProvider } from "@/lib/i18n";
import { dict } from "@/lib/dictionaries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `${dict.brand} — ${dict.footer.tagline}`,
  description: dict.hero.subtitle,
};

export const viewport: Viewport = {
  themeColor: "#08080b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="az"
      dir="ltr"
      className={`${inter.variable} ${fraunces.variable} ${lora.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-mist">
        <LocaleProvider>
          <PlayerProvider>{children}</PlayerProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
