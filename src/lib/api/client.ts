import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends customer_token cookie automatically, same pattern as admin_token in moms-promise-be
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize every error to the same shape so callers don't each parse response.data.message themselves
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
