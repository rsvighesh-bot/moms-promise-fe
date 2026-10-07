"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSection } from "./FilterSection";

const COLOR_OPTIONS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Navy", hex: "#1B3A6B" },
  { name: "Red", hex: "#E53E3E" },
  { name: "Pink", hex: "#F687B3" },
  { name: "Yellow", hex: "#FED41F" },
  { name: "Orange", hex: "#F77620" },
  { name: "Green", hex: "#38A169" },
  { name: "Sky Blue", hex: "#1BA2E6" },
  { name: "Purple", hex: "#805AD5" },
  { name: "Beige", hex: "#F5DEB3" },
  { name: "Grey", hex: "#A0AEC0" },
];

export function ColorFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeColor = searchParams.get("color");

  const toggle = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeColor === name) params.delete("color");
    else params.set("color", name);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterSection title="Color">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {COLOR_OPTIONS.map((c) => {
          const isActive = activeColor === c.name;
          return (
            <button
              key={c.name}
              onClick={() => toggle(c.name)}
              title={c.name}
              className={`flex flex-col items-center gap-1 w-14 py-2 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-foreground/15"
              }`}
            >
              <span
                className="h-8 w-8 rounded-full border border-foreground/20"
                style={{ backgroundColor: c.hex }}
              />
              <span
                className={`text-[10px] leading-tight text-center transition-colors ${
                  isActive ? "font-semibold text-primary" : "text-foreground/60"
                }`}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {activeColor && (
        <p className="mt-3 text-[11px] leading-snug text-foreground/40">
          Shown swatch is a representative shade of{" "}
          <span className="font-medium text-foreground/60">{activeColor}</span>{" "}
          — actual product color may vary slightly.
        </p>
      )}
    </FilterSection>
  );
}
