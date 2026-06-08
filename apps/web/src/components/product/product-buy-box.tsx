"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, Minus, Plus, Shield, Truck, RotateCcw, Gift, Sparkles, Palette, Crown,
} from "lucide-react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useLoyaltyDiscount } from "@/hooks/use-loyalty";
import { Badge } from "@/components/shared/badge";

interface ProductBuyBoxProps {
  product: Product;
}

function getStockStatus(product: Product, selectedVariant?: ProductVariant): {
  label: string;
  color: string;
} {
  const qty = selectedVariant ? selectedVariant.quantity : product.quantity;
  if (product.quantity === 0 && (!selectedVariant || selectedVariant.quantity === 0)) return { label: "Out of Stock", color: "text-red-600" };
  if (product.madeToOrder) return { label: "Made to Order", color: "text-muted-600" };
  if (qty <= 5) return { label: `Only ${qty} left`, color: "text-amber-600" };
  return { label: "In Stock", color: "text-green-600" };
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist(product.id);
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  const { data: loyaltyDiscount } = useLoyaltyDiscount();
  const loyaltyOff = loyaltyDiscount?.data?.discount || 0;
  const loyaltyTier = loyaltyDiscount?.data?.tier || null;

  const variants = product.variants || [];
  const variantPrice = selectedVariant?.price ? parseFloat(selectedVariant.price) : null;
  const price = variantPrice || parseFloat(product.price);
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;
  const stock = getStockStatus(product, selectedVariant ?? undefined);

  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id ?? undefined,
      quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id ?? undefined,
      quantity,
    });
  };

  const handleSendAsGift = () => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id ?? undefined,
      quantity,
    });
    router.push(`/gift?product=${product.id}&price=${price}&title=${encodeURIComponent(product.title)}`);
  };

  return (
    <div className="space-y-6 pt-6 mt-6 border-t border-accent-200">
      {/* Loyalty Discount Banner */}
      {loyaltyOff > 0 && (
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl flex items-center gap-2">
          <Crown className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-xs font-bold text-green-700">
            {loyaltyTier?.toUpperCase()} Member — Save Rs. {loyaltyOff.toLocaleString()} on this item
          </span>
        </div>
      )}

      {/* Special Offer Banner */}
      {discount > 0 && (
        <div className="p-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-xs font-bold text-rose-700">
            {discount}% OFF — Save {formatPrice(originalPrice! - price)}
          </span>
        </div>
      )}

      {/* Price Section */}
      <div>
        {discount > 0 ? (
          <div className="flex flex-col gap-1">
            <Badge variant="red" size="sm" className="w-fit mb-1">Save {discount}%</Badge>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-rose-600 tracking-tight">
                {formatPrice(price)}
              </span>
              <span className="text-lg line-through text-muted-400">
                {formatPrice(originalPrice!)}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
            {formatPrice(price)}
          </span>
        )}
        {selectedVariant?.price && (
          <p className="text-xs text-muted-500 mt-1">Variant price</p>
        )}
      </div>

      {/* Color / Variant Selector */}
      {variants.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-muted-500" />
            <label className="text-xs tracking-wider uppercase font-medium text-text-500">
              {selectedVariant ? `Selected: ${selectedVariant.name}` : "Select Option"}
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = variant.quantity === 0;
              const variantAttr = variant.attributes as Record<string, string> | null;
              const colorHex = variantAttr?.color || variantAttr?.hex || null;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200"
                      : isOutOfStock
                        ? "border-accent-200 bg-surface-100 text-muted-400 cursor-not-allowed line-through"
                        : "border-accent-200 bg-white text-text-700 hover:border-primary-300 hover:bg-primary-50/50",
                  )}
                >
                  {colorHex && (
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-black/10"
                      style={{ backgroundColor: colorHex }}
                    />
                  )}
                  {variant.name}
                  {variant.price && (
                    <span className="ml-1 text-xs text-muted-500">
                      +{formatPrice(parseFloat(variant.price))}
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedVariant?.sku && (
            <p className="text-[10px] text-muted-400 mt-2">SKU: {selectedVariant.sku}</p>
          )}
        </div>
      )}

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
            className={cn("p-3 bg-white text-text-600 hover:bg-accent-50 hover:text-text-900 transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed")}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center bg-white text-text-900 font-medium text-sm select-none border-x border-text-200 py-3">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={quantity >= product.quantity && !product.madeToOrder}
            className={cn("p-3 bg-white text-text-600 hover:bg-accent-50 hover:text-text-900 transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed")}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.quantity === 0}
          className={cn("w-full py-4 bg-text-900 text-white text-sm tracking-[0.1em] uppercase font-medium",
            "transition-all duration-300 hover:bg-primary-700",
            "disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          {addToCart.isPending ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Bag"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.quantity === 0}
          className={cn("w-full py-4 border border-text-900 text-text-900 text-sm tracking-[0.1em] uppercase font-medium",
            "transition-all duration-300 hover:bg-accent-50",
            "disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={handleSendAsGift}
          disabled={product.quantity === 0}
          className={cn("w-full py-4 bg-gradient-to-r from-rose-500 to-accent-500 text-white text-sm tracking-[0.1em] uppercase font-medium",
            "transition-all duration-300 hover:from-rose-600 hover:to-accent-600 shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2",
            "disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          <Gift className="w-4 h-4" />
          Send as Gift
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openModal("signin");
              return;
            }
            toggle();
          }}
          className={cn("w-full py-3 text-xs tracking-wider uppercase font-medium transition-colors flex items-center justify-center gap-2",
            isWishlisted ? "text-primary-600" : "text-text-600 hover:text-primary-600")}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Delivery Info */}
      <div className="space-y-3 pt-4 mt-4 border-t border-accent-200">
        <div className="flex items-start gap-3 text-sm text-text-600">
          <Truck className="w-4 h-4 text-text-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-text-900 text-xs">
              {product.freeShippingDomestic ? "Free SL Post Delivery" : "SL Post — Rs. 250"}
            </p>
            <p className="text-xs text-muted-500">1-3 business days • Express available at checkout</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-xs text-text-600">
          <RotateCcw className="w-4 h-4 text-text-400 shrink-0 mt-0.5" />
          <span>7-day easy returns</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-text-600">
          <Shield className="w-4 h-4 text-text-400 shrink-0 mt-0.5" />
          <span>Secure payment via PayHere</span>
        </div>
      </div>
    </div>
  );
}
