import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-card bg-accent px-8 py-12 md:py-16 text-center">
        <h2 className="text-3xl md:text-4xl text-white">End of Season Sale</h2>
        <p className="mt-2 text-white/90">Up to 40% off on selected styles</p>
        <Link
          href="/products?availability=in_stock"
          className="mt-6 inline-block rounded-chip bg-white px-6 py-3 text-sm font-semibold text-accent hover:bg-cream transition-colors"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}
