"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.set(contentRef.current, { height: "auto" });
      const h = contentRef.current.offsetHeight;
      gsap.fromTo(
        contentRef.current,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.25, ease: "power2.out" },
      );
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
    gsap.to(chevronRef.current, {
      rotate: isOpen ? 180 : 0,
      duration: 0.2,
    });
  }, [isOpen]);

  return (
    <div className="border-b border-foreground/10 py-3">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown
          ref={chevronRef}
          size={16}
          className="text-foreground/50"
        />
      </button>
      <div ref={contentRef} className="overflow-hidden">
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}
