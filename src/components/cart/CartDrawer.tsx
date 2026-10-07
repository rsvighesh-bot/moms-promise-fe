"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, Gift } from "lucide-react";
import gsap from "gsap";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useUpdateComboCartItem,
  useRemoveComboCartItem,
} from "@/lib/hooks/useCart";
import { useCartUiStore } from "@/store/cartUiStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/Button";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { CouponInput } from "./CouponInput";
import type { CartItem } from "@/lib/api/cart";

type CartRow =
  | { type: "item"; item: CartItem }
  | { type: "combo"; groupId: string; comboName: string; items: CartItem[] };

// Combo items always share a comboGroupId and quantity — group them into
// one row so they read and act like a single combo, not N separate lines.
function groupCartItems(items: CartItem[]): CartRow[] {
  const rows: CartRow[] = [];
  const seenGroups = new Set<string>();

  for (const item of items) {
    if (item.comboGroupId) {
      if (seenGroups.has(item.comboGroupId)) continue;
      seenGroups.add(item.comboGroupId);
      rows.push({
        type: "combo",
        groupId: item.comboGroupId,
        comboName: item.comboName || "Combo",
        items: items.filter((i) => i.comboGroupId === item.comboGroupId),
      });
    } else {
      rows.push({ type: "item", item });
    }
  }

  return rows;
}

