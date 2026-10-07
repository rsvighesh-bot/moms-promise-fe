"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useSubCategories } from "@/lib/hooks/useCategoriesWithSubs";
import type { Category } from "@/lib/api/categories";

function MobileCategoryItem({
  category,
  onNavigate,
}: {
  category: Category;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const { data: subCategories = [] } = useSubCategories(category._id, expanded);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    gsap.to(chevronRef.current, { rotate: next ? 180 : 0, duration: 0.2 });
  };

  useEffect(() => {
    if (!contentRef.current) return;
    if (expanded) {
      gsap.set(contentRef.current, { height: "auto" });
      const fullHeight = contentRef.current.offsetHeight;
      gsap.fromTo(
        contentRef.current,
        { height: 0 },
        { height: fullHeight, duration: 0.25, ease: "power2.out" },
      );
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [expanded, subCategories.length]);

  return (
    <div className="border-b border-foreground/10">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-base font-medium text-foreground">
          {category.name}
        </span>
        <ChevronDown ref={chevronRef} size={18} />
      </button>
      <div ref={contentRef} className="overflow-hidden h-0">
        <div className="pb-2 pl-3 flex flex-col gap-2">
          <Link
            href={`/products?categoryId=${category._id}&category=${encodeURIComponent(category.name)}`}
            onClick={onNavigate}
            className="text-sm font-semibold text-primary"
          >
            Shop all {category.name}
          </Link>
          {subCategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/products?categoryId=${category._id}&subCategoryId=${sub._id}&category=${encodeURIComponent(category.name)}&subCategory=${encodeURIComponent(sub.name)}`}
              onClick={onNavigate}
              className="text-sm text-foreground/70"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
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
      { x: "0%", duration: 0.35, ease: "power3.out" },
    );
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(panelRef.current, { x: "-100%", duration: 0.3, ease: "power3.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => setIsOpen(false),
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="md:hidden p-2 text-foreground"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-charcoal/50"
            onClick={handleClose}
          />
          <div
            ref={panelRef}
            className="absolute left-0 top-0 h-full w-72 bg-white p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl text-primary">Menu</span>
              <button onClick={handleClose} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <Link
              href="/products"
              onClick={handleClose}
              className="block py-3 text-base font-medium text-accent border-b border-foreground/10"
            >
              New Arrivals
            </Link>
            <nav>
              {categories.map((cat) => (
                <MobileCategoryItem
                  key={cat._id}
                  category={cat}
                  onNavigate={handleClose}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
