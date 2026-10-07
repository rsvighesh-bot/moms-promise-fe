"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { formatPrice } from "@/lib/utils/currency";
import { useSearch } from "@/lib/hooks/useSearch";

export function DesktopSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useSearch(debouncedQuery);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (gridRef.current && data) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
      );
    }
  }, [data]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  const products = data?.products ?? [];

  return (
    <div className="hidden md:block">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className="p-2 text-foreground hover:text-primary"
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          <div className="mx-auto max-w-5xl px-8 py-10">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-4 mb-8"
            >
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 rounded-chip border border-foreground/15 bg-white py-3 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={close}
                className="text-sm font-medium text-foreground/60 hover:text-foreground shrink-0 flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </button>
            </form>

            {debouncedQuery.trim().length > 1 && (
              <>
                {isFetching && (
                  <p className="text-sm text-foreground/40 mb-4">
                    Searching...
                  </p>
                )}

                {products.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wide mb-4">
                      {products.length} result{products.length !== 1 ? "s" : ""}
                    </p>
                    <div
                      ref={gridRef}
                      className="grid grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
                    >
                      {products.map((product) => {
                        const thumbnail = product.images?.[0];
                        return (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug}`}
                            onClick={close}
                            className="group"
                          >
                            <div className="relative aspect-3/4 w-full rounded-card overflow-hidden bg-foreground/5">
                              {thumbnail && (
                                <Image
                                  src={optimizedImageUrl(thumbnail, "w_400")}
                                  alt={product.name}
                                  fill
                                  sizes="(min-width: 1024px) 25vw, 33vw"
                                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                              )}
                            </div>
                            <p className="mt-2 text-sm font-medium text-foreground truncate">
                              {product.name}
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <p className="text-xs font-semibold text-foreground">
                                {formatPrice(product.minPrice)}
                              </p>
                              {product.discountPercent > 0 && (
                                <p className="text-xs text-foreground/40 line-through">
                                  {formatPrice(product.maxPrice)}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isFetching && products.length === 0 && (
                  <div className="py-16 text-center text-foreground/40">
                    <p className="text-base">
                      No results for &quot;{debouncedQuery}&quot;
                    </p>
                    <p className="text-sm mt-1">
                      Try a different spelling or browse by category
                    </p>
                  </div>
                )}
              </>
            )}

            {debouncedQuery.trim().length <= 1 && (
              <p className="text-center text-sm text-foreground/30 py-16">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
