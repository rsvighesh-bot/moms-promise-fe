import Link from "next/link";

export function PopNavLink({
  href,
  children,
  rotate = -1.5,
}: {
  href: string;
  children: React.ReactNode;
  rotate?: number;
}) {
  return (
    <Link
      href={href}
      style={{ transform: `rotate(${rotate}deg)` }}
      className="group relative inline-block text-sm font-medium text-foreground transition-all duration-200 hover:rotate-0 hover:text-primary"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0 bg-highlight transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
