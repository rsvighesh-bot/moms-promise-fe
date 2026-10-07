"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { RoughNotation } from "react-rough-notation";
import { ChevronLeft, ChevronRight, Play, ShoppingBag } from "lucide-react";
import { optimizedImageUrl, videoThumbnail } from "@/lib/utils/cloudinary";
import { shopVideosApi } from "@/lib/api/shopVideos";
import type { ShopVideo } from "@/lib/api/shopVideos";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { ShopVideoViewer } from "./ShopVideoViewer";

import "swiper/css";
import "swiper/css/free-mode";

export function ShopVideosSection() {
  const [show, setShow] = useState(false);
  const [videos, setVideos] = useState<ShopVideo[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    shopVideosApi
      .getAll()
      .then(setVideos)
      .catch(() => setVideos([]));
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (videos.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-4xl text-foreground">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 4}
            padding={isMobile ? 2 : 4}
            animationDuration={600}
          >
            Shop the Look
          </RoughNotation>
        </h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous videos"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next videos"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <Swiper
          modules={[Autoplay, FreeMode, Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          freeMode
          loop={videos.length > 4}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={2.2}
          spaceBetween={12}
          breakpoints={{
            480: { slidesPerView: 2.6 },
            768: { slidesPerView: 3.6 },
            1024: { slidesPerView: 4.6 },
            1280: { slidesPerView: 5.6 },
          }}
          className="w-full"
        >
          {videos.map((video, i) => (
            <SwiperSlide key={video._id}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                onMouseEnter={() => setHoveredId(video._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative block aspect-9/16 w-full overflow-hidden rounded-card bg-foreground/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizedImageUrl(videoThumbnail(video.videoUrl), "w_400")}
                  alt={video.caption || "Shop video"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />

                {/* Desktop hover preview — only mounted (and its src loaded)
                    once actually hovered, so all 8 tiles don't fetch video
                    just for sitting in the strip. */}
                {hoveredId === video._id && (
                  <video
                    src={video.videoUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {hoveredId !== video._id && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground">
                      <Play size={16} className="ml-0.5 fill-current" />
                    </span>
                  </div>
                )}

                {video.productId && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-chip bg-white/90 px-2 py-1 text-[10px] font-semibold text-foreground">
                    <ShoppingBag size={11} /> Shop
                  </span>
                )}

                {video.caption && (
                  <p className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 to-transparent px-2 pt-6 pb-2 text-left text-xs text-white truncate">
                    {video.caption}
                  </p>
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {openIndex !== null && (
        <ShopVideoViewer
          videos={videos}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
