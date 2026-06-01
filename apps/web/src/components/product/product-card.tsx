"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, Leaf } from "lucide-react";
import { cn, getImageUrl, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceDisplay } from "@/components/shared/price-display";
import { Badge } from "@/components/shared/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

export function ProductCard({ product, className, showQuickView = true }: ProductCardProps) {
  const { isWishlisted, toggle, isLoading: wishlistLoading } = useToggleWishlist(product.id);
  const addToCart = useAddToCart();

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.medium || primaryImage?.url);
  const price = parseFloat(product.price);
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;
  const avgRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "group bg-white rounded-lg border border-cream-300 overflow-hidden shadow-sm",
        "hover:shadow-md transition-shadow duration-300",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-warm-gray-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isHandmade && (
            <Badge variant="terracotta" size="sm">Handmade</Badge>
          )}
          {discount > 0 && (
            <Badge variant="red" size="sm">Sale -{discount}%</Badge>
          )}
          {product.isEcoFriendly && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <Leaf className="w-3 h-3" /> Eco
            </span>
          )}
        </div>

        {showQuickView && (
          <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg",
                "bg-white/90 backdrop-blur-sm text-charcoal-700 text-sm font-medium",
                "shadow-sm",
              )}
            >
              <Eye className="w-4 h-4" /> Quick View
            </span>
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        disabled={wishlistLoading}
        className={cn(
          "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center",
          "bg-white/80 backdrop-blur-sm shadow-sm transition-colors",
          "hover:bg-white disabled:cursor-not-allowed",
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isWishlisted
              ? "fill-terracotta-500 text-terracotta-500"
              : "text-warm-gray-500 hover:text-terracotta-500",
          )}
        />
      </button>

      <div className="p-3">
        {product.vendor && (
          <Link
            href={`/artisans/${product.vendor.storeSlug}`}
            className="text-xs uppercase tracking-wider text-warm-gray-500 hover:text-terracotta-600 transition-colors"
          >
            {product.vendor.storeName}
          </Link>
        )}

        <Link href={`/products/${product.slug}`} className="block mt-1">
          <h3 className="font-medium text-charcoal-900 line-clamp-2 text-sm leading-snug group-hover:text-terracotta-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1.5">
          <RatingStars
            rating={avgRating}
            size="sm"
            reviewCount={reviewCount}
          />
        </div>

        <div className="mt-2">
          <PriceDisplay
            price={price}
            originalPrice={originalPrice}
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart.mutate({ productId: product.id, quantity: 1 });
          }}
          disabled={addToCart.isPending}
          className={cn(
            "mt-3 w-full py-2 rounded-lg text-sm font-medium",
            "bg-terracotta-600 text-white",
            "hover:bg-terracotta-700 transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
