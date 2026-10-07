export const ORDER_STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  rto: "Returned to Origin",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  placed: "bg-highlight/20 text-charcoal",
  confirmed: "bg-primary/10 text-primary",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-primary/20 text-primary",
  out_for_delivery: "bg-accent/10 text-accent",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  returned: "bg-foreground/10 text-foreground/60",
  rto: "bg-foreground/10 text-foreground/60",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Payment Pending",
  paid: "Paid",
  failed: "Payment Failed",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-highlight/20 text-charcoal",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  refunded: "bg-foreground/10 text-foreground/60",
};
