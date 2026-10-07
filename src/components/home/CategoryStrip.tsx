"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RoughNotation } from "react-rough-notation";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { categoriesApi } from "@/lib/api/categories";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { Category } from "@/lib/api/categories";

export function CategoryStrip() {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]));
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl md:text-4xl text-foreground text-center mb-8">
        <RoughNotation
          type="underline"
          show={show}
          color="var(--color-highlight)"
          strokeWidth={isMobile ? 2 : 4}
          padding={isMobile ? 2 : 4}
          animationDuration={600}
        >
          Shop by Category
        </RoughNotation>
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/products?categoryId=${cat._id}&category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative h-24 w-24 md:h-42 md:w-42 rounded-2xl overflow-hidden bg-foreground/5 ring-2 ring-transparent transition-all duration-200">
              {cat.imageUrl ? (
                <Image
                  src={optimizedImageUrl(cat.imageUrl)}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 768px) 168px, 96px"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">
                  {cat.name[0]}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/30 to-transparent px-2 pt-6 pb-1.5">
                <p className="text-xs md:text-sm font-semibold text-white text-center truncate">
                  {cat.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
