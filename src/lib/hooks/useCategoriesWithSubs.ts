import { useQuery } from "@tanstack/react-query";
import { subCategoriesApi } from "@/lib/api/subcategories";

export function useSubCategories(categoryId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => subCategoriesApi.getByCategory(categoryId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
