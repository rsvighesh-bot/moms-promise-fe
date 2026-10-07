"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { RoughNotation } from "react-rough-notation";
import { Leaf, Palette, Scissors, Recycle } from "lucide-react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUALITIES = [
  {
    icon: Leaf,
    title: "100% Breathable Cotton",
    desc: "Soft on skin, tough on adventure — every piece is made from natural breathable fabrics.",
  },
  {
    icon: Palette,
    title: "Skin-Safe Dyes",
    desc: "Non-toxic, OEKO-TEX certified colours that stay vibrant wash after wash.",
  },
  {
    icon: Scissors,
    title: "Double-Stitched Seams",
    desc: "Built to survive every climb, roll, and tumble your little one can throw at it.",
  },
  {
    icon: Recycle,
    title: "Thoughtfully Made",
    desc: "Responsible sourcing, minimal waste, packaging that doesn't cost the earth.",
  },
];

const CONFETTI_SHAPES = ["circle", "square", "triangle"] as const;
const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-highlight)",
  "var(--color-accent)",
  "#d4d4d4",
];

// --- hand-drawn corner doodles — all soft/rounded, no sharp points --------
function DoodleBoat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 32 C 6 32, 12 42, 30 42 C 48 42, 54 32, 54 32 L48 32 L12 32 Z"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M30 32 L30 8"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M30 10 C 40 13, 40 22, 30 26 Z"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M2 40 C 6 37, 10 43, 14 40 S 22 37, 26 40"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
      />
    </svg>
  );
}

function DoodleCloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 26 C 6 26, 4 16, 12 14 C 12 6, 24 4, 28 10 C 36 6, 46 12, 42 20 C 50 20, 50 28, 42 28 L14 28 Z"
        stroke="var(--color-highlight)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleSquiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 10 C 10 -2, 18 22, 26 10 S 42 -2, 50 10 S 58 18, 58 10"
        stroke="var(--color-primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleSun({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="25"
        cy="25"
        r="10"
        stroke="var(--color-highlight)"
        strokeWidth={2.5}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="25"
          y1="4"
          x2="25"
          y2="10"
          stroke="var(--color-highlight)"
          strokeWidth={2.5}
          strokeLinecap="round"
          transform={`rotate(${deg} 25 25)`}
        />
      ))}
    </svg>
  );
}

function DoodleHeart({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22 36 C 4 24, 2 12, 12 6 C 18 3, 22 8, 22 12 C 22 8, 26 3, 32 6 C 42 12, 40 24, 22 36 Z"
        stroke="var(--color-primary)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="25"
        cy="12"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth={2.2}
      />
      <circle
        cx="38"
        cy="25"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth={2.2}
      />
      <circle
        cx="25"
        cy="38"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth={2.2}
      />
      <circle
        cx="12"
        cy="25"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth={2.2}
      />
      <circle
        cx="25"
        cy="25"
        r="5"
        stroke="var(--color-accent)"
        strokeWidth={2.2}
      />
    </svg>
  );
}

function DoodleBalloon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 54"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse
        cx="17"
        cy="17"
        rx="14"
        ry="16"
        stroke="var(--color-highlight)"
        strokeWidth={2.5}
      />
      <path
        d="M17 33 C 20 36, 14 38, 17 42 C 20 46, 14 46, 17 50"
        stroke="var(--color-highlight)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
// ---------------------------------------------------------------------------

