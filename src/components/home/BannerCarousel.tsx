"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/api/banners";

import "swiper/css";
import "swiper/css/pagination";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!Array.isArray(banners) || banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden h-48 md:h-135">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={banners.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-full w-full banner-swiper"
      >
        {banners.map((banner) => {
          const img = (
            <Image
              src={banner.imageUrl}
              alt={banner.title || "Promotional banner"}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          );

          return (
            <SwiperSlide key={banner._id} className="relative">
              {banner.linkUrl ? (
                <Link
                  href={banner.linkUrl}
                  className="block h-full w-full relative"
                >
                  {img}
                </Link>
              ) : (
                <div className="h-full w-full relative">{img}</div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-foreground shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-foreground shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </section>
  );
}
