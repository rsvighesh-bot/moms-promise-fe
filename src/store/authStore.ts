import { create } from "zustand";

interface AuthStore {
  loginModalOpen: boolean;
  loginModalMessage: string;
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginModalOpen: false,
  loginModalMessage: "",
  openLoginModal: (message = "Sign in to continue.") =>
    set({ loginModalOpen: true, loginModalMessage: message }),
  closeLoginModal: () => set({ loginModalOpen: false, loginModalMessage: "" }),
}));
