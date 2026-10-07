"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { X, Volume2, VolumeX, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import type { ShopVideo } from "@/lib/api/shopVideos";

import "swiper/css";

interface Props {
  videos: ShopVideo[];
  initialIndex: number;
  onClose: () => void;
}

export function ShopVideoViewer({ videos, initialIndex, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Lock page scroll while the viewer is open, and let Escape close it.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Only the active slide's video actually plays — every other one pauses,
  // so we're never running 8 videos at once.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = isMuted;
    });
  }, [isMuted]);

  const handleSwiper = (swiper: SwiperType) => {
    swiper.on("slideChange", () => setActiveIndex(swiper.activeIndex));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* The "phone frame" — full-bleed on mobile, a fixed 9:16 column
          (matching the video's own shape) centered on desktop. Width is
          computed directly from viewport height (9/16 = 0.5625) rather
          than via `aspect-ratio`, which doesn't reliably derive an "auto"
          width from a percentage height on a flex item across browsers.
          Every control below lives inside this same box, so nothing
          floats out at the edges of a wide browser window. */}
      <div className="relative h-full w-full sm:w-[56.25vh] sm:max-w-full sm:mx-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X size={20} />
        </button>

        <button
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <Swiper
          modules={[Mousewheel]}
          direction="vertical"
          mousewheel={{ forceToAxis: true }}
          initialSlide={initialIndex}
          onSwiper={handleSwiper}
          className="h-full w-full"
        >
          {videos.map((video, i) => (
            <SwiperSlide key={video._id} className="relative bg-black">
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={video.videoUrl}
                className="h-full w-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onClick={(e) => {
                  const el = e.currentTarget;
                  if (el.paused) {
                    el.play().catch(() => {});
                  } else {
                    el.pause();
                  }
                }}
              />

              {video.caption && (
                <p className="absolute bottom-24 left-4 right-20 z-10 text-sm text-white drop-shadow">
                  {video.caption}
                </p>
              )}

              {video.productId && (
                <Link
                  href={`/product/${video.productId.slug}`}
                  className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-3 rounded-card bg-white/95 p-3"
                >
                  <div className="relative h-12 w-10 shrink-0 rounded-md overflow-hidden bg-foreground/5">
                    {video.productId.images?.[0] && (
                      <Image
                        src={optimizedImageUrl(video.productId.images[0], "w_100")}
                        alt={video.productId.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {video.productId.name}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(video.productId.sellingPrice)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 shrink-0 rounded-chip bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                    <ShoppingBag size={13} /> Shop Now
                  </span>
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
