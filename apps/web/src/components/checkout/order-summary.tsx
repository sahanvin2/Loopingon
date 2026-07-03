"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function OrderSummary() {
  const { items, subtotal } = useCartStore();

  const shipping = items.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    if (p.freeShippingDomestic) return acc;
    const cost = p.shippingPrice ? Number(p.shippingPrice) : 400; // default to 400
    return acc + (cost * item.quantity);
  }, 0);

  const total = subtotal + shipping;

  const totalSavings = items.reduce((acc, item) => {
    const compareAt = item.product?.compareAtPrice ? parseFloat(item.product.compareAtPrice.toString()) : 0;
    const price = parseFloat(item.price.toString());
    if (compareAt > price) {
      return acc + ((compareAt - price) * item.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-soft-md p-6 sticky top-24">
      <h2 className="font-serif text-xl font-bold text-text-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => {
          const image = item.product?.images?.[0]?.url || "/images/placeholder.jpg";
          const title = item.product?.title || "Unknown Item";
          const variantName = item.variant?.name;
          
          const compareAtPrice = item.product?.compareAtPrice ? parseFloat(item.product.compareAtPrice.toString()) : 0;
          const price = parseFloat(item.price.toString());
          const hasDiscount = compareAtPrice > price;
          const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

          return (
            <div key={`${item.id}-${item.variantId}`} className="flex gap-4">
              <div className="relative w-16 h-16 shrink-0 mt-1">
                <div className="w-full h-full rounded-lg overflow-hidden border border-surface-200">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center z-10 shadow-md">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-sm font-medium text-text-900 line-clamp-2 leading-tight">{title}</h4>
                  <div className="flex flex-col items-end">
                    <p className={cn("text-sm font-semibold shrink-0 mt-0.5", hasDiscount ? "text-rose-600" : "text-text-900")}>
                      {formatPrice(price)}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs line-through text-muted-400">
                        {formatPrice(compareAtPrice)}
                      </p>
                    )}
                  </div>
                </div>
                {variantName && (
                  <p className="text-xs text-text-500 mt-1 truncate">
                    {variantName}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-muted-500 font-medium">Qty: {item.quantity}</p>
                  {hasDiscount && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      <span>{discountPercent}% OFF</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-6 border-t border-surface-200 text-sm">
        <div className="flex justify-between text-text-600">
          <span>Subtotal</span>
          <span className="font-medium text-text-900">{formatPrice(subtotal)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-rose-600 font-medium">
            <span>Total Savings</span>
            <span>-{formatPrice(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between text-text-600">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-teal-600">Free</span>
          ) : (
            <span className="font-medium text-text-900">{formatPrice(shipping)}</span>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-surface-200 flex justify-between items-center">
        <span className="font-bold text-text-900 text-lg">Total</span>
        <span className="font-bold text-primary-600 text-xl">{formatPrice(total)}</span>
      </div>
      
      {totalSavings > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl flex items-center gap-2 justify-center">
          <span className="text-xs font-bold text-rose-700">
            🎉 You're saving {formatPrice(totalSavings)} on this order!
          </span>
        </div>
      )}
    </div>
  );
}
