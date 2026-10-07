import { api } from "./client";

export interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  shortDescription?: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  ageRange: string[];
  score: number;
}

export interface SearchResponse {
  query: string;
  products: SearchProduct[];
}

export interface SearchParams {
  q: string;
}

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const res = await api.get<SearchResponse>("/search", { params });
    return res.data;
  },
};
