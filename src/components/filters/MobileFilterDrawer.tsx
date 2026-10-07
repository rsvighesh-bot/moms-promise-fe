"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  children,
}: MobileFilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
    );
    gsap.fromTo(
      panelRef.current,
      { x: "-100%" },
      { x: "0%", duration: 0.3, ease: "power3.out" },
    );
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      x: "-100%",
      duration: 0.25,
      ease: "power3.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-charcoal/50"
        onClick={handleClose}
      />
      <div
        ref={panelRef}
        className="absolute left-0 top-0 h-full w-80 bg-white flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <span className="font-semibold text-foreground">Filters</span>
          <button onClick={handleClose} aria-label="Close filters">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-2">{children}</div>
        <div className="px-5 py-4 border-t border-foreground/10">
          <button
            onClick={handleClose}
            className="w-full rounded-card bg-primary py-3 text-sm font-semibold text-white"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
