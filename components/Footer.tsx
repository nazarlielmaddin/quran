import Image from "next/image";
import { dict } from "@/lib/dictionaries";
import { DevelopedBy } from "@/components/DevelopedBy";

const LOGO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo.png`;

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line-soft px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2.5">
            <Image src={LOGO_SRC} alt={dict.brand} width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-display text-lg text-mist">{dict.brand}</span>
          </div>
          <p className="text-sm leading-relaxed text-mist-dim">{dict.footer.madeWith}</p>
        </div>

        <p className="mt-12 border-t border-line-soft pt-6 text-center text-[11px] text-mist-faint">
          © {new Date().getFullYear()} {dict.brand} · {dict.footer.tagline}
        </p>

        <DevelopedBy className="mt-4 text-center" />
      </div>
    </footer>
  );
}