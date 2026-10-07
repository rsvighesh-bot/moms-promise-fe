import { api } from "./client";

export interface PolicyContent {
  short: string;
  detailed: string;
  updatedAt: string;
}

export const contentApi = {
  getShippingReturn: async (): Promise<PolicyContent> => {
    const res = await api.get<{ shippingReturn: PolicyContent }>(
      "/shipping-return",
    );
    return res.data.shippingReturn;
  },

  getTerms: async (): Promise<PolicyContent> => {
    const res = await api.get<{ terms: PolicyContent }>("/terms");
    return res.data.terms;
  },
};
