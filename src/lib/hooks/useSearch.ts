import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/search";
import type { ProductSummary } from "@/lib/api/products";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const data = await searchApi.search({ q: query });
      const products: ProductSummary[] = data.products.map((p) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        sku: "",
        brand: p.brand ?? "",
        images: p.images,
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        discountPercent: p.discountPercent,
        ageRange: p.ageRange,
        minPrice: p.sellingPrice,
        maxPrice: p.mrp,
        inStock: true,
        status: "active",
        categoryId: { _id: "", name: "" },
        subCategoryId: { _id: "", name: "" },
        variants: [],
        createdAt: new Date().toISOString(),
      }));
      return { query: data.query, products };
    },
    enabled: query.trim().length > 1,
    staleTime: 30 * 1000,
  });
}
