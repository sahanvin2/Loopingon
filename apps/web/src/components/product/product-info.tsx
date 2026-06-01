"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/auth-store";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceDisplay } from "@/components/shared/price-display";
import { Badge } from "@/components/shared/badge";
import { VendorBadge } from "@/components/vendor/vendor-badge";
import { ShareButtons } from "@/components/product/share-buttons";

interface ProductInfoProps {
  product: Product;
}

function getStockStatus(product: Product): {
  label: string;
  color: string;
} {
  if (product.quantity === 0) return { label: "Out of Stock", color: "text-red-600" };
  if (product.madeToOrder) return { label: "Made to Order", color: "text-teal-600" };
  if (product.quantity <= 5) return { label: "Low Stock", color: "text-amber-600" };
  return { label: "In Stock", color: "text-green-600" };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist(product.id);
  const { isAuthenticated } = useAuthStore();

  const price = parseFloat(product.price);
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;
  const stock = getStockStatus(product);

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  return (
    <div className="space-y-6">
      {product.vendor && (
        <Link
          href={`/artisans/${product.vendor.storeSlug}`}
          className="inline-flex items-center gap-2 text-sm text-warm-gray-600 hover:text-terracotta-600 transition-colors"
        >
          {product.vendor.storeName}
          <VendorBadge />
        </Link>
      )}

      <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 leading-tight">
        {product.title}
      </h1>

      <div className="flex items-center gap-3 flex-wrap">
        <RatingStars
          rating={product.averageRating}
          size="md"
          showValue
          reviewCount={product.reviewCount}
        />
        <Link
          href="#reviews"
          className="text-sm text-warm-gray-500 hover:text-terracotta-600 underline underline-offset-4"
        >
          Write a Review
        </Link>
      </div>

      <div>
        {discount > 0 ? (
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-bold text-red-600">
              {formatPrice(price)}
            </span>
            <span className="text-lg line-through text-warm-gray-500">
              {formatPrice(originalPrice!)}
            </span>
            <Badge variant="red" size="md">
              Save {discount}%
            </Badge>
          </div>
        ) : (
          <span className="text-3xl sm:text-4xl font-bold text-terracotta-600">
            {formatPrice(price)}
          </span>
        )}
        <span className="block text-xs text-warm-gray-500 mt-1">
          All prices include VAT
        </span>
      </div>

      {product.shortDescription && (
        <p className="text-warm-gray-600 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-cream-300 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className={cn(
              "p-2.5 text-warm-gray-600 hover:text-charcoal-700 transition-colors",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-charcoal-700 font-medium text-sm select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2.5 text-warm-gray-600 hover:text-charcoal-700 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className={cn("text-sm font-medium", stock.color)}>
          {stock.label}
        </span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.quantity === 0}
          className={cn(
            "w-full py-3.5 rounded-lg text-base font-medium transition-colors",
            "bg-terracotta-600 text-white hover:bg-terracotta-700",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-terracotta",
          )}
        >
          {addToCart.isPending
            ? "Adding..."
            : product.quantity === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.quantity === 0}
          className={cn(
            "w-full py-3.5 rounded-lg text-base font-medium transition-colors",
            "border-2 border-terracotta-600 text-terracotta-600 bg-transparent",
            "hover:bg-terracotta-50",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) return;
            toggle();
          }}
          className={cn(
            "w-full py-2.5 text-sm font-medium transition-colors",
            isWishlisted
              ? "text-terracotta-600"
              : "text-warm-gray-600 hover:text-terracotta-600",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 inline mr-1.5",
              isWishlisted && "fill-current",
            )}
          />
          {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t border-cream-200">
        <div className="flex items-center gap-3 text-sm text-warm-gray-600">
          <Truck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            {product.freeShippingDomestic
              ? "Free domestic shipping"
              : "Shipping calculated at checkout"}
            &nbsp;&middot;&nbsp;Estimated delivery: 5-7 business days
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-warm-gray-600">
          <RotateCcw className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Easy 7-day returns on most items</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-warm-gray-600">
          <Shield className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Buyer protection guarantee</span>
        </div>
      </div>

      <div className="pt-4 border-t border-cream-200">
        <ShareButtons productTitle={product.title} />
      </div>
    </div>
  );
}
