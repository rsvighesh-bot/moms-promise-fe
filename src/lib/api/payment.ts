import { api } from "./client";

export interface CreateRazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderNumber: string;
}

export interface VerifyPaymentResponse {
  message: string;
  order: {
    _id: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
  };
}

export const paymentApi = {
  createOrder: async (
    orderId: string,
  ): Promise<CreateRazorpayOrderResponse> => {
    const res = await api.post<CreateRazorpayOrderResponse>(
      "/payments/create-order",
      { orderId },
    );
    return res.data;
  },

  verify: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<VerifyPaymentResponse> => {
    const res = await api.post<VerifyPaymentResponse>("/payments/verify", data);
    return res.data;
  },

  cancel: (orderId: string) =>
    api.post("/payments/cancel", { orderId }).then((r) => r.data),
};
