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
        "bg-white rounded-lg border border-accent-200 shadow-sm p-6",
        className,
      )}
    >
      <h3 className="font-serif text-lg text-text-900 mb-6">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-600">
            Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
          <span className="text-text-700 font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-600">Shipping</span>
          <span className="text-text-700 font-medium">
            {shippingCost === 0
              ? "Calculated at checkout"
              : formatPrice(shippingCost)}
          </span>
        </div>

        {onApplyCoupon && (
          <div className="pt-3 border-t border-accent-200">
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
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    couponState === "success"
                      ? "border-muted-500"
                      : couponState === "error"
                        ? "border-red-500"
                        : "border-accent-300",
                  )}
                  aria-label="Coupon code"
                />
                {couponState === "success" && (
                  <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-600" />
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
                  "border border-primary-500 text-primary-600",
                  "hover:bg-primary-50",
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
                  couponState === "success" ? "text-muted-600" : "text-red-600",
                )}
              >
                {couponMessage}
              </p>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-accent-200">
          <div className="flex justify-between text-sm">
            <span className="text-muted-600">Tax</span>
            <span className="text-text-700 font-medium">
              Included
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-text-200">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-text-900">Total</span>
            <span className="text-xl font-bold text-primary-600">
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
          "bg-primary-600 text-white hover:bg-primary-700",
          "shadow-rose",
        )}
      >
        Proceed to Checkout
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-500">
          <Shield className="w-3.5 h-3.5 text-muted-600" />
          Secure checkout with buyer protection
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-500">
          <Truck className="w-3.5 h-3.5 text-muted-600" />
          Free shipping on orders over Rs. 5,000
        </div>
      </div>

      <div className="mt-4 flex items-center flex-wrap gap-2 justify-center">
        {[
          { name: "Visa", url: "https://img.icons8.com/color/48/visa.png" },
          { name: "Mastercard", url: "https://img.icons8.com/color/48/mastercard.png" },
          { name: "PayPal", url: "https://img.icons8.com/color/48/paypal.png" },
          { name: "Apple Pay", url: "https://img.icons8.com/color/48/apple-pay.png" }
        ].map((method) => (
          <div key={method.name} className="bg-white rounded-md p-1 px-2 border border-surface-200 shadow-sm">
            <img
              src={method.url}
              alt={method.name}
              className="h-5 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
