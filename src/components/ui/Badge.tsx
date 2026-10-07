"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "primary" | "accent" | "highlight" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  animate?: boolean; // off by default — turn on only where the pop-in should draw attention (e.g. Sale badges)
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary text-white",
  accent: "bg-accent text-white",
  highlight: "bg-highlight text-charcoal",
  neutral: "bg-foreground/10 text-foreground",
};

export function Badge({
  variant = "neutral",
  children,
  className,
  animate = false,
}: BadgeProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!animate || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { scale: 0, rotate: -8 },
        { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
      );
    },
    { scope: ref, dependencies: [animate] },
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-chip px-2 py-0.5 text-[10px] font-semibold md:px-3 md:py-1 md:text-xs",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
