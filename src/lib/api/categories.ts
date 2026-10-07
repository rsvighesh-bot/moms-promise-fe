import { api } from "./client";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
  status: "active" | "inactive";
}

interface ListCategoriesResponse {
  categories: Category[];
}

interface GetCategoryResponse {
  category: Category;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<ListCategoriesResponse>("/categories");
    return res.data.categories;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get<GetCategoryResponse>(`/categories/${slug}`);
    return res.data.category;
  },
};
