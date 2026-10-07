import { api } from "./client";

export interface SubCategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
}

export const subCategoriesApi = {
  getByCategory: async (categoryId: string): Promise<SubCategory[]> => {
    const res = await api.get<{ subCategories: SubCategory[] }>(
      "/subcategories",
      {
        params: { categoryId },
      },
    );
    return res.data.subCategories;
  },
};