export function QualitySection() {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();
  const eagleRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const burstContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!eagleRef.current || !cardsRef.current) return;

    gsap.fromTo(
      eagleRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: eagleRef.current,
          start: "top 85%",
        },
      },
    );

    gsap.fromTo(
      cardsRef.current.children,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
        },
      },
    );
  }, []);

  const handleEagleClick = () => {
    const container = burstContainerRef.current;
    if (!container) return;

    const count = 18;
    for (let i = 0; i < count; i++) {
      const shape =
        CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
      const color =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 8 + Math.random() * 6;

      const originXPct = 25 + Math.random() * 50;
      const originYPct = 20 + Math.random() * 55;

      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = `${originXPct}%`;
      el.style.top = `${originYPct}%`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundColor = color;
      el.style.opacity = "1";
      el.style.pointerEvents = "none";
      el.style.willChange = "transform, opacity";

      if (shape === "circle") {
        el.style.borderRadius = "9999px";
      } else if (shape === "triangle") {
        el.style.width = "0";
        el.style.height = "0";
        el.style.backgroundColor = "transparent";
        el.style.borderLeft = `${size / 2}px solid transparent`;
        el.style.borderRight = `${size / 2}px solid transparent`;
        el.style.borderBottom = `${size}px solid ${color}`;
      } else {
        el.style.borderRadius = "3px";
      }

      container.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 45;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 16;
      const duration = 1 + Math.random() * 0.4;

      const tl = gsap.timeline({
        onComplete: () => el.remove(),
      });

      tl.fromTo(
        el,
        { x: 0, y: 0, scale: 0, rotate: 0 },
        {
          x,
          y,
          scale: 1,
          rotate: (Math.random() - 0.5) * 220,
          duration,
          ease: "power2.out",
        },
        0,
      );
      tl.fromTo(
        el,
        { opacity: 1 },
        { opacity: 0, duration: duration * 0.45, ease: "power1.in" },
        duration * 0.55,
      );
    }

    if (eagleRef.current) {
      gsap.fromTo(
        eagleRef.current,
        { scale: 1 },
        {
          scale: 1.04,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
      );
    }
  };

  const handleEagleEnter = () => {
    if (!hoverRef.current) return;
    gsap.to(hoverRef.current, {
      rotate: -3,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleEagleLeave = () => {
    if (!hoverRef.current) return;
    gsap.to(hoverRef.current, {
      rotate: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <section className="relative bg-primary/5 py-14 overflow-hidden mt-10">
      {/* corner doodles — decorative, ignored by screen readers, soft/rounded shapes only */}
      <DoodleCloud className="block absolute top-6 left-4 w-14 h-9 opacity-40 sm:top-8 sm:left-6 sm:w-16 sm:h-10" />
      <DoodleSun className="block absolute top-10 right-6 w-10 h-10 opacity-35 sm:top-10 sm:right-10 sm:w-14 sm:h-14" />
      <DoodleBoat className="hidden sm:block absolute bottom-6 left-10 w-16 h-14 opacity-35 rotate-3" />
      <DoodleSquiggle className="block absolute bottom-8 right-4 w-14 h-5 opacity-40 sm:bottom-10 sm:right-16 sm:w-16 sm:h-6" />
      <DoodleHeart className="hidden md:block absolute bottom-24 right-1/3 w-9 h-8 opacity-30 rotate-6" />
      <DoodleFlower className="hidden lg:block absolute top-1/2 left-4 w-10 h-10 opacity-30 -translate-y-1/2" />
      <DoodleBalloon className="hidden md:block absolute top-16 left-1/3 w-8 h-12 opacity-30 -rotate-6" />
      <DoodleCloud className="hidden lg:block absolute bottom-10 left-1/4 w-12 h-8 opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl text-foreground text-center mb-10">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 4}
            padding={isMobile ? 2 : 4}
            animationDuration={600}
          >
            About Us
          </RoughNotation>
        </h2>

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 order-2 md:order-1"
          >
            {QUALITIES.map((q) => (
              <div
                key={q.title}
                className="rounded-card bg-white p-5 shadow-sm border border-foreground/5 flex gap-4 items-start"
              >
                <span className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <q.icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {q.title}
                  </p>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    {q.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={eagleRef}
            className="relative shrink-0 flex flex-col items-center gap-3 order-1 md:order-2"
          >
            <div
              ref={hoverRef}
              className="relative w-40 md:w-56 drop-shadow-lg cursor-pointer select-none"
              onClick={handleEagleClick}
              onMouseEnter={handleEagleEnter}
              onMouseLeave={handleEagleLeave}
            >
              <div
                ref={burstContainerRef}
                className="absolute inset-0 z-0 pointer-events-none overflow-visible"
              />
              <Image
                src="/girl.svg"
                alt="moms-promise eagle mascot"
                width={324}
                height={540}
                unoptimized
                className="relative z-10 w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
