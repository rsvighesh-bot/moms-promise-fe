"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { RoughNotation } from "react-rough-notation";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { shopByAgeApi } from "@/lib/api/shopByAge";
import type { ShopByAgeGroup } from "@/lib/api/shopByAge";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

import "swiper/css";
import "swiper/css/free-mode";

// cycle through theme colors for a playful, varied look
const CHIP_COLORS = [
  "bg-primary/10 group-hover:bg-primary/15",
  "bg-accent/10 group-hover:bg-accent/15",
  "bg-highlight/20 group-hover:bg-highlight/25",
];

export function ShopByAge() {
  const [show, setShow] = useState(false);
  const [ageGroups, setAgeGroups] = useState<ShopByAgeGroup[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    shopByAgeApi
      .getAll()
      .then(setAgeGroups)
      .catch(() => setAgeGroups([]));
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (ageGroups.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl text-foreground text-center mb-6">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 4}
            padding={isMobile ? 2 : 4}
            animationDuration={600}
          >
            Shop by Age
          </RoughNotation>
        </h2>

        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={3.2}
          spaceBetween={8}
          breakpoints={{
            480: { slidesPerView: 4.2, spaceBetween: 10 },
            768: { slidesPerView: 5.2, spaceBetween: 12 },
            1024: { slidesPerView: 6.2, spaceBetween: 14 },
            1280: { slidesPerView: 7.2, spaceBetween: 16 },
          }}
          className="w-full"
        >
          {ageGroups.map((group, i) => (
            <SwiperSlide key={group._id}>
              <Link
                href={
                  group.linkUrl ||
                  `/products?age=${encodeURIComponent(group.label)}`
                }
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent transition-all duration-200 group-hover:-translate-y-1 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                >
                  {group.imageUrl ? (
                    <Image
                      src={optimizedImageUrl(group.imageUrl)}
                      alt={group.label}
                      fill
                      sizes="(min-width: 768px) 128px, 96px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    // No image configured yet for this age group — fall back
                    // to a plain text chip instead of leaving a broken tile.
                    <span className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight px-1 text-center">
                      {group.label}
                    </span>
                  )}
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors text-center max-w-28">
                  {group.label}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
