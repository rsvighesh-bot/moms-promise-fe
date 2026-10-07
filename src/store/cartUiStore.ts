import { create } from "zustand";

interface CartUiState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  selectedVariantId: string | null;
  setSelectedVariant: (id: string | null) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  clearDiscount: () => void;
}

export const useCartUiStore = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  selectedVariantId: null,
  setSelectedVariant: (id) => set({ selectedVariantId: id }),
  discountAmount: 0,
  setDiscountAmount: (amount) => set({ discountAmount: amount }),
  clearDiscount: () => set({ discountAmount: 0 }),
}));
