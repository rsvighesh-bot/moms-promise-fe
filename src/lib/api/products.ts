import { api } from "./client";

export interface ProductVariantSummary {
  _id: string;
  age: string;
  color: string;
  size: string;
  images: string[];
  stockQuantity: number;
  effectiveMrp: number;
  effectiveSellingPrice: number;
}

export interface ProductSummary {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  categoryId: { _id: string; name: string };
  subCategoryId: { _id: string; name: string };
  images: string[];
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  ageRange: string[];
  status: string;
  createdAt: string;
  variants: ProductVariantSummary[];
  inStock: boolean;
  minPrice: number;
  maxPrice: number;
}

export interface VariantPricing {
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
}

export interface ProductVariantFull {
  _id: string;
  age: string;
  color: string;
  size: string;
  images: string[];
  stockQuantity: number;
  effectiveMrp: number;
  effectiveSellingPrice: number;
  pricing: VariantPricing;
  displayImages: string[];
  displayVideos: string[];
}

export interface ProductFull {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  categoryId: { _id: string; name: string };
  subCategoryId: { _id: string; name: string };
  description?: string;
  shortDescription?: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  ageRange: string[];
  sizeSpecification?: string;
  washCare?: string;
  attributes?: Record<string, string>;
  ratingAvg: number;
  ratingCount: number;
  inStock: boolean;
  createdAt: string;
}

export interface ProductDetailResponse {
  product: ProductFull;
  variants: ProductVariantFull[];
}

interface FacetItem {
  _id: string;
  count: number;
}

interface ListProductsResponse {
  products: ProductSummary[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: {
    ages: FacetItem[];
    colors: FacetItem[];
  };
}

export interface ListProductsParams {
  categoryId?: string;
  subCategoryId?: string;
  age?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export const productsApi = {
  list: async (params: ListProductsParams): Promise<ListProductsResponse> => {
    const res = await api.get<ListProductsResponse>("/products", { params });
    return res.data;
  },

  getBySlug: async (slug: string): Promise<ProductDetailResponse> => {
    const res = await api.get<ProductDetailResponse>(`/products/${slug}`);
    return res.data;
  },

  search: async (query: string): Promise<ProductSummary[]> => {
    const res = await api.get<ListProductsResponse>("/products", {
      params: { search: query, limit: 8 },
    });
    return res.data.products;
  },
};
