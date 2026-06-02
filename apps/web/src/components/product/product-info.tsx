"use client";

import React from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { RatingStars } from "@/components/shared/rating-stars";
import { VendorBadge } from "@/components/vendor/vendor-badge";
import { ShareButtons } from "@/components/product/share-buttons";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Brand & Vendor */}
      {product.vendor && (
        <Link
          href={`/artisans/${product.vendor.storeSlug}`}
          className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-rose-700 font-medium tracking-widest uppercase transition-colors"
        >
          {product.vendor.storeName}
          <VendorBadge />
        </Link>
      )}

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 leading-[1.1] tracking-tight">
        {product.title}
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-3 flex-wrap">
        <RatingStars
          rating={product.averageRating}
          size="md"
          showValue
          reviewCount={product.reviewCount}
        />
        <span className="text-blush-300">|</span>
        <Link
          href="#reviews"
          className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors"
        >
          Read Reviews
        </Link>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-charcoal-600 leading-relaxed text-base pt-2">
          {product.shortDescription}
        </p>
      )}

      {/* Detailed specs or attributes */}
      <div className="pt-4">
        <ul className="space-y-3 text-sm text-charcoal-700 font-medium">
          {product.isHandmade && (
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900"></span>
              Authentic Handmade Quality
            </li>
          )}
          {product.isEcoFriendly && (
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900"></span>
              Eco-Friendly Materials
            </li>
          )}
        </ul>
      </div>

      <div className="pt-4">
        <ShareButtons productTitle={product.title} />
      </div>
    </div>
  );
}
