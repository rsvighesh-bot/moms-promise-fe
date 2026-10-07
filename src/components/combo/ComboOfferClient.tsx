"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/currency";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { cn } from "@/lib/utils/cn";
import { useAddComboToCart } from "@/lib/hooks/useCart";
import { useCartUiStore } from "@/store/cartUiStore";
import type {
  ComboOfferDetail,
  ComboOfferProduct,
} from "@/lib/api/comboOffers";

interface Props {
  offer: ComboOfferDetail;
  products: ComboOfferProduct[];
}

interface Selection {
  variantId: string;
  inStock: boolean;
}

export function ComboOfferClient({ offer, products }: Props) {
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const addCombo = useAddComboToCart();
  const openDrawer = useCartUiStore((s) => s.openDrawer);

  const allSelected = products.every((p) => selections[p._id]?.variantId);
  const allInStock = products.every((p) => selections[p._id]?.inStock);
  const canAdd = allSelected && allInStock;
  const hasDiscount = offer.comboPrice < offer.originalPrice;

  const handleAddToCart = async () => {
    if (!canAdd) return;
    await addCombo.mutateAsync({
      comboOfferId: offer._id,
      selections: products.map((p) => ({
        productId: p._id,
        variantId: selections[p._id].variantId,
      })),
    });
    openDrawer();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10">
        <div className="relative w-full max-w-xs mx-auto md:mx-0 aspect-square shrink-0 overflow-hidden rounded-card bg-foreground/5">
          <Image
            src={optimizedImageUrl(offer.imageUrl)}
            alt={offer.name}
            fill
            sizes="(min-width: 768px) 320px, 80vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-4xl text-primary mb-2">
            {offer.name}
          </h1>
          <p className="text-sm text-foreground/60 mb-4">
            {products.length} products in this combo
          </p>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(offer.comboPrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-foreground/50 line-through decoration-foreground/50">
                {formatPrice(offer.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground/60 max-w-md">
            Pick an option for every product below, then add the whole combo
            to your cart at the combo price.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-4">
        Choose your options
      </h2>
      <div className="space-y-4">
        {products.map((product) => (
          <ComboProductRow
            key={product._id}
            product={product}
            isSelected={!!selections[product._id]}
            onVariantChange={(variantId, inStock) =>
              setSelections((prev) => ({
                ...prev,
                [product._id]: { variantId, inStock },
              }))
            }
          />
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 -mx-4 border-t border-foreground/10 bg-white/95 backdrop-blur px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-foreground/50">
              {canAdd
                ? "All set"
                : allSelected
                  ? "One of your selections is out of stock"
                  : "Select an option for every product"}
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(offer.comboPrice)}
            </p>
          </div>
          <Button
            size="lg"
            disabled={!canAdd || addCombo.isPending}
            isLoading={addCombo.isPending}
            onClick={handleAddToCart}
          >
            Add Combo to Cart
          </Button>
        </div>
      </div>
    </main>
  );
}

function ComboProductRow({
  product,
  isSelected,
  onVariantChange,
}: {
  product: ComboOfferProduct;
  isSelected: boolean;
  onVariantChange: (variantId: string, inStock: boolean) => void;
}) {
  const variants = product.variants;
  const allAges = useMemo(
    () => [...new Set(variants.map((v) => v.age).filter(Boolean))],
    [variants],
  );
  const allColors = useMemo(
    () =>
      [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[],
    [variants],
  );
  const allSizes = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[],
    [variants],
  );

  const [selectedAge, setSelectedAge] = useState(allAges[0] || "");
  const [selectedColor, setSelectedColor] = useState(allColors[0] || "");
  const [selectedSize, setSelectedSize] = useState(allSizes[0] || "");

  // Recomputed from scratch on every render — never a stale reference, so
  // clicking one attribute (e.g. color) that no longer matches the current
  // age/size can't leave a mismatched selection hanging around.
  const activeVariant =
    variants.find((v) => {
      const ageMatch = !selectedAge || v.age === selectedAge;
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return ageMatch && colorMatch && sizeMatch;
    }) || variants[0];

  // Keep the parent in sync with whatever variant the current chip
  // selection resolves to (including its stock status) — this also
  // auto-selects a sensible default on mount, so a single-option product
  // doesn't require an extra click to "count" as selected.
  useEffect(() => {
    if (activeVariant) {
      onVariantChange(activeVariant._id, activeVariant.stockQuantity > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVariant?._id]);

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

  const thumbnail = activeVariant?.images?.[0] || product.images?.[0];
  const inStock = (activeVariant?.stockQuantity ?? 0) > 0;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-card border p-3 transition-colors",
        isSelected && inStock
          ? "border-primary/40 bg-primary/5"
          : "border-foreground/10",
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-foreground/5"
      >
        {thumbnail && (
          <Image
            src={optimizedImageUrl(thumbnail, "w_200")}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-foreground hover:text-primary truncate block"
        >
          {product.name}
        </Link>

        {!inStock && (
          <p className="text-xs text-red-500 mt-0.5">
            This option is out of stock
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-2">
          {allAges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allAges.map((age) => {
                const outOfStock = !isAgeInStock(age);
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setSelectedAge(age)}
                    className={cn(
                      "rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors",
                      selectedAge === age
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-foreground/15 text-foreground hover:border-primary/40",
                      outOfStock && "opacity-50",
                    )}
                  >
                    {age} yrs
                  </button>
                );
              })}
            </div>
          )}

          {allColors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allColors.map((color) => {
                const outOfStock = !isColorInStock(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors",
                      selectedColor === color
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-foreground/15 text-foreground hover:border-primary/40",
                      outOfStock && "opacity-50",
                    )}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          )}

          {allSizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((size) => {
                const outOfStock = !isSizeInStock(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors",
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-foreground/15 text-foreground hover:border-primary/40",
                      outOfStock && "opacity-50",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
