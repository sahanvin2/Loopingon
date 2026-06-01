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
    label: "PayHere",
    description: "Credit/Debit cards, mobile wallets, and bank transfers",
    icon: "PH",
  },
  {
    id: "payable",
    label: "Payable",
    description: "Secure online payments with Sri Lankan bank accounts",
    icon: "PA",
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
      <div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg",
            "bg-cream-50 border border-cream-200 text-left",
            "hover:bg-cream-100 transition-colors",
          )}
        >
          <span className="font-medium text-charcoal-700">
            Order Summary ({orderItems.length} items)
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-terracotta-600 font-semibold">
              {formatPrice(total)}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-warm-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-warm-gray-500" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-2 border border-cream-200 rounded-lg overflow-hidden">
            {orderItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 border-b border-cream-200 last:border-b-0"
              >
                <div className="w-12 h-12 rounded-md bg-warm-gray-100 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-700 truncate">{item.name}</p>
                  <p className="text-xs text-warm-gray-500">Qty: {item.qty}</p>
                </div>
                <span className="text-sm font-medium text-charcoal-700">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setIsGift(!isGift)}
          className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-terracotta-600 transition-colors"
        >
          <Gift className="w-4 h-4" />
          {isGift ? "Remove gift options" : "Add a gift message"}
        </button>

        {isGift && (
          <div className="mt-3">
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Write your gift message..."
              rows={2}
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                "resize-none",
              )}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl text-charcoal-900 mb-4">Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                selectedPayment === method.id
                  ? "border-terracotta-500 bg-terracotta-50"
                  : "border-cream-300 hover:border-warm-gray-400",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedPayment === method.id
                    ? "border-terracotta-600"
                    : "border-warm-gray-300",
                )}
              >
                {selectedPayment === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
                )}
              </div>
              <span
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  method.id === "payhere"
                    ? "bg-blue-600 text-white"
                    : "bg-teal-600 text-white",
                )}
              >
                {method.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal-700">
                  {method.label}
                </p>
                <p className="text-xs text-warm-gray-500">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-cream-50 rounded-lg p-4 border border-cream-200">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-warm-gray-600">Subtotal</span>
          <span className="text-charcoal-700">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-warm-gray-600">Shipping</span>
          <span className="text-charcoal-700">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t border-cream-200">
          <span className="text-charcoal-900">Total</span>
          <span className="text-terracotta-600 text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-6 rounded-lg",
            "border border-cream-300 text-charcoal-700 font-medium transition-colors",
            "hover:bg-warm-gray-50",
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
            "bg-terracotta-600 text-white hover:bg-terracotta-700",
            "shadow-terracotta",
          )}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
