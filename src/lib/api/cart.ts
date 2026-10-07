import { api } from "./client";

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  name?: string;
  slug?: string;
  age?: string;
  color?: string | null;
  image?: string | null;
  unitPrice?: number;
  lineTotal?: number;
  available?: boolean;
  stockRemaining?: number;
  priceChanged?: boolean;
  issue?: string;
  comboOfferId?: string | null;
  comboGroupId?: string | null;
  comboName?: string | null;
}

export interface CartResponse {
  cartId: string;
  items: CartItem[];
  subtotal: number;
  couponCode: string | null;
  hasIssues: boolean;
}

export interface ApplyCouponResponse {
  message: string;
  discountAmount: number;
  cart: CartResponse;
}

export interface ComboSelection {
  productId: string;
  variantId: string;
}

export const cartApi = {
  get: async (): Promise<CartResponse> => {
    const res = await api.get<CartResponse>("/cart");
    return res.data;
  },

  addItem: async (
    productId: string,
    variantId: string,
    quantity: number,
  ): Promise<CartResponse> => {
    const res = await api.post<CartResponse>("/cart/items", {
      productId,
      variantId,
      quantity,
    });
    return res.data;
  },

  updateItem: async (
    variantId: string,
    quantity: number,
  ): Promise<CartResponse> => {
    const res = await api.put<CartResponse>(`/cart/items/${variantId}`, {
      quantity,
    });
    return res.data;
  },

  removeItem: async (variantId: string): Promise<CartResponse> => {
    const res = await api.delete<CartResponse>(`/cart/items/${variantId}`);
    return res.data;
  },

  addCombo: async (
    comboOfferId: string,
    selections: ComboSelection[],
  ): Promise<CartResponse> => {
    const res = await api.post<CartResponse>("/cart/combo", {
      comboOfferId,
      selections,
    });
    return res.data;
  },

  updateComboItem: async (
    comboGroupId: string,
    quantity: number,
  ): Promise<CartResponse> => {
    const res = await api.put<CartResponse>(`/cart/combo/${comboGroupId}`, {
      quantity,
    });
    return res.data;
  },

  removeComboItem: async (comboGroupId: string): Promise<CartResponse> => {
    const res = await api.delete<CartResponse>(`/cart/combo/${comboGroupId}`);
    return res.data;
  },

  clear: async (): Promise<void> => {
    await api.delete("/cart");
  },

  applyCoupon: async (code: string): Promise<ApplyCouponResponse> => {
    const res = await api.post<ApplyCouponResponse>("/coupons/apply", { code });
    return res.data;
  },

  removeCoupon: async (): Promise<CartResponse> => {
    const res = await api.post<CartResponse>("/coupons/remove");
    return res.data;
  },
};
