"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RoughNotation } from "react-rough-notation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { reviewsApi } from "@/lib/api/reviews";
import type { Review } from "@/lib/api/reviews";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

import "swiper/css";
import "swiper/css/free-mode";

export function ReviewsSection() {
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    reviewsApi
      .getAll()
      .then(setReviews)
      .catch(() => setReviews([]));
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (reviews.length === 0) return null;

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
            What Parents Say
          </RoughNotation>
        </h2>

        {/* nav buttons — hidden on mobile, swipe gesture covers that */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous reviews"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next reviews"
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
          loop={reviews.length > 3}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={1.1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="w-full"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id} className="h-auto">
              <div className="h-full flex flex-col rounded-card border border-foreground/10 bg-white p-5">
                <Quote size={24} className="text-highlight mb-2 shrink-0" />
                <p className="text-sm text-foreground/70 leading-relaxed flex-1">
                  {review.reviewText}
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-foreground/10">
                  <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary/10">
                    {review.customerImage ? (
                      <Image
                        src={optimizedImageUrl(review.customerImage, "w_100")}
                        alt={review.customerName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                        {review.customerName[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {review.customerName}
                    </p>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
