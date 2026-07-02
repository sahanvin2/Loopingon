"use client";

import React from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { RatingStars } from "@/components/shared/rating-stars";
import { VendorBadge } from "@/components/vendor/vendor-badge";
import { ShareButtons } from "@/components/product/share-buttons";
import { Star, Award, Leaf, ShieldCheck } from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Brand & Vendor */}
      {product.vendor && (
        <Link
          href={`/vendors/${product.vendor.storeSlug}`}
          className="inline-flex items-center gap-2 text-sm text-text-500 hover:text-primary-700 font-medium tracking-widest uppercase transition-colors"
        >
          {product.vendor.storeName}
          <VendorBadge />
        </Link>
      )}

      {/* Title */}
      <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-text-900 leading-none">
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
        <span className="text-accent-300">|</span>
        <Link
          href="#reviews"
          className="text-sm text-text-600 hover:text-text-900 transition-colors"
        >
          Read Reviews
        </Link>
      </div>



      {/* Short Description */}
      {!!product.shortDescription && product.shortDescription !== "0" && (
        <p className="text-text-600 leading-relaxed text-base pt-2">
          {product.shortDescription}
        </p>
      )}

      <div className="pt-4">
        <ShareButtons productTitle={product.title} />
      </div>
    </div>
  );
}
