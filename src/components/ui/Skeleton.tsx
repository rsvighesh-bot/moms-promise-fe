import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-card bg-foreground/10", className)}
      aria-hidden="true"
    />
  );
}
