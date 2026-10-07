"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useApplyCoupon, useRemoveCoupon } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils/currency";
import { useCartUiStore } from "@/store/cartUiStore";

interface CouponInputProps {
  appliedCode: string | null;
}

export function CouponInput({ appliedCode }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const discountAmount = useCartUiStore((s) => s.discountAmount);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError("");
    try {
      await applyCoupon.mutateAsync(code.trim());
      setCode("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid coupon code");
    }
  };

  const handleRemove = async () => {
    setError("");
    try {
      await removeCoupon.mutateAsync();
    } catch {
      // onError in hook handles cleanup
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-card px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-primary">
              {appliedCode} applied
            </p>
            {discountAmount > 0 && (
              <p className="text-xs text-green-600">
                You save {formatPrice(discountAmount)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleRemove}
          disabled={removeCoupon.isPending}
          aria-label="Remove coupon"
          className="text-foreground/40 hover:text-foreground disabled:opacity-50"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Enter coupon code"
          className="flex-1 rounded-card border border-foreground/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || applyCoupon.isPending}
          className="rounded-card bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary/90"
        >
          {applyCoupon.isPending ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
