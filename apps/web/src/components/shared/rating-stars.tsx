"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  sm: { icon: "w-3.5 h-3.5", text: "text-xs", gap: "gap-0.5" },
  md: { icon: "w-4 h-4", text: "text-sm", gap: "gap-0.5" },
  lg: { icon: "w-5 h-5", text: "text-sm", gap: "gap-1" },
} as const;

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className,
}: RatingStarsProps) {
  const sizes = sizeMap[size];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 1;
  const emptyStars = maxRating - fullStars - (hasHalf ? 1 : 0);

  return (
    <div
      className={cn("inline-flex items-center", sizes.gap, className)}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(
            sizes.icon,
            "fill-accent-500 text-accent-500",
          )}
          aria-hidden="true"
        />
      ))}
      {hasHalf && (
        <div className="relative" aria-hidden="true">
          <Star className={cn(sizes.icon, "text-muted-300")} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(sizes.icon, "fill-accent-500 text-accent-500")} />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizes.icon, "text-muted-300")}
          aria-hidden="true"
        />
      ))}
      {showValue && (
        <span className={cn(sizes.text, "text-text-700 font-medium ml-1")}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn(sizes.text, "text-muted-500 ml-1")}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
