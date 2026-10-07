import { Truck } from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { PolicyPageLayout } from "@/components/content/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | moms-promise Kids Apparel",
  description:
    "Learn about our shipping policy, delivery timelines and easy return process.",
};

export default async function ShippingReturnsPage() {
  const data = await contentApi.getShippingReturn().catch(() => null);

  console.log(data, "return");

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl text-primary mb-4">Shipping & Returns</h1>
        <p className="text-foreground/60 text-sm">Content coming soon.</p>
      </main>
    );
  }

  return (
    <PolicyPageLayout
      title="Shipping & Returns"
      short={data.short}
      detailed={data.detailed}
      updatedAt={data.updatedAt}
      icon={<Truck size={28} />}
    />
  );
}
