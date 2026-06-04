"use client";

import React from "react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { price: "text-base", original: "text-xs" },
  md: { price: "text-lg", original: "text-sm" },
  lg: { price: "text-2xl", original: "text-sm" },
  xl: { price: "text-4xl", original: "text-lg" },
} as const;

export function PriceDisplay({
  price,
  originalPrice,
  currency = "LKR",
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const discount = hasDiscount ? calculateDiscount(price, originalPrice!) : 0;
  const sizes = sizeMap[size];

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn(
          "font-bold text-primary-600",
          sizes.price,
          hasDiscount && "text-red-600",
        )}
      >
        {formatPrice(price, currency)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              "line-through text-muted-500",
              sizes.original,
            )}
          >
            {formatPrice(originalPrice, currency)}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded-full",
              "bg-red-100 text-red-700 font-semibold",
              size === "sm" || size === "md" ? "text-xs" : "text-sm",
            )}
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
