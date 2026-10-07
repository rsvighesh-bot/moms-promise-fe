import { api } from "./client";

export interface ShopVideoProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  sellingPrice: number;
  mrp: number;
  status: string;
}

export interface ShopVideo {
  _id: string;
  videoUrl: string;
  productId?: ShopVideoProduct | null;
  caption?: string;
  sortOrder: number;
  status: "active" | "inactive";
}

export const shopVideosApi = {
  getAll: async (): Promise<ShopVideo[]> => {
    const res = await api.get<{ videos: ShopVideo[] }>("/shop-videos");
    return res.data.videos;
  },
};
