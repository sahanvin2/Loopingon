"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Shield, Truck } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  shipping?: string;
  onApplyCoupon?: (code: string) => Promise<void>;
  onCheckout?: () => void;
  className?: string;
}

export function CartSummary({
  subtotal,
  itemCount,
  shipping,
  onApplyCoupon,
  onCheckout,
  className,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !onApplyCoupon) return;
    setCouponState("loading");
    try {
      await onApplyCoupon(couponCode.trim());
      setCouponState("success");
      setCouponMessage("Coupon applied successfully!");
    } catch (err: unknown) {
      setCouponState("error");
      setCouponMessage(
        err instanceof Error ? err.message : "Invalid coupon code",
      );
    }
  };

  const shippingCost = shipping ? parseFloat(shipping) : 0;
  const total = subtotal + shippingCost;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-cream-200 shadow-sm p-6",
        className,
      )}
    >
      <h3 className="font-serif text-lg text-charcoal-900 mb-6">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray-600">
            Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
          <span className="text-charcoal-700 font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-warm-gray-600">Shipping</span>
          <span className="text-charcoal-700 font-medium">
            {shippingCost === 0
              ? "Calculated at checkout"
              : formatPrice(shippingCost)}
          </span>
        </div>

        {onApplyCoupon && (
          <div className="pt-3 border-t border-cream-200">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponState !== "idle") setCouponState("idle");
                  }}
                  placeholder="Coupon code"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm border",
                    "focus:outline-none focus:ring-2 focus:ring-terracotta-500",
                    couponState === "success"
                      ? "border-teal-500"
                      : couponState === "error"
                        ? "border-red-500"
                        : "border-cream-300",
                  )}
                  aria-label="Coupon code"
                />
                {couponState === "success" && (
                  <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                )}
                {couponState === "error" && (
                  <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                )}
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponState === "loading" || !couponCode.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  "border border-terracotta-500 text-terracotta-600",
                  "hover:bg-terracotta-50",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {couponState === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {couponMessage && (
              <p
                className={cn(
                  "text-xs mt-1.5",
                  couponState === "success" ? "text-teal-600" : "text-red-600",
                )}
              >
                {couponMessage}
              </p>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-cream-200">
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray-600">Tax</span>
            <span className="text-charcoal-700 font-medium">
              Included
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-charcoal-200">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-charcoal-900">Total</span>
            <span className="text-xl font-bold text-terracotta-600">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className={cn(
          "mt-6 w-full py-3.5 rounded-lg text-base font-medium transition-colors",
          "bg-terracotta-600 text-white hover:bg-terracotta-700",
          "shadow-terracotta",
        )}
      >
        Proceed to Checkout
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-warm-gray-500">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          Secure checkout with buyer protection
        </div>
        <div className="flex items-center gap-2 text-xs text-warm-gray-500">
          <Truck className="w-3.5 h-3.5 text-teal-600" />
          Free shipping on orders over Rs. 5,000
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {["Visa", "Mastercard", "Amex", "PayHere"].map((method) => (
          <span
            key={method}
            className="text-xs text-warm-gray-400 font-medium bg-cream-50 px-2 py-1 rounded"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}
