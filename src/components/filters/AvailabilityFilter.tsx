"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSection } from "./FilterSection";

export function AvailabilityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAvailability = searchParams.get("availability");
  const isActive = activeAvailability === "in_stock";

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) params.delete("availability");
    else params.set("availability", "in_stock");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterSection title="Availability" defaultOpen={false}>
      <button
        onClick={toggle}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-all ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/80 hover:bg-foreground/5"
        }`}
      >
        <div
          className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
            isActive ? "border-primary bg-primary" : "border-foreground/30"
          }`}
        >
          {isActive && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        In stock only
      </button>
    </FilterSection>
  );
}
