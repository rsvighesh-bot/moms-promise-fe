"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={!hasPrevPage}
        className="p-2 rounded-full disabled:opacity-30 hover:bg-foreground/5"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm text-foreground/70">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => goToPage(page + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-full disabled:opacity-30 hover:bg-foreground/5"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}