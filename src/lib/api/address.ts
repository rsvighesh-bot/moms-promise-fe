import { api } from "./client";

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const res = await api.get<{ addresses: Address[] }>("/addresses");
    return res.data.addresses;
  },

  add: async (data: AddressInput): Promise<Address> => {
    const res = await api.post<{ address: Address }>("/addresses", data);
    return res.data.address;
  },

  update: async (id: string, data: Partial<AddressInput>): Promise<Address> => {
    const res = await api.put<{ address: Address }>(`/addresses/${id}`, data);
    return res.data.address;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    const res = await api.patch<{ address: Address }>(
      `/addresses/${id}/default`,
    );
    return res.data.address;
  },
};
