import { api } from "./client";

export interface TopScrollMessage {
  _id: string;
  text: string;
  status: "active" | "inactive";
}

export const topScrollApi = {
  get: async (): Promise<TopScrollMessage | null> => {
    const res = await api.get<{ message: TopScrollMessage | null }>(
      "/top-scroll",
    );
    return res.data.message;
  },
};
