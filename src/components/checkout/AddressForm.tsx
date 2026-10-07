"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAddAddress, useUpdateAddress } from "@/lib/hooks/useAddresses";
import type { Address } from "@/lib/api/address";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().min(5, "Address line required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  isDefault: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddressFormProps {
  editAddress?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({
  editAddress,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editAddress
      ? {
          fullName: editAddress.fullName,
          phone: editAddress.phone,
          line1: editAddress.line1,
          line2: editAddress.line2 ?? "",
          city: editAddress.city,
          state: editAddress.state,
          pincode: editAddress.pincode,
        }
      : {},
  });

  const onSubmit = async (values: FormValues) => {
    if (editAddress) {
      await updateAddress.mutateAsync({ id: editAddress._id, data: values });
    } else {
      await addAddress.mutateAsync(values);
    }
    onSuccess();
  };

  const isPending = addAddress.isPending || updateAddress.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Phone"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Input
        label="Address Line 1"
        error={errors.line1?.message}
        {...register("line1")}
      />
      <Input label="Address Line 2 (optional)" {...register("line2")} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="State"
          error={errors.state?.message}
          {...register("state")}
        />
        <Input
          label="Pincode"
          error={errors.pincode?.message}
          {...register("pincode")}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer select-none">
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-foreground/20 has-checked:border-primary has-checked:bg-primary">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <Star
            size={12}
            className="pointer-events-none hidden text-white peer-checked:block"
          />
        </span>
        Set as default address
      </label>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" isLoading={isPending} className="flex-1">
          {editAddress ? "Update Address" : "Save Address"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
