"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";

type CheckoutStep = "shipping" | "payment" | "confirmation";

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
];

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  i < currentIndex
                    ? "bg-muted-600 text-white"
                    : i === currentIndex
                      ? "bg-primary-600 text-white"
                      : "bg-muted-200 text-muted-500",
                )}
              >
                {i < currentIndex ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:inline",
                  i <= currentIndex ? "text-text-900" : "text-muted-400",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 sm:w-24 h-0.5 mx-2 transition-colors",
                  i < currentIndex ? "bg-muted-600" : "bg-muted-200",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "shipping" && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ShippingStep onNext={() => setCurrentStep("payment")} />
          </motion.div>
        )}

        {currentStep === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <PaymentStep
              onBack={() => setCurrentStep("shipping")}
              onPlaceOrder={() => setCurrentStep("confirmation")}
            />
          </motion.div>
        )}

        {currentStep === "confirmation" && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-muted-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-muted-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-text-900 mb-3">
              Order Confirmed!
            </h2>
            <p className="text-muted-600 max-w-md mx-auto mb-8">
              Thank you for your order! You&apos;ll receive a confirmation email
              shortly. Your handcrafted treasures are being prepared.
            </p>
            <a
              href="/dashboard/orders"
              className={cn(
                "inline-flex items-center px-8 py-3 rounded-lg",
                "bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors",
              )}
            >
              View Order
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
