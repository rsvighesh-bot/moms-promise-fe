import { api } from "./client";

export interface ShopByAgeGroup {
  _id: string;
  label: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder: number;
  status: "active" | "inactive";
}

export const shopByAgeApi = {
  getAll: async (): Promise<ShopByAgeGroup[]> => {
    const res = await api.get<{ ageGroups: ShopByAgeGroup[] }>(
      "/shop-by-age",
    );
    return res.data.ageGroups;
  },
};
