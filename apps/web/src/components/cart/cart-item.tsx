"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { cn, getImageUrl, formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";
import { useUpdateCartItem, useRemoveCartItem } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const product = item.product;
  if (!product) return null;

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.thumbnail || primaryImage?.url);
  const price = parseFloat(item.price || product.price);
  const subtotal = price * item.quantity;
  const variant = item.variant
    ? item.variant
    : product.variants?.find((v) => v.id === item.variantId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "flex gap-4 p-4 bg-white rounded-lg border border-blush-200",
        "hover:shadow-sm transition-shadow",
      )}
    >
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted-100 relative">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="font-medium text-charcoal-900 hover:text-rose-600 transition-colors line-clamp-2"
            >
              {product.title}
            </Link>
            {product.vendor && (
              <p className="text-xs text-muted-500 mt-0.5">
                {product.vendor.storeName}
              </p>
            )}
          </div>
          <span className="font-semibold text-rose-600 whitespace-nowrap">
            {formatPrice(subtotal)}
          </span>
        </div>

        {variant && (
          <p className="text-xs text-muted-500 mt-1">{variant.name}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-blush-300 rounded-lg">
            <button
              type="button"
              onClick={() =>
                updateCartItem.mutate({
                  itemId: item.id,
                  quantity: item.quantity - 1,
                })
              }
              disabled={updateCartItem.isPending}
              className="p-1.5 text-muted-600 hover:text-charcoal-700 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm text-charcoal-700 font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                updateCartItem.mutate({
                  itemId: item.id,
                  quantity: item.quantity + 1,
                })
              }
              disabled={updateCartItem.isPending}
              className="p-1.5 text-muted-600 hover:text-charcoal-700 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-muted-500 hover:text-rose-600 transition-colors flex items-center gap-1"
              aria-label="Save for later"
            >
              <Heart className="w-3.5 h-3.5" /> Save
            </button>
            <button
              type="button"
              onClick={() => removeCartItem.mutate(item.id)}
              disabled={removeCartItem.isPending}
              className={cn(
                "text-xs text-red-600 hover:text-red-700 transition-colors",
                "flex items-center gap-1 disabled:opacity-40",
              )}
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
