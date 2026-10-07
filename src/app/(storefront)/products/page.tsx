import { productsApi } from "@/lib/api/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | moms-promise Kids Apparel",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const data = await productsApi.list({
    categoryId: sp.categoryId,
    subCategoryId: sp.subCategoryId,
    age: sp.age,
    color: sp.color,
    minPrice: sp.minPrice,
    maxPrice: sp.maxPrice,
    availability: sp.availability,
    page: sp.page || "1",
  });

  // display-only labels passed through the URL — not used for filtering
  const heading = sp.subCategory || sp.category || "Shop All";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-primary">{heading}</h1>
        {/* <SortDropdown /> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <p className="text-sm text-foreground/60 mb-4">
            {data.total} products
          </p>
          <ProductGrid products={data.products} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPrevPage={data.hasPrevPage}
          />
        </div>
      </div>
    </main>
  );
}
