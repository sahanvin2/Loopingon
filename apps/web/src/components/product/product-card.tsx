"use client";

import React, { useState } from "react";
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
import { Modal } from "@/components/shared/modal";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

export function ProductCard({ product, className, showQuickView = true }: ProductCardProps) {
  const { isWishlisted, toggle, isLoading: wishlistLoading } = useToggleWishlist(product.id);
  const addToCart = useAddToCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.medium || primaryImage?.url);
  const price = parseFloat(product.price);
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;
  const avgRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className={cn(
          "group bg-white rounded-lg border border-accent-300 overflow-hidden shadow-sm",
          "hover:shadow-md transition-shadow duration-300",
          className,
        )}
      >
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isHandmade && (
              <Badge variant="rose" size="sm">Handmade</Badge>
            )}
            {discount > 0 && (
              <Badge variant="red" size="sm">Sale -{discount}%</Badge>
            )}
            {product.isEcoFriendly && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <Leaf className="w-3 h-3" /> Eco
              </span>
            )}
            {product.quantity !== undefined && product.quantity <= 0 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                Out of Stock
              </span>
            )}
          </div>

        </Link>

        {showQuickView && (
          <div className="absolute top-0 left-0 right-0 aspect-[4/3] bg-text-900/0 group-hover:bg-text-900/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg pointer-events-auto",
                "bg-white/90 backdrop-blur-sm text-text-700 text-sm font-medium",
                "shadow-sm hover:bg-white hover:text-primary-600 transition-colors",
              )}
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          disabled={wishlistLoading}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10",
            "bg-white/80 backdrop-blur-sm shadow-sm transition-colors",
            "hover:bg-white disabled:cursor-not-allowed",
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted
                ? "fill-primary-500 text-primary-500"
                : "text-muted-500 hover:text-primary-500",
            )}
          />
        </button>

        <div className="p-3">
          {product.vendor && (
            <Link
              href={`/vendors/${product.vendor.storeSlug}`}
              className="text-xs uppercase tracking-wider text-muted-500 hover:text-primary-600 transition-colors"
            >
              {product.vendor.storeName}
            </Link>
          )}

          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="font-medium text-text-900 line-clamp-2 text-sm leading-snug group-hover:text-primary-600 transition-colors">
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

          {product.quantity !== undefined && (
            <div className="mt-1.5">
              {product.quantity > 0 ? (
                <span className="text-xs text-green-600 font-medium">{product.quantity} in stock</span>
              ) : (
                <span className="text-xs text-red-500 font-medium">Out of Stock</span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart.mutate({ productId: product.id, quantity: 1 });
            }}
            disabled={addToCart.isPending}
            className={cn(
              "mt-3 w-full py-2 rounded-lg text-sm font-medium",
              "bg-primary-600 text-white",
              "hover:bg-primary-700 transition-colors",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </motion.div>

      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        size="full"
        className="max-w-3xl p-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row max-h-[80vh] overflow-y-auto">
          <div className="relative w-full md:w-1/2 min-h-[300px] bg-muted-100">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col gap-4">
            {product.vendor && (
              <Link
                href={`/vendors/${product.vendor.storeSlug}`}
                className="text-xs font-semibold uppercase tracking-wider text-primary-600"
                onClick={() => setIsQuickViewOpen(false)}
              >
                {product.vendor.storeName}
              </Link>
            )}
            
            <h2 className="text-2xl font-serif font-bold text-text-900 leading-tight">
              {product.title}
            </h2>
            
            <div className="flex items-center justify-between">
              <PriceDisplay price={price} originalPrice={originalPrice} size="lg" />
              <RatingStars rating={avgRating} reviewCount={reviewCount} size="sm" />
            </div>
            
            {product.shortDescription || product.description ? (
              <p className="text-muted-600 text-sm line-clamp-4">
                {product.shortDescription || product.description}
              </p>
            ) : null}

            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                disabled={addToCart.isPending || (product.quantity !== undefined && product.quantity <= 0)}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-medium shadow-sm transition-all duration-200",
                  "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {addToCart.isPending ? "Adding..." : (product.quantity !== undefined && product.quantity <= 0 ? "Out of Stock" : "Add to Cart")}
              </button>
              
              <Link
                href={`/products/${product.slug}`}
                onClick={() => setIsQuickViewOpen(false)}
                className="w-full text-center py-2 px-4 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
