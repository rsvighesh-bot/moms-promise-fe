import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/currency";
import { isNewProduct } from "@/lib/utils/discount";
import type { ProductSummary } from "@/lib/api/products";

export function ProductCard({ product }: { product: ProductSummary }) {
  const isNew = isNewProduct(product.createdAt);
  const hasDiscount = product.discountPercent > 0;

  const thumbnail =
    product.images?.[0] ||
    product.variants.find((v) => v.images?.[0])?.images?.[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-card bg-white border border-foreground/10 p-2 transition-colors duration-200 hover:border-highlight"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-card bg-foreground/5">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}

        <div className="absolute top-2 px-3 flex items-center justify-between w-full">
          {isNew ? <Badge variant="primary">New</Badge> : <span />}
          {hasDiscount && (
            <Badge variant="highlight">{product.discountPercent}% Off</Badge>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="neutral">Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-1">
        {product.brand && (
          <p className="text-xs text-foreground/50">{product.brand}</p>
        )}
        <p className="text-sm font-medium text-foreground truncate">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold text-foreground">
            {formatPrice(product.minPrice)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-foreground/50 line-through decoration-foreground/50">
              {formatPrice(product.mrp)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
