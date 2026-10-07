import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function NewArrivalsSection() {
  const data = await productsApi.list({ limit: "8" }).catch(() => null);
  if (!data || data.products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl text-foreground">New Arrivals</h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-accent hover:underline"
        >
          View all
        </Link>
      </div>
      <ProductGrid products={data.products} />
    </section>
  );
}
