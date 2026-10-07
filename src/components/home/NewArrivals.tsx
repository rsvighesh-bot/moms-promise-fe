"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api/products";
import type { ProductSummary } from "@/lib/api/products";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

import "swiper/css";
import "swiper/css/free-mode";

export function NewArrivals() {
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    productsApi
      .list({ limit: "8" })
      .then((d) => setProducts(d.products))
      .catch(() => []);
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-4xl text-foreground text-center mb-8">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 6}
            padding={isMobile ? 2 : 6}
            animationDuration={600}
          >
            Best Sellers
          </RoughNotation>
        </h2>

        <div className="flex items-center gap-3">
          {/* nav buttons — hidden on mobile, swipe gesture covers that */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous products"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next products"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <Swiper
          modules={[Autoplay, FreeMode, Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          freeMode
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={2}
          spaceBetween={12}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
          }}
          className="w-full"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
