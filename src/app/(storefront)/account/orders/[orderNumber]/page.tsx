"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, CreditCard, Package, Gift } from "lucide-react";
import {
  useMyOrder,
  useCancelOrder,
  useRequestReturn,
} from "@/lib/hooks/useOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils/currency";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "@/lib/utils/orderStatus";
import { AuthGuard } from "@/components/auth/AuthGuard";
import type { OrderItem } from "@/lib/api/orders";

type OrderItemRow =
  | { type: "item"; item: OrderItem }
  | { type: "combo"; groupId: string; comboName: string; items: OrderItem[] };

// Combo items on an order share a comboGroupId — group them the same way
// the cart/checkout do, so the order history still reads as "one combo"
// rather than a handful of unrelated-looking lines.
function groupOrderItems(items: OrderItem[]): OrderItemRow[] {
  const rows: OrderItemRow[] = [];
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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const { data, isLoading } = useMyOrder(orderNumber);
  const cancelOrder = useCancelOrder();
  const requestReturn = useRequestReturn();

  const [cancelModal, setCancelModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState("");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </main>
    );
  }

  if (!data) return null;
  const { order, payment } = data;

  const canCancel = ["placed", "confirmed"].includes(order.orderStatus);
  const canReturn = order.orderStatus === "delivered";

  const handleCancel = async () => {
    setActionError("");
    try {
      await cancelOrder.mutateAsync({ orderNumber, reason });
      setCancelModal(false);
      setReason("");
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleReturn = async () => {
    setActionError("");
    if (!reason.trim()) {
      setActionError("Please provide a reason");
      return;
    }
    try {
      await requestReturn.mutateAsync({ orderNumber, reason });
      setReturnModal(false);
      setReason("");
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to submit return request",
      );
    }
  };

  return (
    <AuthGuard>
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="text-foreground/50 hover:text-foreground"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl text-primary">#{order.orderNumber}</h1>
          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Items */}
        <section className="rounded-card border border-foreground/10 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package size={16} className="text-primary" /> Items
          </h2>
          <div className="space-y-4">
            {groupOrderItems(order.items).map((row) =>
              row.type === "combo" ? (
                <div
                  key={row.groupId}
                  className="rounded-card border border-primary/20 bg-primary/5 p-3 space-y-3"
                >
                  <div className="flex items-center gap-1.5">
                    <Gift size={14} className="text-primary shrink-0" />
                    <span className="text-xs font-semibold text-primary truncate">
                      Combo: {row.comboName}
                    </span>
                  </div>
                  {row.items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="relative h-20 w-16 shrink-0 rounded-md overflow-hidden bg-white">
                        {item.image && (
                          <Image
                            src={optimizedImageUrl(item.image, "w_200")}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <div className="flex gap-2 text-xs text-foreground/50 mt-0.5">
                          {item.age && <span>{item.age} yrs</span>}
                          {item.color && <span>{item.color}</span>}
                          <span>× {item.quantity}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div key={row.item.variantId} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 rounded-md overflow-hidden bg-foreground/5">
                    {row.item.image && (
                      <Image
                        src={optimizedImageUrl(row.item.image, "w_200")}
                        alt={row.item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {row.item.name}
                    </p>
                    <div className="flex gap-2 text-xs text-foreground/50 mt-0.5">
                      {row.item.age && <span>{row.item.age} yrs</span>}
                      {row.item.color && <span>{row.item.color}</span>}
                      <span>× {row.item.quantity}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {formatPrice(row.item.lineTotal)}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-card border border-foreground/10 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Price Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-foreground/70">
              <span>Subtotal</span>
              <span>{formatPrice(order.pricing.subtotal)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>
                  Discount {order.couponCode && `(${order.couponCode})`}
                </span>
                <span>− {formatPrice(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-foreground/70">
              <span>Shipping</span>
              <span>
                {order.pricing.shippingFee === 0
                  ? "Free"
                  : formatPrice(order.pricing.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-foreground/10">
              <span>Total</span>
              <span>{formatPrice(order.pricing.grandTotal)}</span>
            </div>
          </div>
        </section>

        {/* Payment + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section className="rounded-card border border-foreground/10 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard size={14} className="text-primary" /> Payment
            </h2>
            <p className="text-sm text-foreground/70 capitalize">
              {order.paymentMode === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <span
              className={`mt-2 inline-flex items-center rounded-chip px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}
            >
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
            {payment?.method && (
              <p className="text-xs text-foreground/50 mt-1">
                via {payment.method}
              </p>
            )}
          </section>

          <section className="rounded-card border border-foreground/10 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> Delivery Address
            </h2>
            <p className="text-sm font-medium text-foreground">
              {order.addressSnapshot.fullName}
            </p>
            <p className="text-xs text-foreground/60 mt-0.5">
              {order.addressSnapshot.phone}
            </p>
            <p className="text-xs text-foreground/70 mt-1">
              {order.addressSnapshot.line1}
              {order.addressSnapshot.line2
                ? `, ${order.addressSnapshot.line2}`
                : ""}
              <br />
              {order.addressSnapshot.city}, {order.addressSnapshot.state} —{" "}
              {order.addressSnapshot.pincode}
            </p>
          </section>
        </div>

        {/* Status timeline */}
        {order.statusHistory.length > 0 && (
          <section className="rounded-card border border-foreground/10 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Order Timeline
            </h2>
            <div className="relative pl-5">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-foreground/10" />
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} className="relative flex gap-3 mb-4 last:mb-0">
                  <div className="absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                  <div>
                    <p className="text-xs font-semibold text-foreground capitalize">
                      {h.status.replace(/_/g, " ")}
                    </p>
                    {h.note && (
                      <p className="text-xs text-foreground/50">{h.note}</p>
                    )}
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {new Date(h.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        {(canCancel || canReturn) && (
          <div className="flex gap-3">
            {canCancel && (
              <Button
                variant="outline"
                onClick={() => {
                  setReason("");
                  setActionError("");
                  setCancelModal(true);
                }}
              >
                Cancel Order
              </Button>
            )}
            {canReturn && (
              <Button
                variant="outline"
                onClick={() => {
                  setReason("");
                  setActionError("");
                  setReturnModal(true);
                }}
              >
                Request Return
              </Button>
            )}
          </div>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={cancelModal}
          onClose={() => setCancelModal(false)}
          title="Cancel Order"
        >
          <div className="space-y-4">
            <p className="text-sm text-foreground/70">
              Are you sure you want to cancel order #{order.orderNumber}?
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full rounded-card border border-foreground/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            />
            {actionError && (
              <p className="text-xs text-red-500">{actionError}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setCancelModal(false)}
                className="flex-1"
              >
                Keep Order
              </Button>
              <Button
                variant="accent"
                isLoading={cancelOrder.isPending}
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </Modal>

        {/* Return Modal */}
        <Modal
          isOpen={returnModal}
          onClose={() => setReturnModal(false)}
          title="Request Return"
        >
          <div className="space-y-4">
            <p className="text-sm text-foreground/70">
              Please let us know why you want to return this order.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for return (required)"
              className="w-full rounded-card border border-foreground/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            />
            {actionError && (
              <p className="text-xs text-red-500">{actionError}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setReturnModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                isLoading={requestReturn.isPending}
                onClick={handleReturn}
                className="flex-1"
              >
                Submit Request
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </AuthGuard>
  );
}
