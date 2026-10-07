import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Pan-India Delivery", sub: "Fast, tracked shipping" },
  { icon: RotateCcw, label: "Easy Returns", sub: "7-day return window" },
  { icon: ShieldCheck, label: "Secure Payments", sub: "UPI, cards & COD" },
];

export function TrustStrip() {
  return (
    <section className="bg-foreground/3 border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon className="text-primary shrink-0" size={28} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {item.label}
              </p>
              <p className="text-xs text-foreground/60">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
