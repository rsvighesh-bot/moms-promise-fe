import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "@/lib/api/checkout";
import { CART_KEY, CHECKOUT_SUMMARY_KEY } from "./queryKeys";

export { CHECKOUT_SUMMARY_KEY };

export function useCheckoutSummary(addressId?: string) {
  return useQuery({
    queryKey: ["checkout-summary", addressId],
    queryFn: () => checkoutApi.getSummary(addressId),
    retry: false,
  });
}

export function useServiceability(pincode: string) {
  return useQuery({
    queryKey: ["serviceability", pincode],
    queryFn: () => checkoutApi.checkServiceability(pincode),
    enabled: /^\d{6}$/.test(pincode), // only fire when exactly 6 digits
    staleTime: 10 * 60 * 1000, // 10 min — matches backend PincodeCache TTL
    retry: false,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: checkoutApi.placeOrder,
    onSuccess: () => {
      qc.setQueryData(CART_KEY, {
        cartId: "",
        items: [],
        subtotal: 0,
        couponCode: null,
        hasIssues: false,
      });
      qc.invalidateQueries({ queryKey: CHECKOUT_SUMMARY_KEY });
    },
  });
}
