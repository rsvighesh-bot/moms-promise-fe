"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgeFilter } from "./AgeFilter";
import { ColorFilter } from "./ColorFilter";
import { PriceFilter } from "./PriceFilter";
import { AvailabilityFilter } from "./AvailabilityFilter";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

export function FilterSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters =
    searchParams.get("age") ||
    searchParams.get("color") ||
    searchParams.get("availability") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  const clearAll = () => router.push(pathname);

  const filterContent = (
    <>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="w-full mb-3 flex items-center justify-center gap-1.5"
        >
          <X size={14} /> Clear all filters
        </Button>
      )}
      <AgeFilter />
      <PriceFilter />
      <ColorFilter />
      <AvailabilityFilter />
    </>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 rounded-card border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground"
      >
        <SlidersHorizontal size={16} />
        Filters
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-accent" />
        )}
      </button>

      {/* Mobile drawer */}
      <MobileFilterDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {filterContent}
      </MobileFilterDrawer>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">{filterContent}</aside>
    </>
  );
}
