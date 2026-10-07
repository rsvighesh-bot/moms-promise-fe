import { api } from "./client";

export type ComboDiscountType = "percentage" | "flat";

export interface ComboOfferSummary {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  discountType: ComboDiscountType;
  discountValue: number;
  productCount: number;
  originalPrice: number; // paise
  comboPrice: number; // paise
}

export interface ComboOfferProductVariant {
  _id: string;
  sku: string;
  age: string;
  color?: string;
  size?: string;
  stockQuantity: number;
  images: string[];
}

export interface ComboOfferProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  sellingPrice: number; // paise
  mrp: number; // paise
  variants: ComboOfferProductVariant[];
}

export interface ComboOfferDetail {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  discountType: ComboDiscountType;
  discountValue: number;
  originalPrice: number; // paise
  comboPrice: number; // paise
}

export const comboOffersApi = {
  getAll: async (): Promise<ComboOfferSummary[]> => {
    const res = await api.get<{ offers: ComboOfferSummary[] }>(
      "/combo-offers",
    );
    return res.data.offers;
  },

  getBySlug: async (
    slug: string,
  ): Promise<{ offer: ComboOfferDetail; products: ComboOfferProduct[] }> => {
    const res = await api.get<{
      offer: ComboOfferDetail;
      products: ComboOfferProduct[];
    }>(`/combo-offers/${slug}`);
    return res.data;
  },
};
