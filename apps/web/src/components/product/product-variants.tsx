"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onChange: (variant: ProductVariant) => void;
  className?: string;
}

export function ProductVariants({
  variants,
  selectedVariantId,
  onChange,
  className,
}: ProductVariantsProps) {
  if (!variants.length) return null;

  const hasPrice = variants.some((v) => v.price !== null && v.price !== undefined);

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-text-700">
        Variant
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onChange(variant)}
            disabled={variant.quantity === 0}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              selectedVariantId === variant.id
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-accent-300 text-text-700 hover:border-muted-400",
              variant.quantity === 0 &&
                "opacity-40 cursor-not-allowed line-through",
            )}
          >
            {variant.name}
            {hasPrice && variant.price && (
              <span className="ml-1 text-muted-500">
                (+Rs. {parseFloat(variant.price).toLocaleString()})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
