interface PolicyPageLayoutProps {
  title: string;
  short: string;
  detailed: string;
  updatedAt: string;
  icon: React.ReactNode;
}

export function PolicyPageLayout({
  title,
  short,
  detailed,
  updatedAt,
  icon,
}: PolicyPageLayoutProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-primary">{icon}</span>
        <h1 className="text-3xl text-primary">{title}</h1>
      </div>
      <p className="text-xs text-foreground/40 mb-6">
        Last updated:{" "}
        {new Date(updatedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Short summary card */}
      <div className="rounded-card bg-primary/5 border border-primary/15 px-5 py-4 mb-8">
        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
          {short}
        </p>
      </div>

      {/* Full content — rendered as HTML from the rich text editor */}
      <div
        className="prose prose-sm max-w-none text-foreground/80
          prose-headings:text-foreground prose-headings:font-semibold
          prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
          prose-p:leading-relaxed prose-p:mb-3
          prose-ul:pl-5 prose-ul:mb-3
          prose-li:mb-1
          prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: detailed }}
      />
    </main>
  );
}
