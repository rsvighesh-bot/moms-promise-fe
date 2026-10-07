import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsApi } from "@/lib/api/products";
import { PDPClient } from "@/components/product/PDPClient";
import { SuggestedProducts } from "@/components/product/SuggestedProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await productsApi.getBySlug(slug).catch(() => null);
  if (!data) return {};

  const { product } = data;
  console.log(data, "whole");
  const thumbnail = product.images?.[0];

  return {
    title: `${product.name} | moms-promise Kids Apparel`,
    description:
      product.shortDescription ||
      product.description ||
      `Shop ${product.name} at moms-promise Kids`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || "",
      images: thumbnail ? [thumbnail] : [],
    },
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await productsApi.getBySlug(slug).catch(() => null);
  if (!data) notFound();

  const { product, variants } = data;

  console.log(product, "ol");
  const related = await productsApi
    .list({ categoryId: product.categoryId as any, limit: "16" })
    .then((res) => res.products)
    .catch(() => []);

  const suggestedProducts = shuffle(
    related.filter((p) => p._id !== product._id),
  ).slice(0, 4);

  return (
    <>
      <PDPClient product={product} variants={variants} />
      <SuggestedProducts products={suggestedProducts} />
    </>
  );
}
