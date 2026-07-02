"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Heart, Minus, Plus, Shield, Truck, RotateCcw, Gift, Sparkles, Palette, Crown, ChevronDown,
} from "lucide-react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useLoyaltyDiscount } from "@/hooks/use-loyalty";
import { Badge } from "@/components/shared/badge";

function getColorHex(name: string, attrHex: string | null): string {
  if (attrHex) return attrHex;
  const n = name.toLowerCase();
  if (n.includes("beige")) return "#E8D8C8";
  if (n.includes("brown")) return "#8B5A2B";
  if (n.includes("black")) return "#1A1A1A";
  if (n.includes("white")) return "#F5F5F0";
  if (n.includes("sand")) return "#E2CAAA";
  if (n.includes("honey")) return "#E5A65D";
  if (n.includes("caramel")) return "#C68E5A";
  if (n.includes("peach")) return "#FFD3B6";
  if (n.includes("rose")) return "#FFB7B2";
  if (n.includes("pink")) return "#FFC6FF";
  if (n.includes("blue")) return "#BDE0FE";
  if (n.includes("green")) return "#CAFFBF";
  return "#D1D5DB";
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

export interface ProductPriceAreaProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (v: ProductVariant | null) => void;
}

export function ProductPriceArea({ product, selectedVariant, setSelectedVariant }: ProductPriceAreaProps) {
  const { data: loyaltyDiscount } = useLoyaltyDiscount();
  const loyaltyOff = loyaltyDiscount?.data?.discount || 0;
  const loyaltyTier = loyaltyDiscount?.data?.tier || null;

  const variants = product.variants || [];
  const variantPrice = selectedVariant?.price ? parseFloat(selectedVariant.price) : null;
  const price = variantPrice || parseFloat(product.price);
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const discount = originalPrice ? calculateDiscount(price, originalPrice) : 0;

  return (
    <div className="space-y-6">
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
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-500" />
            <label className="text-xs tracking-wider uppercase font-semibold text-text-500">
              {selectedVariant ? `Selected: ${selectedVariant.name}` : "Select Option"}
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = variant.quantity === 0;
              const variantAttr = variant.attributes as Record<string, string> | null;
              const attrHex = variantAttr?.color || variantAttr?.hex || null;

              const isColor = attrHex || ["beige", "black", "white", "brown", "sand", "honey", "caramel", "coconut", "peach", "rose", "pink", "blue", "green"].some(c => variant.name.toLowerCase().includes(c));

              if (isColor) {
                const hexColor = getColorHex(variant.name, attrHex);
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "relative w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center shrink-0",
                      isSelected
                        ? "border-neutral-900 scale-110 shadow-md ring-2 ring-neutral-200 ring-offset-1"
                        : isOutOfStock
                          ? "border-neutral-200 opacity-30 cursor-not-allowed"
                          : "border-neutral-200 hover:border-neutral-400 hover:scale-105",
                    )}
                    title={`${variant.name}${isOutOfStock ? " (Out of Stock)" : ""}`}
                    aria-label={`Select ${variant.name}`}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: hexColor }}
                    />
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-neutral-400 rotate-45" />
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                    isSelected
                      ? "border-neutral-900 bg-neutral-50 text-neutral-900 ring-1 ring-neutral-900"
                      : isOutOfStock
                        ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                        : "border-neutral-200 bg-white text-text-700 hover:border-neutral-400 hover:bg-neutral-50/50",
                  )}
                >
                  {variant.name}
                  {variant.price && (
                    <span className="ml-1 text-xs text-muted-500">
                      +{formatPrice(parseFloat(variant.price))}
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
    </div>
  );
}

import { useAnalytics } from "@/hooks/use-analytics";

export interface ProductActionAreaProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  setQuantity: (q: number) => void;
}

export function ProductActionArea({ product, selectedVariant, quantity, setQuantity }: ProductActionAreaProps) {
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist(product.id);
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  
  const { trackInteraction } = useAnalytics();

  const variantPrice = selectedVariant?.price ? parseFloat(selectedVariant.price) : null;
  const price = variantPrice || parseFloat(product.price);
  const stock = getStockStatus(product, selectedVariant ?? undefined);

  const handleAddToCart = () => {
    trackInteraction({ type: "ADD_TO_CART", productId: product.id });
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id ?? undefined,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (stock.label === "Out of Stock") return;
    if (!isAuthenticated) {
      openModal("signin");
      return;
    }
    trackInteraction({ type: "PURCHASE", productId: product.id });
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id ?? undefined,
      quantity,
    }, {
      onSuccess: () => {
        router.push("/checkout");
      },
      onError: () => {}
    });
  };

  const handleSendAsGift = () => {
    router.push(`/gift?product=${product.id}&variant=${selectedVariant?.id || ""}&qty=${quantity}&price=${price}&title=${encodeURIComponent(product.title)}`);
  };

  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span className={cn("w-2 h-2 rounded-full", stock.color.includes("green") ? "bg-green-500 animate-pulse-soft" : stock.color.includes("amber") ? "bg-amber-500" : "bg-red-500")} />
        <span className={stock.color}>{stock.label}</span>
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-widest uppercase font-bold text-neutral-500">Quantity</label>
        <div className="flex items-center w-36 h-12 bg-white rounded-full border-2 border-neutral-200 overflow-hidden shadow-sm transition-all hover:border-neutral-300">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-bold text-neutral-900 text-sm border-x border-neutral-100">
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(selectedVariant?.quantity || product.quantity || 10, quantity + 1))}
            className="flex-1 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.quantity === 0}
          className={cn("relative w-full py-4 overflow-hidden rounded-full bg-rose-600 text-white text-sm tracking-[0.1em] uppercase font-bold",
            "transition-all duration-300 hover:bg-rose-700 hover:shadow-[0_8px_30px_rgba(225,29,72,0.3)] hover:-translate-y-0.5",
            "disabled:opacity-50 disabled:cursor-not-allowed group")}
        >
          Buy It Now
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.quantity === 0}
          className={cn("w-full py-4 rounded-full border border-black bg-white text-black text-sm tracking-[0.1em] uppercase font-bold",
            "transition-all duration-300 hover:bg-neutral-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5",
            "disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          {addToCart.isPending ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleSendAsGift}
          disabled={product.quantity === 0}
          className={cn("w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm tracking-[0.1em] uppercase font-bold",
            "transition-all duration-500 hover:from-purple-600 hover:to-indigo-600 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2",
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
            if (!isWishlisted) {
              trackInteraction({ type: "WISHLIST", productId: product.id });
            }
            toggle();
          }}
          className={cn("w-full py-3 text-xs tracking-wider uppercase font-semibold transition-colors flex items-center justify-center gap-2",
            isWishlisted ? "text-primary-600" : "text-text-600 hover:text-primary-600")}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
