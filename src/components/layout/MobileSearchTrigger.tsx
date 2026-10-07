"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { formatPrice } from "@/lib/utils/currency";
import { useSearch } from "@/lib/hooks/useSearch";

export function MobileSearchTrigger() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useSearch(debouncedQuery);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current && data) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
      );
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
  };

  const products = data?.products ?? [];

  if (isOpen) {
    return (
      <div
        ref={panelRef}
        className="absolute inset-x-0 top-0 z-50 bg-white border-b border-foreground/10 md:hidden max-h-[85vh] overflow-y-auto flex flex-col"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 shrink-0"
        >
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for kids' wear..."
            className="flex-1 rounded-chip border border-foreground/15 bg-white py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-foreground/60 shrink-0"
          >
            Cancel
          </button>
        </form>

        {debouncedQuery.trim().length > 1 && (
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {isFetching && (
              <p className="px-4 py-3 text-xs text-foreground/40">
                Searching...
              </p>
            )}

            {products.length > 0 && (
              <div className="pb-4">
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wide px-4 py-2">
                  Products
                </p>
                {products.map((product) => {
                  const thumbnail = product.images?.[0];
                  return (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-foreground/5 last:border-0 hover:bg-foreground/5"
                    >
                      <div className="relative h-12 w-10 shrink-0 rounded-md overflow-hidden bg-foreground/5">
                        {thumbnail && (
                          <Image
                            src={optimizedImageUrl(thumbnail, "w_200")}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
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
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!isFetching && products.length === 0 && (
              <p className="px-4 py-6 text-sm text-center text-foreground/40">
                No results for &quot;{debouncedQuery}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Search"
      className="p-2 text-foreground md:hidden"
    >
      <Search size={22} />
    </button>
  );
}
