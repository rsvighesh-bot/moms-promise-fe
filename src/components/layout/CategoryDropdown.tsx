"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useSubCategories } from "@/lib/hooks/useCategoriesWithSubs";
import type { Category } from "@/lib/api/categories";

export function CategoryDropdown({
  category,
  rotate = -1.5,
}: {
  category: Category;
  rotate?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: subCategories = [] } = useSubCategories(category._id, isOpen);

  const animateOpen = () => {
    requestAnimationFrame(() => {
      if (!panelRef.current) return;

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -12, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.8)",
        },
      );

      const items = panelRef.current.querySelectorAll("[data-pop-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.035,
          delay: 0.05,
        },
      );
    });

    gsap.to(chevronRef.current, {
      rotate: 180,
      duration: 0.5,
      ease: "back.out(3)",
    });
  };

  const animateClose = () => {
    gsap.to(chevronRef.current, {
      rotate: 0,
      duration: 0.25,
      ease: "power2.out",
    });

    if (!panelRef.current) {
      setRender(false);
      return;
    }
    gsap.to(panelRef.current, {
      opacity: 0,
      y: -8,
      scale: 0.96,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setRender(false),
    });
  };

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!isOpen) {
      setIsOpen(true);
      setRender(true);
      requestAnimationFrame(animateOpen);
    }
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      animateClose();
    }, 150);
  };

  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(false);
    animateClose();
  };

  const toggle = () => (isOpen ? closeNow() : open());

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      closeNow();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    // no "relative" here on purpose — the panel below anchors to the
    // nearest positioned ancestor, which is the nav row in Header.tsx,
    // so every dropdown lands in the exact same spot
    <div onMouseEnter={open} onMouseLeave={scheduleClose}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        style={{ transform: isOpen ? "none" : `rotate(${rotate}deg)` }}
        className="relative flex items-center gap-1 text-sm font-medium text-foreground py-2 transition-all duration-200 hover:rotate-0 hover:text-primary"
      >
        {category.name}
        <ChevronDown ref={chevronRef} size={14} />
        <span
          className={`absolute left-0 bottom-0 h-0.5 w-[calc(100%-18px)] origin-left bg-highlight transition-transform duration-300 ease-out ${
            isOpen ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>

      {render && (
        <div className="absolute top-13 left-1/2 -translate-x-1/2 z-50">
          <div
            ref={panelRef}
            onMouseEnter={open}
            onMouseLeave={scheduleClose}
            className="inline-block min-w-170 bg-white shadow-lg border border-foreground/10 rounded-card overflow-hidden origin-top"
          >
            <div className="flex">
              <div
                data-pop-item
                className="relative h-64 w-55 shrink-0 bg-foreground/5"
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-foreground/30 text-sm">
                    No image
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-charcoal/70 to-transparent px-3 py-2">
                  <span className="text-sm font-semibold text-white">
                    {category.name}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 whitespace-nowrap">
                <p
                  data-pop-item
                  className="text-xs font-semibold tracking-wide text-foreground/50 mb-4 uppercase"
                >
                  {category.name}
                </p>
                <div>
                  <Link
                    data-pop-item
                    href={`/products?categoryId=${category._id}&category=${encodeURIComponent(category.name)}`}
                    onClick={closeNow}
                    className="block mb-3 text-sm font-semibold text-primary hover:underline hover:translate-x-1 transition-transform"
                  >
                    Shop all {category.name}
                  </Link>

                  {subCategories.length === 0 ? (
                    <p data-pop-item className="text-sm text-foreground/50">
                      No subcategories yet
                    </p>
                  ) : (
                    <div className="grid grid-flow-col grid-rows-4 gap-x-6 gap-y-3">
                      {subCategories.map((sub) => (
                        <Link
                          key={sub._id}
                          data-pop-item
                          href={`/products?categoryId=${category._id}&subCategoryId=${sub._id}&category=${encodeURIComponent(category.name)}&subCategory=${encodeURIComponent(sub.name)}`}
                          onClick={closeNow}
                          className="text-sm text-foreground hover:text-primary hover:translate-x-1 transition-transform"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
