import { api } from "./client";

export interface OrderItem {
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

export interface OrderPricing {
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  addressSnapshot: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  pricing: OrderPricing;
  couponCode?: string;
  paymentMode: "online" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
}

export interface OrderPayment {
  status: string;
  method?: string;
  razorpayPaymentId?: string;
  refundId?: string;
  refundAmount?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

export const ordersApi = {
  getMyOrders: async (params?: {
    page?: string;
    status?: string;
  }): Promise<OrdersResponse> => {
    const res = await api.get<OrdersResponse>("/orders/my", { params });
    return res.data;
  },

  getMyOrderByNumber: async (
    orderNumber: string,
  ): Promise<{ order: Order; payment: OrderPayment | null }> => {
    const res = await api.get(`/orders/my/${orderNumber}`);
    return res.data;
  },

  cancelOrder: async (
    orderNumber: string,
    reason?: string,
  ): Promise<{ message: string; order: Order }> => {
    const res = await api.post(`/orders/my/${orderNumber}/cancel`, { reason });
    return res.data;
  },

  requestReturn: async (
    orderNumber: string,
    reason: string,
  ): Promise<{ message: string; order: Order }> => {
    const res = await api.post(`/orders/my/${orderNumber}/return`, { reason });
    return res.data;
  },
};
