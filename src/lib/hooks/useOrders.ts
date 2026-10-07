import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";

export function useMyOrders(page = "1", status?: string) {
  return useQuery({
    queryKey: ["my-orders", page, status],
    queryFn: () => ordersApi.getMyOrders({ page, status }),
  });
}

export function useMyOrder(orderNumber: string) {
  return useQuery({
    queryKey: ["my-order", orderNumber],
    queryFn: () => ordersApi.getMyOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderNumber,
      reason,
    }: {
      orderNumber: string;
      reason?: string;
    }) => ordersApi.cancelOrder(orderNumber, reason),
    onSuccess: (_, { orderNumber }) => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["my-order", orderNumber] });
    },
  });
}

export function useRequestReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderNumber,
      reason,
    }: {
      orderNumber: string;
      reason: string;
    }) => ordersApi.requestReturn(orderNumber, reason),
    onSuccess: (_, { orderNumber }) => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["my-order", orderNumber] });
    },
  });
}
