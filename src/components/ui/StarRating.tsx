import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // supports half-star fractions, e.g. 4.5
  size?: number;
  className?: string;
}

// Read-only star rating — 5 stars, each fractionally filled via a clipped
// overlay so half-star values render correctly (not just rounded to the
// nearest whole star). Same technique/colors as the PDP's rating stars.
export function StarRating({ rating, size = 16, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span
            key={i}
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="absolute inset-0 text-foreground/20" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star size={size} className="text-highlight fill-highlight" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
