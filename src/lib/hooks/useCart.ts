import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useCartUiStore } from "@/store/cartUiStore";
import { CART_KEY, CHECKOUT_SUMMARY_KEY } from "./queryKeys";

export { CART_KEY };

export function useCart() {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.get,
    staleTime: 0,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      quantity,
    }: {
      productId: string;
      variantId: string;
      quantity: number;
    }) => cartApi.addItem(productId, variantId, quantity),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => cartApi.updateItem(variantId, quantity),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => cartApi.removeItem(variantId),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useAddComboToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      comboOfferId,
      selections,
    }: {
      comboOfferId: string;
      selections: { productId: string; variantId: string }[];
    }) => cartApi.addCombo(comboOfferId, selections),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useUpdateComboCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      comboGroupId,
      quantity,
    }: {
      comboGroupId: string;
      quantity: number;
    }) => cartApi.updateComboItem(comboGroupId, quantity),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useRemoveComboCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comboGroupId: string) => cartApi.removeComboItem(comboGroupId),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY, data);
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      qc.setQueryData(CART_KEY, {
        cartId: "",
        items: [],
        subtotal: 0,
        couponCode: null,
        hasIssues: false,
      });
    },
  });
}

export function useApplyCoupon() {
  const qc = useQueryClient();
  const setDiscountAmount = useCartUiStore((s) => s.setDiscountAmount);
  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),
    onSuccess: (data) => {
      setDiscountAmount(data.discountAmount);
      // force fresh cart fetch instead of setting stale coupon response
      qc.invalidateQueries({ queryKey: CART_KEY });
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}

export function useRemoveCoupon() {
  const qc = useQueryClient();
  const clearDiscount = useCartUiStore((s) => s.clearDiscount);
  return useMutation({
    mutationFn: cartApi.removeCoupon,
    onSuccess: () => {
      clearDiscount();
      // force fresh cart fetch — don't trust the remove response shape
      qc.invalidateQueries({ queryKey: CART_KEY });
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
    onError: () => {
      clearDiscount();
      qc.invalidateQueries({ queryKey: CART_KEY });
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}
