import { api } from "./client";

export interface Review {
  _id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  reviewText: string;
  sortOrder: number;
  status: "active" | "inactive";
}

export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    const res = await api.get<{ reviews: Review[] }>("/reviews");
    return res.data.reviews;
  },
};
