"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useCartUiStore } from "@/store/cartUiStore";

export function CartIcon() {
  const { data: cart } = useCart();
  const openDrawer = useCartUiStore((s) => s.openDrawer);
  const itemCount =
    cart?.items?.filter((i) => i.available !== false).length ?? 0;

  return (
    <button
      onClick={openDrawer}
      className="relative p-2"
      aria-label="View cart"
    >
      <ShoppingBag className="text-foreground" size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
