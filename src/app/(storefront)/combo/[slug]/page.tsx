import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { comboOffersApi } from "@/lib/api/comboOffers";
import { formatPrice } from "@/lib/utils/currency";
import { ComboOfferClient } from "@/components/combo/ComboOfferClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await comboOffersApi.getBySlug(slug).catch(() => null);
  if (!data) return {};

  return {
    title: `${data.offer.name} | moms-promise Kids Apparel`,
    description: `${data.offer.name} — ${data.products.length} products bundled at ${formatPrice(data.offer.comboPrice)}`,
    openGraph: {
      title: data.offer.name,
      images: [data.offer.imageUrl],
    },
  };
}

export default async function ComboOfferPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await comboOffersApi.getBySlug(slug).catch(() => null);
  if (!data) notFound();

  return <ComboOfferClient offer={data.offer} products={data.products} />;
}
