"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSection } from "./FilterSection";

const MIN_PRICE = 0;
const MAX_PRICE = 5000;

export function PriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localMin, setLocalMin] = useState(
    Number(searchParams.get("minPrice") || MIN_PRICE * 100) / 100,
  );
  const [localMax, setLocalMax] = useState(
    Number(searchParams.get("maxPrice") || MAX_PRICE * 100) / 100,
  );

  const minPercent = ((localMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((localMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(localMin * 100)); // rupees → paise
    params.set("maxPrice", String(localMax * 100));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterSection title="Price">
      <div className="px-3">
        <div className="flex justify-between text-xs text-foreground/60 mb-3">
          <span>₹{localMin}</span>
          <span>₹{localMax}</span>
        </div>

        <div className="relative h-1.5 rounded-full bg-foreground/15">
          {/* filled track */}
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />

          {/* min range input */}
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={localMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), localMax - 100);
              setLocalMin(val);
            }}
            className="range-thumb absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {/* max range input */}
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={localMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), localMin + 100);
              setLocalMax(val);
            }}
            className="range-thumb absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* min thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-white shadow pointer-events-none z-30"
            style={{ left: `calc(${minPercent}% - 8px)` }}
          />

          {/* max thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-white shadow pointer-events-none z-30"
            style={{ left: `calc(${maxPercent}% - 8px)` }}
          />
        </div>

        <button
          onClick={apply}
          className="mt-4 w-full rounded-card border border-primary py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          Apply Price
        </button>
      </div>

      <style jsx>{`
        .range-thumb {
          pointer-events: none;
        }
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border: none;
        }
      `}</style>
    </FilterSection>
  );
}
