"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      eagleRef.current,
      { x: -40, y: 30, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <div className="relative md:mt-10">
        {/* the card itself — overflow-hidden clips only its own background decoration */}
        <div className="relative overflow-hidden rounded-card bg-primary px-8 py-12 md:py-8 md:pl-56 flex flex-col md:flex-row-reverse items-center justify-between gap-8 shadow-xl">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-32 w-56 h-56 rounded-full bg-highlight/10 translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-white/4 -translate-x-1/3 -translate-y-1/2 pointer-events-none" />

          {/* content — right */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col items-start gap-5 max-w-lg"
          >
            <h2 className="text-3xl md:text-5xl text-white leading-tight">
              Dress them for every
              <br />
              <span className="text-highlight">adventure.</span>
            </h2>
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              From first steps to big-kid energy — moms-promise has playful, durable
              apparel for every stage. Explore our full collection and find the
              perfect fit for your little one.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-chip bg-highlight px-6 py-3 text-sm font-semibold text-black  transition-colors"
              >
                Shop all products <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?availability=in_stock"
                className="flex items-center gap-2 rounded-chip border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white transition-colors"
              >
                In stock now
              </Link>
            </div>
          </div>
        </div>

        {/* eagle mascot — sibling of the card, so it can overflow past its edge; now on the left */}
        <div
          ref={eagleRef}
          className="hidden md:block absolute z-20 bottom-0 left-6 lg:left-48 w-48 lg:w-64 pointer-events-none"
        >
          <Image
            src="/boy.svg"
            alt="moms-promise eagle mascot"
            width={1000}
            height={1000}
            className="w-180 h-full drop-shadow-2xl -translate-y-6 lg:-translate-y-28"
          />
        </div>
      </div>
    </section>
  );
}
