import { api } from "./client";

export interface KpiImage {
  _id: string;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  sortOrder: number;
  status: "active" | "inactive";
}

export const kpiImagesApi = {
  getAll: async (): Promise<KpiImage[]> => {
    const res = await api.get<{ images: KpiImage[] }>("/kpi-images");
    return res.data.images;
  },
};
