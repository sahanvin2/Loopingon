"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, Gift } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface PaymentStepProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  className?: string;
}

const paymentMethods = [
  {
    id: "payhere",
    label: "Credit / Debit Cards (PayHere)",
    description: "Visa, Mastercard, Amex, Discover",
    icon: "💳",
  },
  {
    id: "koko",
    label: "Koko - Buy Now, Pay Later",
    description: "Split your payment into 3 interest-free installments",
    icon: "K",
  },
  {
    id: "mintpay",
    label: "Mintpay",
    description: "Pay in 3 installments, 0% interest",
    icon: "M",
  },
  {
    id: "payable",
    label: "Bank Transfer (Payable)",
    description: "Secure online payments with Sri Lankan bank accounts",
    icon: "🏦",
  },
];

const orderItems = [
  { name: "Handloom Silk Saree", qty: 1, price: 12500, image: "/images/products/saree1.jpg" },
  { name: "Raksha Mask - Medium", qty: 2, price: 8500, image: "/images/products/mask1.jpg" },
];

export function PaymentStep({ onBack, onPlaceOrder, className }: PaymentStepProps) {
  const [selectedPayment, setSelectedPayment] = useState("payhere");
  const [isExpanded, setIsExpanded] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [isGift, setIsGift] = useState(false);

  const subtotal = 29500;
  const shipping = 350;
  const total = subtotal + shipping;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Order Summary Removed (Now in right column) */}

      <div>
        <button
          type="button"
          onClick={() => setIsGift(!isGift)}
          className="flex items-center gap-2 text-sm text-muted-600 hover:text-primary-600 transition-colors"
        >
          <Gift className="w-4 h-4" />
          {isGift ? "Remove gift options" : "Send as a gift (Add a message)"}
        </button>

        {isGift && (
          <div className="mt-3">
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Write your gift message..."
              rows={2}
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-accent-300 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "resize-none",
              )}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl text-text-900 mb-4">Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                selectedPayment === method.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-accent-300 hover:border-muted-400",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedPayment === method.id
                    ? "border-primary-600"
                    : "border-muted-300",
                )}
              >
                {selectedPayment === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                )}
              </div>
              <span
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  method.id === "payhere"
                    ? "bg-blue-600 text-white"
                    : "bg-muted-600 text-white",
                )}
              >
                {method.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-text-700">
                  {method.label}
                </p>
                <p className="text-xs text-muted-500">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-accent-200">
        <h4 className="font-serif text-sm font-bold text-navy-900 mb-3 text-center sm:text-left">Secure Payments</h4>
        <div className="flex items-center flex-wrap gap-2 justify-center sm:justify-start">
          {[
            { name: "Visa", url: "https://img.icons8.com/color/48/visa.png" },
            { name: "Mastercard", url: "https://img.icons8.com/color/48/mastercard.png" },
            { name: "PayPal", url: "https://img.icons8.com/color/48/paypal.png" },
            { name: "Apple Pay", url: "https://img.icons8.com/color/48/apple-pay.png" },
            { name: "Google Pay", url: "https://img.icons8.com/color/48/google-pay-india.png" }
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

      {/* Subtotal removed */}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-6 rounded-lg",
            "border border-accent-300 text-text-700 font-medium transition-colors",
            "hover:bg-accent-50",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          className={cn(
            "flex-1 py-3.5 rounded-lg text-base font-medium transition-colors",
            "bg-primary-600 text-white hover:bg-primary-700",
            "shadow-rose",
          )}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