export function CartDrawer() {
  const isOpen = useCartUiStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartUiStore((s) => s.closeDrawer);
  const { data: cart } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const discountAmount = useCartUiStore((s) => s.discountAmount);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
      );
      gsap.fromTo(
        panelRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.35, ease: "power3.out" },
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(panelRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: closeDrawer,
    });
  };

  const items = useMemo(() => cart?.items ?? [], [cart]);
  const rows = useMemo(() => groupCartItems(items), [items]);
  const isEmpty = items.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-charcoal/50"
        onClick={handleClose}
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-lg text-foreground">
              Your Cart{" "}
              {items.length > 0 && (
                <span className="text-sm text-foreground/50">
                  ({items.length})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="p-1 text-foreground/50 hover:text-foreground"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-foreground/20" />
              <p className="text-foreground/50 text-sm">Your cart is empty</p>
              <Button variant="outline" size="sm" onClick={handleClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            rows.map((row) =>
              row.type === "combo" ? (
                <ComboCartRow
                  key={row.groupId}
                  groupId={row.groupId}
                  comboName={row.comboName}
                  items={row.items}
                  onNavigate={handleClose}
                />
              ) : (
                <CartLineItem
                  key={row.item.variantId}
                  item={row.item}
                  onNavigate={handleClose}
                />
              ),
            )
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-foreground/10 px-5 py-3 space-y-2.5">
            {cart?.hasIssues && (
              <p className="text-xs text-accent bg-accent/10 rounded-card px-3 py-1.5">
                Some items have issues — please review before checkout.
              </p>
            )}

            {/* Coupon */}
            <CouponInput appliedCode={cart?.couponCode ?? null} />

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>{formatPrice(cart?.subtotal ?? 0)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount ({cart?.couponCode})</span>
                  <span>− {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-semibold text-foreground pt-1 border-t border-foreground/10">
                <span>Total</span>
                <span className="text-base">
                  {formatPrice((cart?.subtotal ?? 0) - discountAmount)}
                </span>
              </div>
            </div>

            <Link href="/checkout" onClick={handleClose}>
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLineItem({
  item,
  onNavigate,
}: {
  item: CartItem;
  onNavigate: () => void;
}) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  return (
    <div className={`flex gap-3 ${!item.available ? "opacity-50" : ""}`}>
      {/* Image */}
      <div className="relative h-20 w-16 shrink-0 rounded-md overflow-hidden bg-foreground/5">
        {item.image ? (
          <Image
            src={optimizedImageUrl(item.image, "w_200")}
            alt={item.name || "Product"}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-foreground/20">
            <ShoppingBag size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.slug}`}
          onClick={onNavigate}
          className="text-sm font-medium text-foreground hover:text-primary truncate block"
        >
          {item.name}
        </Link>
        <div className="flex gap-2 mt-0.5">
          {item.age && (
            <span className="text-xs text-foreground/50">{item.age} yrs</span>
          )}
          {item.color && (
            <span className="text-xs text-foreground/50">{item.color}</span>
          )}
        </div>

        {/* Price changed warning */}
        {item.priceChanged && (
          <p className="text-xs text-accent mt-0.5">Price updated</p>
        )}
        {!item.available && (
          <p className="text-xs text-red-500 mt-0.5">
            {item.issue || "Unavailable"}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-2 border border-foreground/15 rounded-chip px-2 py-1">
            <button
              onClick={() =>
                item.quantity > 1
                  ? updateItem.mutate({
                      variantId: item.variantId,
                      quantity: item.quantity - 1,
                    })
                  : removeItem.mutate(item.variantId)
              }
              className="text-foreground/60 hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium w-4 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateItem.mutate({
                  variantId: item.variantId,
                  quantity: item.quantity + 1,
                })
              }
              disabled={(item.stockRemaining ?? 0) <= item.quantity}
              className="text-foreground/60 hover:text-foreground disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {item.lineTotal ? formatPrice(item.lineTotal) : "—"}
            </span>
            <button
              onClick={() => removeItem.mutate(item.variantId)}
              className="text-foreground/30 hover:text-red-500"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComboCartRow({
  groupId,
  comboName,
  items,
  onNavigate,
}: {
  groupId: string;
  comboName: string;
  items: CartItem[];
  onNavigate: () => void;
}) {
  const updateCombo = useUpdateComboCartItem();
  const removeCombo = useRemoveComboCartItem();

  const quantity = items[0]?.quantity ?? 1;
  const comboLineTotal = items.reduce((sum, i) => sum + (i.lineTotal ?? 0), 0);
  const hasIssue = items.some((i) => !i.available);
  // Every item in the group shares the same quantity, so the group's
  // headroom is however much the tightest-stocked item allows.
  const maxAdditional = Math.min(
    ...items.map((i) => (i.stockRemaining ?? 0) - i.quantity),
  );

  return (
    <div
      className={`rounded-card border border-primary/20 bg-primary/5 p-3 ${hasIssue ? "opacity-70" : ""}`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Gift size={14} className="text-primary shrink-0" />
        <span className="text-xs font-semibold text-primary truncate">
          Combo: {comboName}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-2.5">
            <div className="relative h-14 w-11 shrink-0 rounded-md overflow-hidden bg-white">
              {item.image ? (
                <Image
                  src={optimizedImageUrl(item.image, "w_150")}
                  alt={item.name || "Product"}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-foreground/20">
                  <ShoppingBag size={14} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                onClick={onNavigate}
                className="text-xs font-medium text-foreground hover:text-primary truncate block"
              >
                {item.name}
              </Link>
              <div className="flex gap-2">
                {item.age && (
                  <span className="text-[11px] text-foreground/50">
                    {item.age} yrs
                  </span>
                )}
                {item.color && (
                  <span className="text-[11px] text-foreground/50">
                    {item.color}
                  </span>
                )}
              </div>
              {!item.available && (
                <p className="text-[11px] text-red-500">
                  {item.issue || "Unavailable"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-primary/10">
        <div className="flex items-center gap-2 border border-foreground/15 rounded-chip px-2 py-1 bg-white">
          <button
            onClick={() =>
              quantity > 1
                ? updateCombo.mutate({ comboGroupId: groupId, quantity: quantity - 1 })
                : removeCombo.mutate(groupId)
            }
            className="text-foreground/60 hover:text-foreground"
            aria-label="Decrease combo quantity"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium w-4 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              updateCombo.mutate({ comboGroupId: groupId, quantity: quantity + 1 })
            }
            disabled={maxAdditional <= 0}
            className="text-foreground/60 hover:text-foreground disabled:opacity-30"
            aria-label="Increase combo quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(comboLineTotal)}
          </span>
          <button
            onClick={() => removeCombo.mutate(groupId)}
            className="text-foreground/30 hover:text-red-500"
            aria-label="Remove combo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
