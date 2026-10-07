"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { productsApi } from "@/lib/api/products";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useQuery({
    queryKey: ["product-search", query],
    queryFn: () => productsApi.search(query),
    enabled: query.trim().length > 1,
  });

  const showDropdown = isFocused && query.trim().length > 1;

  useEffect(() => {
    if (showDropdown && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
      );
    }
  }, [showDropdown, suggestions]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md hidden md:block"
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for kids' wear..."
          className="w-full rounded-chip border border-foreground/15 bg-white py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50"
        >
          <Search size={18} />
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full rounded-card bg-white shadow-lg border border-foreground/10 overflow-hidden z-50"
        >
          {suggestions.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              onClick={() => setIsFocused(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-foreground/5"
            >
              <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-foreground/5">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
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
                <p className="text-xs text-foreground/60">
                  ₹{product.minPrice}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
