"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api/products";
import type { ProductSummary } from "@/lib/api/products";

import "swiper/css";
import "swiper/css/free-mode";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function SuggestedForYou() {
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    productsApi
      .list({ limit: "5" })
      .then((d) => setProducts(shuffle(d.products).slice(0, 10)))
      .catch(() => []);
    const t = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-4xl text-foreground">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 6}
            padding={isMobile ? 2 : 6}
            animationDuration={600}
          >
            Suggested for You
          </RoughNotation>
        </h2>

        <Link
          href="/products"
          className="text-sm font-semibold text-accent hover:underline shrink-0"
        >
          View all
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <Swiper
          modules={[Autoplay, FreeMode]}
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
            480: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4.2, spaceBetween: 16 },
            1280: { slidesPerView: 5.2, spaceBetween: 16 },
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
