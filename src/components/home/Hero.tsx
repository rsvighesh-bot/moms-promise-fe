"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

const SHORTCUTS = [
  { label: "Boys", href: "/products?category=Boys", emoji: "🧢" },
  { label: "Girls", href: "/products?category=Girls", emoji: "🎀" },
  { label: "Unisex", href: "/products?category=Unisex", emoji: "⭐" },
];

export function Hero() {
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chipsRef.current) return;
    gsap.fromTo(
      chipsRef.current.children,
      { opacity: 0, y: 16, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(2)",
        delay: 0.2,
      },
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-highlight/20">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-6xl text-primary leading-tight">
            Play loud.
            <br />
            Dress louder.
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground/70 max-w-md">
            Comfy, colourful apparel made for kids who don't sit still — ages 2
            to 10.
          </p>

          <div ref={chipsRef} className="mt-7 flex flex-wrap gap-3">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center gap-2 rounded-chip bg-white px-5 py-3 shadow-sm border border-foreground/10 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <span className="text-lg">{s.emoji}</span>
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative h-64 md:h-96 rounded-card overflow-hidden">
          <Image
            src="/hero-kids.jpg"
            alt="Kids wearing moms-promise apparel"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* decorative blob accents, quiet, not competing with the chips */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 pointer-events-none" />
      <div className="absolute top-10 -right-16 w-56 h-56 rounded-full bg-primary/10 pointer-events-none" />
    </section>
  );
}
