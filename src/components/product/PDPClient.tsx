"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Ruler, Droplet, X, Loader2, CheckCircle, XCircle, MapPin } from "lucide-react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/currency";
import { isNewProduct } from "@/lib/utils/discount";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { cn } from "@/lib/utils/cn";
import type { ProductFull, ProductVariantFull } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { contentApi } from "@/lib/api/content";

import { useAddToCart } from "@/lib/hooks/useCart";
import { useCartUiStore } from "@/store/cartUiStore";
import { useServiceability } from "@/lib/hooks/useCheckout";

import "swiper/css";

interface Props {
  product: ProductFull;
  variants: ProductVariantFull[];
}

export function PDPClient({ product, variants }: Props) {
  const allAges = [...new Set(variants.map((v) => v.age).filter(Boolean))];
  const allColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const allSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const [selectedAge, setSelectedAge] = useState(allAges[0] || "");
  const [selectedColor, setSelectedColor] = useState(allColors[0] || "");
  const [selectedSize, setSelectedSize] = useState(allSizes[0] || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const mobileSwiperRef = useRef<SwiperType | null>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const [shippingOpen, setShippingOpen] = useState(false);
  const [washCareOpen, setWashCareOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [pincode, setPincode] = useState("");
  const [debouncedPincode, setDebouncedPincode] = useState("");
  const [pincodeOpen, setPincodeOpen] = useState(false);

  const { data: shippingData } = useQuery({
    queryKey: ["shipping-return-short"],
    queryFn: contentApi.getShippingReturn,
    staleTime: 10 * 60 * 1000, // 10 min — this changes rarely
  });

  // find active variant — matches on whichever of age/color/size are present
  const activeVariant =
    variants.find((v) => {
      const ageMatch = !selectedAge || v.age === selectedAge;
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return ageMatch && colorMatch && sizeMatch;
    }) || variants[0];

  // stock lookups per option, given the *other* selected attributes
  const isAgeInStock = (age: string) => {
    const v = variants.find((v) => {
      const ageMatch = v.age === age;
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return ageMatch && colorMatch && sizeMatch;
    });
    return (v?.stockQuantity ?? 0) > 0;
  };

  const isColorInStock = (color: string) => {
    const v = variants.find((v) => {
      const colorMatch = v.color === color;
      const ageMatch = !selectedAge || v.age === selectedAge;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return ageMatch && colorMatch && sizeMatch;
    });
    return (v?.stockQuantity ?? 0) > 0;
  };

  const isSizeInStock = (size: string) => {
    const v = variants.find((v) => {
      const sizeMatch = v.size === size;
      const ageMatch = !selectedAge || v.age === selectedAge;
      const colorMatch = !selectedColor || v.color === selectedColor;
      return ageMatch && colorMatch && sizeMatch;
    });
    return (v?.stockQuantity ?? 0) > 0;
  };

  // images: variant displayImages first, fallback to product images
  const images = activeVariant?.displayImages?.length
    ? activeVariant.displayImages
    : product.images?.length
      ? product.images
      : [];

  const pricing = activeVariant?.pricing || {
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    discountPercent: product.discountPercent,
  };

  const inStock = (activeVariant?.stockQuantity ?? 0) > 0;
  const isNew = isNewProduct(product.createdAt);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power2.out" },
      );
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  useEffect(() => {
    // enable accordion transitions only after first paint/hydration,
    // so the closed state renders instantly on load (no phantom transition)
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Shipping & Returns loads asynchronously (react-query), so it usually
  // isn't in the DOM yet when the entrance stagger above runs. Give it its
  // own matching fade-in the moment the data (and therefore the element)
  // actually shows up, so it doesn't just "pop in" out of sync with the rest.
  useEffect(() => {
    if (shippingData?.short && shippingRef.current) {
      gsap.fromTo(
        shippingRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [shippingData?.short]);

  // re-animate price when variant changes
  useEffect(() => {
    const el = document.getElementById("pdp-price");
    if (el)
      gsap.fromTo(
        el,
        { scale: 0.95, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.2 },
      );
  }, [activeVariant?._id]);

  // lock scroll while the size guide lightbox is open
  useEffect(() => {
    if (sizeGuideOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sizeGuideOpen]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPincode(pincode), 600);
    return () => clearTimeout(t);
  }, [pincode]);

  const handleThumbnailClick = (i: number) => {
    setActiveImageIndex(i);
    mobileSwiperRef.current?.slideTo(i);
  };

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const addToCart = useAddToCart();
  const openDrawer = useCartUiStore((s) => s.openDrawer);

  const handleAddToCart = async () => {
    if (!activeVariant) return;
    await addToCart.mutateAsync({
      productId: product._id,
      variantId: activeVariant._id,
      quantity: 1,
    });
    openDrawer();
  };

  const {
    data: serviceability,
    isFetching: checkingPin,
  } = useServiceability(debouncedPincode);

  const Badges = (
    <div className="absolute top-3 inset-x-3 flex justify-between z-20 pointer-events-none">
      {isNew ? <Badge variant="primary">New</Badge> : <span />}
      {pricing.discountPercent > 0 && (
        <Badge variant="accent">{pricing.discountPercent}% Off</Badge>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-foreground/50 mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/products?categoryId=${product.categoryId?._id}&category=${encodeURIComponent(product.categoryId?.name || "")}`}
          className="hover:text-primary"
        >
          {product.categoryId?.name}
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/products?categoryId=${product.categoryId?._id}&subCategoryId=${product.subCategoryId?._id}&subCategory=${encodeURIComponent(product.subCategoryId?.name || "")}`}
          className="hover:text-primary"
        >
          {product.subCategoryId?.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground/80 truncate max-w-40">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image gallery — left */}
        <div ref={imageRef}>
          {/* ---------- MOBILE: swiper + thumbnails below ---------- */}
          <div className="md:hidden">
            <div className="relative aspect-3/4 rounded-card overflow-hidden bg-foreground/5">
              {images.length > 0 ? (
                <Swiper
                  onSwiper={(swiper) => {
                    mobileSwiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) =>
                    setActiveImageIndex(swiper.activeIndex)
                  }
                  className="h-full w-full"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i} className="relative h-full w-full">
                      <Image
                        src={optimizedImageUrl(img, "w_800")}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        sizes="95vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex h-full items-center justify-center text-foreground/30">
                  No image
                </div>
              )}
              {Badges}
            </div>

            {/* Thumbnail row — below image on mobile */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbnailClick(i)}
                    className={`relative h-16 w-16 rounded-md overflow-hidden border-2 shrink-0 transition-all ${i === activeImageIndex
                      ? "border-primary"
                      : "border-transparent"
                      }`}
                  >
                    <Image
                      src={optimizedImageUrl(img, "w_200")}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- DESKTOP: thumbnail column + hover-zoom main image ---------- */}
          <div className="hidden md:flex gap-3">
            {images.length > 1 && (
              <div className="flex flex-col gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative h-16 w-16 rounded-md overflow-hidden border-2 shrink-0 transition-all ${i === activeImageIndex
                      ? "border-primary"
                      : "border-transparent"
                      }`}
                  >
                    <Image
                      src={optimizedImageUrl(img, "w_200")}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              className="relative flex-1 aspect-3/4 rounded-card overflow-hidden bg-foreground/5 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                setIsZoomed(false);
                setZoomOrigin("50% 50%");
              }}
              onMouseMove={handleZoomMove}
            >
              {images[activeImageIndex] ? (
                <Image
                  src={optimizedImageUrl(images[activeImageIndex], "w_1200")}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 45vw, 95vw"
                  className="object-cover transition-transform duration-300 ease-out"
                  style={{
                    transform: isZoomed ? "scale(1.9)" : "scale(1)",
                    transformOrigin: zoomOrigin,
                  }}
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-foreground/30">
                  No image
                </div>
              )}
              {Badges}
            </div>
          </div>
        </div>

        {/* Product info — right */}
        <div ref={contentRef} className="flex flex-col gap-5">
          {/* Brand + Name */}
          <div>
            {product.brand && (
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl text-foreground">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.ratingAvg)
                      ? "text-highlight fill-highlight"
                      : "text-foreground/20"
                  }
                />
              ))}
              <span className="text-xs text-foreground/50">
                ({product.ratingCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div id="pdp-price" className="flex items-baseline gap-3">
            <p className="text-2xl font-semibold text-foreground">
              {formatPrice(pricing.sellingPrice)}
            </p>
            {pricing.discountPercent > 0 && (
              <p className="text-sm text-foreground/40 line-through">
                {formatPrice(pricing.mrp)}
              </p>
            )}
            {pricing.discountPercent > 0 && (
              <span className="text-sm font-semibold text-accent">
                {pricing.discountPercent}% off
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm text-foreground/70 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Age selector */}
          {allAges.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Age: <span className="text-primary">{selectedAge}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {allAges.map((age) => {
                  const outOfStock = !isAgeInStock(age);
                  return (
                    <Button
                      key={age}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAge(age)}
                      className={cn(
                        "relative overflow-hidden rounded-chip border-2",
                        selectedAge === age
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-foreground/15 text-foreground hover:bg-transparent hover:border-primary/50",
                        outOfStock &&
                        "opacity-50 text-foreground/50 hover:border-foreground/15",
                      )}
                      style={
                        outOfStock
                          ? {
                            backgroundImage:
                              "linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--color-foreground) calc(50% - 0.5px), var(--color-foreground) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                          }
                          : undefined
                      }
                    >
                      {age} yrs
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color selector */}
          {allColors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Color: <span className="text-primary">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => {
                  const outOfStock = !isColorInStock(color);
                  return (
                    <Button
                      key={color}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "relative overflow-hidden rounded-chip border-2",
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-foreground/15 text-foreground hover:bg-transparent hover:border-primary/50",
                        outOfStock &&
                        "opacity-50 text-foreground/50 hover:border-foreground/15",
                      )}
                      style={
                        outOfStock
                          ? {
                            backgroundImage:
                              "linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--color-foreground) calc(50% - 0.5px), var(--color-foreground) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                          }
                          : undefined
                      }
                    >
                      {color}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {allSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">
                  Size: <span className="text-primary">{selectedSize}</span>
                </p>
                {product.sizeSpecification && (
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Ruler size={13} />
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => {
                  const outOfStock = !isSizeInStock(size);
                  return (
                    <Button
                      key={size}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "relative overflow-hidden rounded-chip border-2",
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-foreground/15 text-foreground hover:bg-transparent hover:border-primary/50",
                        outOfStock &&
                        "opacity-50 text-foreground/50 hover:border-foreground/15",
                      )}
                      style={
                        outOfStock
                          ? {
                            backgroundImage:
                              "linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--color-foreground) calc(50% - 0.5px), var(--color-foreground) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                          }
                          : undefined
                      }
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Guide button when there's no size selector but a chart still exists */}
          {allSizes.length === 0 && product.sizeSpecification && (
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1.5 self-start text-xs font-semibold text-primary hover:underline"
            >
              <Ruler size={13} />
              View size guide
            </button>
          )}

          {/* Add to cart */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              disabled={!inStock || addToCart.isPending}
              isLoading={addToCart.isPending}
              onClick={handleAddToCart}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          {/* Pincode serviceability check */}
          <div className="border-t border-foreground/10 pt-4">
            <button
              onClick={() => setPincodeOpen((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
            >
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-primary" />
                Check Delivery
              </span>
              <ChevronRight
                size={16}
                className={cn(
                  "text-foreground/40",
                  mounted && "transition-transform duration-300 ease-out",
                  pincodeOpen ? "-rotate-90" : "rotate-90",
                )}
              />
            </button>

            <div
              className={cn(
                "grid",
                mounted && "transition-all duration-300 ease-out",
                pincodeOpen
                  ? "grid-rows-[1fr] opacity-100 mt-3"
                  : "grid-rows-[0fr] opacity-0 mt-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter pincode"
                      maxLength={6}
                      className="w-36 rounded-card border border-foreground/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {checkingPin && (
                      <div className="flex items-center px-3 text-foreground/40">
                        <Loader2 size={16} className="animate-spin" />
                      </div>
                    )}
                  </div>

                  {debouncedPincode.length === 6 && !checkingPin && serviceability && (
                    <div className={`flex items-center gap-2 rounded-card px-3 text-xs font-medium ${serviceability.isServiceable
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                      }`}>
                      {serviceability.isServiceable ? (
                        <>
                          <CheckCircle size={13} className="shrink-0" />
                          Delivery available
                          {serviceability.transitDays > 0 && ` in ${serviceability.transitDays} day${serviceability.transitDays !== 1 ? "s" : ""}`}
                          {!serviceability.isCodAvailable && (
                            <span className="ml-1 text-foreground/50">(COD not available)</span>
                          )}
                        </>
                      ) : (
                        <>
                          <XCircle size={13} className="shrink-0" />
                          {serviceability.message || "Delivery not available to this pincode"}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="border-t border-foreground/10 pt-4 grid grid-cols-2 gap-2">
              {Object.entries(product.attributes).map(([key, val]) => (
                <div key={key}>
                  <span className="text-xs text-foreground/50 capitalize">
                    {key}:{" "}
                  </span>
                  <span className="text-xs font-medium text-foreground capitalize">
                    {val as string}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Full description */}
          {product.description && (
            <div className="border-t border-foreground/10 pt-4">
              <p className="text-sm font-semibold text-foreground mb-2">
                Description
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Wash Care */}
          {product.washCare && (
            <div className="border-t border-foreground/10 pt-4">
              <button
                onClick={() => setWashCareOpen((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Droplet size={15} className="text-primary" />
                  Wash Care
                </span>
                <ChevronRight
                  size={16}
                  className={cn(
                    "text-foreground/40",
                    mounted && "transition-transform duration-300 ease-out",
                    washCareOpen ? "-rotate-90" : "rotate-90",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid",
                  mounted && "transition-all duration-300 ease-out",
                  washCareOpen
                    ? "grid-rows-[1fr] opacity-100 mt-2"
                    : "grid-rows-[0fr] opacity-0 mt-0",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className="text-sm text-foreground/70 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: product.washCare }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shipping & Returns */}
          {shippingData?.short && (
            <div
              ref={shippingRef}
              className="border-t border-foreground/10 pt-4"
            >
              <button
                onClick={() => setShippingOpen((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
              >
                <span className="flex items-center gap-2">
                  Shipping & Returns
                </span>
                <ChevronRight
                  size={16}
                  className={cn(
                    "text-foreground/40",
                    mounted && "transition-transform duration-300 ease-out",
                    shippingOpen ? "-rotate-90" : "rotate-90",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid",
                  mounted && "transition-all duration-300 ease-out",
                  shippingOpen
                    ? "grid-rows-[1fr] opacity-100 mt-2"
                    : "grid-rows-[0fr] opacity-0 mt-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {shippingData.short}
                  </p>
                  <Link
                    href="/shipping-returns"
                    className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    View full policy →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide lightbox */}
      {sizeGuideOpen && product.sizeSpecification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative inline-block max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizedImageUrl(product.sizeSpecification, "w_1000")}
              alt={`${product.name} size guide`}
              className="block w-auto h-auto max-w-[90vw] max-h-[85vh] rounded-card"
            />
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
