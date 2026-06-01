"use client";

import React from "react";
import { Truck, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface ShippingStepProps {
  onNext: () => void;
  addresses?: Address[];
  className?: string;
}

const shippingMethods = [
  {
    id: "STANDARD",
    label: "Standard Shipping",
    description: "5-7 business days",
    price: "Rs. 350",
  },
  {
    id: "EXPRESS",
    label: "Express Shipping",
    description: "2-3 business days",
    price: "Rs. 750",
  },
  {
    id: "FREE",
    label: "Free Shipping",
    description: "5-7 business days • Orders over Rs. 5,000",
    price: "Free",
  },
];

export function ShippingStep({ onNext, addresses = [], className }: ShippingStepProps) {
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(
    addresses[0]?.id || null,
  );
  const [selectedMethod, setSelectedMethod] = React.useState("STANDARD");

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="font-serif text-xl text-charcoal-900 mb-1">
          Shipping Address
        </h2>
        <p className="text-sm text-warm-gray-500 mb-4">
          Select a delivery address
        </p>

        <div className="p-4 rounded-lg border border-cream-300 bg-cream-50">
          <p className="text-charcoal-700 font-medium">
            Add a new delivery address
          </p>
          <p className="text-sm text-warm-gray-500 mt-1">
            You&apos;ll enter your address details below.
          </p>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+94 XXX XXX XXXX"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                  )}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                placeholder="Street address"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Postal code"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-cream-300 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent",
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-charcoal-900 mb-4">
          Shipping Method
        </h2>
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                selectedMethod === method.id
                  ? "border-terracotta-500 bg-terracotta-50"
                  : "border-cream-300 hover:border-warm-gray-400",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedMethod === method.id
                    ? "border-terracotta-600"
                    : "border-warm-gray-300",
                )}
              >
                {selectedMethod === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
                )}
              </div>
              <Truck className="w-5 h-5 text-warm-gray-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal-700">
                  {method.label}
                </p>
                <p className="text-xs text-warm-gray-500">{method.description}</p>
              </div>
              <span className="text-sm font-medium text-charcoal-700">
                {method.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className={cn(
          "w-full py-3.5 rounded-lg text-base font-medium transition-colors",
          "bg-terracotta-600 text-white hover:bg-terracotta-700",
          "shadow-terracotta",
        )}
      >
        Continue to Payment
      </button>
    </div>
  );
}
