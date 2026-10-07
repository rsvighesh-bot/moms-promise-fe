"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/api/products";

import "swiper/css";

interface Props {
  products: ProductSummary[];
  title?: string;
}

export function SuggestedProducts({
  products,
  title = "You might also like",
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 border-t border-foreground/10">
      <h2 className="text-lg font-semibold text-foreground mb-5">{title}</h2>

      {/* Mobile: swipeable carousel */}
      <div className="md:hidden -mx-4 px-4">
        <Swiper slidesPerView={2.2} spaceBetween={12}>
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
