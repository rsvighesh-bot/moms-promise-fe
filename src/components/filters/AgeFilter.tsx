"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSection } from "./FilterSection";
import { shopByAgeApi } from "@/lib/api/shopByAge";
import type { ShopByAgeGroup } from "@/lib/api/shopByAge";

export function AgeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAge = searchParams.get("age");

  const [ageGroups, setAgeGroups] = useState<ShopByAgeGroup[]>([]);

  useEffect(() => {
    shopByAgeApi
      .getAll()
      .then(setAgeGroups)
      .catch(() => setAgeGroups([]));
  }, []);

  if (ageGroups.length === 0) return null;

  const toggle = (age: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeAge === age) params.delete("age");
    else params.set("age", age);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterSection title="Age">
      <div className="grid grid-cols-2 gap-2">
        {ageGroups.map((group) => (
          <button
            key={group._id}
            onClick={() => toggle(group.label)}
            className={`rounded-chip border-2 px-3 py-1.5 text-xs font-medium transition-all ${
              activeAge === group.label
                ? "border-primary bg-primary/10 text-primary"
                : "border-foreground/15 text-foreground hover:border-primary/40"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>
    </FilterSection>
  );
}
