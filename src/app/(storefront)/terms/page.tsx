import { FileText } from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { PolicyPageLayout } from "@/components/content/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | moms-promise Kids Apparel",
  description: "Read our terms and conditions for using moms-promise Kids Apparel.",
};

export default async function TermsPage() {
  const data = await contentApi.getTerms().catch(() => null);

  console.log(data, "terms");

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl text-primary mb-4">Terms of Service</h1>
        <p className="text-foreground/60 text-sm">Content coming soon.</p>
      </main>
    );
  }

  return (
    <PolicyPageLayout
      title="Terms of Service"
      short={data.short}
      detailed={data.detailed}
      updatedAt={data.updatedAt}
      icon={<FileText size={28} />}
    />
  );
}
