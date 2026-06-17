"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { items, subtotal } = useCartStore();

  const shipping = items.reduce((acc, item) => {
    const p = item.product;
    if (!p) return acc;
    if (p.freeShippingDomestic) return acc;
    const cost = p.shippingPrice ? Number(p.shippingPrice) : 400; // default to 400 if not specified as user requested
    return acc + (cost * item.quantity);
  }, 0);

  const expressShipping = shipping + 300; // Just an example if they choose express
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-soft-md p-6 sticky top-24">
      <h2 className="font-serif text-xl font-bold text-text-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => {
          const image = item.product?.images?.[0]?.url || "/images/placeholder.jpg";
          const title = item.product?.title || "Unknown Item";
          const variantName = item.variant?.name;
          
          return (
            <div key={`${item.id}-${item.variantId}`} className="flex gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-surface-200 shrink-0">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-10 shadow-sm">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-900 line-clamp-2 leading-tight mb-1">{title}</h4>
                {variantName && (
                  <p className="text-xs text-text-500 mb-1 truncate">
                    {variantName}
                  </p>
                )}
                <p className="text-sm font-semibold text-text-900">
                  {formatPrice(parseFloat(item.price))}
                </p>
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
    </div>
  );
}
