"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RoughNotation } from "react-rough-notation";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { comboOffersApi } from "@/lib/api/comboOffers";
import type { ComboOfferSummary } from "@/lib/api/comboOffers";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

export function ComboOffersSection() {
  const [show, setShow] = useState(false);
  const [offers, setOffers] = useState<ComboOfferSummary[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    comboOffersApi
      .getAll()
      .then(setOffers)
      .catch(() => setOffers([]));
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (offers.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl text-foreground text-center mb-8">
          <RoughNotation
            type="underline"
            show={show}
            color="var(--color-highlight)"
            strokeWidth={isMobile ? 2 : 4}
            padding={isMobile ? 2 : 4}
            animationDuration={600}
          >
            Combo Offers
          </RoughNotation>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {offers.map((offer) => (
            <Link
              key={offer._id}
              href={`/combo/${offer.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-card bg-foreground/5"
            >
              <Image
                src={optimizedImageUrl(offer.imageUrl)}
                alt={offer.name}
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
