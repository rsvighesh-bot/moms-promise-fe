import { api } from "./client";

export interface CheckoutItem {
  productId: string;
  variantId: string;
  name: string;
  sku?: string;
  age?: string;
  color?: string;
  image?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  comboOfferId?: string | null;
  comboGroupId?: string | null;
  comboName?: string | null;
}

export interface CheckoutPricing {
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
}

export interface CheckoutSummary {
  items: CheckoutItem[];
  pricing: CheckoutPricing;
  couponCode: string | null;
  couponMessage: string | null;
  freeShippingThreshold: number;
  shippingNote?: string;
}

export interface PlaceOrderResponse {
  message: string;
  order: {
    _id: string;
    orderNumber: string;
    paymentMode: "online" | "cod";
    orderStatus: string;
    pricing: CheckoutPricing;
  };
  requiresPayment: boolean;
}

export interface ServiceabilityResponse {
  isServiceable: boolean;
  isCodAvailable: boolean;
  transitDays: number;
  message: string;
}

export const checkoutApi = {
  getSummary: async (addressId?: string): Promise<CheckoutSummary> => {
    const res = await api.get<CheckoutSummary>("/checkout/summary", {
      params: addressId ? { addressId } : {},
    });
    return res.data;
  },
  placeOrder: async (data: {
    addressId: string;
    paymentMode: "online" | "cod";
  }): Promise<PlaceOrderResponse> => {
    const res = await api.post<PlaceOrderResponse>(
      "/checkout/place-order",
      data,
    );
    return res.data;
  },

  checkServiceability: async (
    pincode: string,
  ): Promise<ServiceabilityResponse> => {
    const res = await api.get<ServiceabilityResponse>(
      "/shipping/serviceability",
      {
        params: { pincode },
      },
    );
    return res.data;
  },
};
