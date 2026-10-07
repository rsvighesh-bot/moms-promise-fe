import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi, type AddressInput } from "@/lib/api/address";

const ADDRESSES_KEY = ["addresses"];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressApi.getAll,
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressInput) => addressApi.add(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressInput> }) =>
      addressApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.setDefault(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}
