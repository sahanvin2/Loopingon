"use client";

import React, { useState } from "react";
import { ChevronLeft, Gift, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface GiftFormData {
  isGift: boolean;
  giftMessage: string;
  giftWrap: boolean;
}

interface PaymentStepProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  selectedPayment: string;
  onPaymentChange: (method: string) => void;
  giftData: GiftFormData;
  onGiftChange: (data: GiftFormData) => void;
  orderError?: string | null;
  isSubmitting?: boolean;
  className?: string;
}

const paymentMethods = [
  { id: "payhere", label: "Credit / Debit Cards (PayHere)", description: "Visa, Mastercard, Amex, Discover", icon: "💳" },
  { id: "koko", label: "Koko - Buy Now, Pay Later", description: "Split your payment into 3 interest-free installments", icon: "K" },
  { id: "mintpay", label: "Mintpay", description: "Pay in 3 installments, 0% interest", icon: "M" },
  { id: "payable", label: "Bank Transfer (Payable)", description: "Secure online payments with Sri Lankan bank accounts", icon: "🏦" },
];

export function PaymentStep({ onBack, onPlaceOrder, selectedPayment, onPaymentChange, giftData, onGiftChange, orderError, isSubmitting, className }: PaymentStepProps) {
  const { items, subtotal } = useCartStore();
  const shipping = 350;
  const total = subtotal + shipping;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Order Summary */}
      <div className="bg-surface-50 rounded-xl p-4 border border-accent-200">
        <h3 className="font-serif text-lg text-text-900 mb-3">Order Summary</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="text-text-700 font-medium truncate">{item.product?.title || "Product"}</p>
                <p className="text-xs text-muted-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-text-700 font-medium ml-4 shrink-0">Rs. {formatPrice(parseFloat(item.price || "0") * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-accent-200 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-500">Subtotal</span><span className="text-text-700">Rs. {formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-500">Shipping</span><span className="text-text-700">Rs. {formatPrice(shipping)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-accent-200">
            <span>Total</span><span className="text-primary-600">Rs. {formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Gift Options */}
      <div>
        <button type="button" onClick={() => onGiftChange({ ...giftData, isGift: !giftData.isGift })}
          className="flex items-center gap-2 text-sm text-muted-600 hover:text-primary-600 transition-colors"
        >
          <Gift className="w-4 h-4" />
          {giftData.isGift ? "Remove gift options" : "Send as a gift (Add a message)"}
        </button>
        {giftData.isGift && (
          <div className="mt-3 space-y-3">
            <textarea value={giftData.giftMessage} onChange={(e) => onGiftChange({ ...giftData, giftMessage: e.target.value })}
              placeholder="Write your gift message..." rows={2}
              className="w-full px-3 py-2 rounded-lg border border-accent-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <label className="flex items-center gap-2 text-sm text-text-600 cursor-pointer">
              <input type="checkbox" checked={giftData.giftWrap} onChange={(e) => onGiftChange({ ...giftData, giftWrap: e.target.checked })}
                className="rounded border-accent-300 text-primary-600 focus:ring-primary-500"
              />
              Add gift wrap (+Rs. 200)
            </label>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="font-serif text-xl text-text-900 mb-4">Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button key={method.id} type="button" onClick={() => onPaymentChange(method.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                selectedPayment === method.id ? "border-primary-500 bg-primary-50" : "border-accent-300 hover:border-muted-400",
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", selectedPayment === method.id ? "border-primary-600" : "border-muted-300")}>
                {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
              </div>
              <span className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0", method.id === "payhere" ? "bg-blue-600 text-white" : "bg-muted-600 text-white")}>
                {method.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-text-700">{method.label}</p>
                <p className="text-xs text-muted-500">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {orderError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{orderError}</div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={onBack} disabled={isSubmitting}
          className={cn("flex items-center justify-center gap-2 py-3 px-6 rounded-lg", "border border-accent-300 text-text-700 font-medium transition-colors hover:bg-accent-50", isSubmitting && "opacity-50 cursor-not-allowed")}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button type="button" onClick={onPlaceOrder} disabled={isSubmitting}
          className={cn("flex-1 py-3.5 rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2", "bg-primary-600 text-white hover:bg-primary-700 shadow-rose", isSubmitting && "opacity-50 cursor-not-allowed")}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
