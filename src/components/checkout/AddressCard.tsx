"use client";

import { MapPin, Star, Pencil, Trash2 } from "lucide-react";
import {
  useSetDefaultAddress,
  useDeleteAddress,
} from "@/lib/hooks/useAddresses";
import type { Address } from "@/lib/api/address";

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
}: AddressCardProps) {
  const setDefault = useSetDefaultAddress();
  const deleteAddress = useDeleteAddress();

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-card border-2 p-4 transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-foreground/10 hover:border-foreground/30"
      }`}
    >
      {address.isDefault && (
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-highlight/15 px-2 py-1 text-[11px] font-semibold text-accent">
          <Star size={11} className="fill-accent" /> Default
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 pr-14 sm:pr-0">
          <p className="text-sm font-semibold text-foreground">
            {address.fullName}
          </p>
          <p className="text-xs text-foreground/60 mt-0.5">{address.phone}</p>
          <p className="text-xs text-foreground/70 mt-1 wrap-break-word">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            <br />
            {address.city}, {address.state} — {address.pincode}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Pencil size={12} /> Edit
            </button>
            {!address.isDefault && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefault.mutate(address._id);
                  }}
                  className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground"
                >
                  <MapPin size={12} /> Set default
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress.mutate(address._id);
                  }}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
