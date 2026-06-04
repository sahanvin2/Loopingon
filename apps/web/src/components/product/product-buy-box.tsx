"use client";

import React, { useState } from "react";
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
import { Badge } from "@/components/shared/badge";

interface ProductBuyBoxProps {
  product: Product;
}

function getStockStatus(product: Product): {
  label: string;
  color: string;
} {
  if (product.quantity === 0) return { label: "Out of Stock", color: "text-red-600" };
  if (product.madeToOrder) return { label: "Made to Order", color: "text-muted-600" };
  if (product.quantity <= 5) return { label: "Low Stock", color: "text-amber-600" };
  return { label: "In Stock", color: "text-green-600" };
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
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
    <div className="space-y-6 pt-6 mt-6 border-t border-accent-200">
      {/* Price Section */}
      <div>
        {discount > 0 ? (
          <div className="flex flex-col gap-1">
            <Badge variant="red" size="sm" className="w-fit mb-1">
              Save {discount}%
            </Badge>
            <span className="text-3xl sm:text-4xl font-bold text-red-600 tracking-tight">
              {formatPrice(price)}
            </span>
            <span className="text-sm line-through text-muted-500">
              {formatPrice(originalPrice!)}
            </span>
          </div>
        ) : (
          <span className="text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
            {formatPrice(price)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className={cn("text-sm tracking-wide uppercase font-medium", stock.color)}>
        {stock.label}
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-wider uppercase font-medium text-text-500">Quantity</label>
        <div className="flex items-center w-fit border border-text-200 rounded-none overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className={cn(
              "p-3 bg-white text-text-600 hover:bg-accent-50 hover:text-text-900 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center bg-white text-text-900 font-medium text-sm select-none border-x border-text-200 py-3">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={quantity >= product.quantity && !product.madeToOrder}
            className={cn(
              "p-3 bg-white text-text-600 hover:bg-accent-50 hover:text-text-900 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.quantity === 0}
          className={cn(
            "w-full py-4 bg-text-900 text-white text-sm tracking-[0.1em] uppercase font-medium",
            "transition-all duration-300 hover:bg-primary-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {addToCart.isPending
            ? "Adding..."
            : product.quantity === 0
              ? "Out of Stock"
              : "Add to Bag"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.quantity === 0}
          className={cn(
            "w-full py-4 border border-text-900 text-text-900 text-sm tracking-[0.1em] uppercase font-medium",
            "transition-all duration-300 hover:bg-accent-50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
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
            "w-full py-3 text-xs tracking-wider uppercase font-medium transition-colors flex items-center justify-center gap-2",
            isWishlisted
              ? "text-primary-600"
              : "text-text-600 hover:text-primary-600",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              isWishlisted && "fill-current",
            )}
          />
          {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Shipping Info */}
      <div className="space-y-4 pt-6 mt-6 border-t border-accent-200">
        <div className="flex items-start gap-4 text-sm text-text-600">
          <Truck className="w-5 h-5 text-text-400 shrink-0" />
          <span className="leading-relaxed">
            {product.freeShippingDomestic ? (
              <span className="font-medium text-text-900">Complimentary domestic delivery</span>
            ) : (
              "Shipping calculated at checkout"
            )}
            <br />
            <span className="text-muted-500">Est. 5-7 business days</span>
          </span>
        </div>
        <div className="flex items-start gap-4 text-sm text-text-600">
          <RotateCcw className="w-5 h-5 text-text-400 shrink-0" />
          <span className="leading-relaxed">Easy Returns & Replacements</span>
        </div>
        <div className="flex items-start gap-4 text-sm text-text-600">
          <Shield className="w-5 h-5 text-text-400 shrink-0" />
          <span className="leading-relaxed">Secure transaction guarantee</span>
        </div>
      </div>
    </div>
  );
}
