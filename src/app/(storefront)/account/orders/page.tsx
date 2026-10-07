"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { useMyOrders } from "@/lib/hooks/useOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { formatPrice } from "@/lib/utils/currency";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { AuthGuard } from "@/components/auth/AuthGuard";

const STATUS_FILTERS = [
  { label: "All", value: undefined },
  { label: "Active", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyOrdersPage() {
  const [page, setPage] = useState("1");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading } = useMyOrders(page, statusFilter);

  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl text-primary mb-6">My Orders</h1>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => {
                setStatusFilter(f.value);
                setPage("1");
              }}
              className={`rounded-chip px-4 py-2 text-sm font-medium transition-all ${statusFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        )}

        {!isLoading && data?.orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Package size={48} className="text-foreground/20" />
            <p className="text-foreground/50">No orders yet</p>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {data?.orders.map((order) => {
            const firstImage = order.items[0]?.image;
            return (
              <Link
                key={order._id}
                href={`/account/orders/${order.orderNumber}`}
                className="group block rounded-card border border-foreground/10 p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail stack */}
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="relative h-14 w-12 rounded-md overflow-hidden border-2 border-white bg-foreground/5 shrink-0"
                        >
                          {item.image && (
                            <Image
                              src={optimizedImageUrl(item.image, "w_100")}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative h-14 w-12 rounded-md border-2 border-white bg-foreground/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-foreground/60">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-foreground/50 mt-0.5">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {formatPrice(order.pricing.grandTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <OrderStatusBadge status={order.orderStatus} />
                    <ChevronRight
                      size={16}
                      className="text-foreground/30 group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {data && data.totalPages > 1 && (
          <Pagination
            page={Number(page)}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPrevPage={Number(page) > 1}
            onPageChange={(p) => setPage(String(p))}
          />
        )}
      </main>
    </AuthGuard>
  );
}
