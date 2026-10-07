import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/utils/orderStatus";

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-chip px-3 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[status] ?? "bg-foreground/10 text-foreground"}`}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
