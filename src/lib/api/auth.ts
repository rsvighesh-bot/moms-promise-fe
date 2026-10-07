import { api } from "./client";

export interface CustomerUser {
  _id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
}

export const authApi = {
  getMe: async (): Promise<CustomerUser | null> => {
    try {
      const res = await api.get<{ user: CustomerUser }>("/auth/me");
      return res.data.user;
    } catch {
      return null; // not logged in — 401 is expected, not an error state
    }
  },

  oneTap: async (credential: string) => {
    const res = await api.post<{ user: CustomerUser }>("/auth/google/one-tap", {
      credential,
    });
    return res.data.user;
  },

  logout: () => api.post("/auth/logout"),
  googleLoginUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
};
