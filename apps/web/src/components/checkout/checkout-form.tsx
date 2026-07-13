"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { post } from "@/lib/api-client";
import { toast } from "sonner";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type CheckoutStep = "shipping" | "confirmation";

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "shipping", label: "Details" },
  { key: "confirmation", label: "Confirmed" },
];

interface BillingFormData {
  email: string;
  fullName: string;
  phone: string;
}

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    id: string;
    orderNumber: string;
    referenceCode: string;
    totalAmount: string;
    expiresAt: string;
  } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [billingData, setBillingData] = useState<BillingFormData>({
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  const handleNext = useCallback(async (data: BillingFormData) => {
    setBillingData(data);
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      }));

      const vendorId = items[0]?.product?.vendorId || undefined;

      const payload: any = {
        items: orderItems,
        customerNotes: undefined,
      };
      if (vendorId) payload.vendorId = vendorId;

      const res = await post<{
        data: {
          order: { id: string; orderNumber: string; totalAmount: string; expiresAt: string };
          referenceCode: string;
          paymentTimeoutMinutes: number;
        };
      }>("/p2p", payload);

      const { order, referenceCode } = res.data;
      clearCart();
      toast.success("Order created! Redirecting to payment portal...");
      router.push(`/dashboard/p2p-orders/${order.id}`);
    } catch (err: any) {
      let message = "Failed to place order.";
      if (err?.message) {
        if (typeof err.message === "string") message = err.message;
        else if (Array.isArray(err.message)) message = err.message[0]?.message || err.message[0];
        else if (typeof err.message === "object") message = err.message.message || JSON.stringify(err.message);
      }
      setOrderError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [items, clearCart]);

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
                    ? "bg-green-500 text-white"
                    : i === currentIndex
                      ? "bg-primary-600 text-white"
                      : "bg-muted-200 text-muted-500",
                )}
              >
                {i < currentIndex ? "\u2713" : i + 1}
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
                  i < currentIndex ? "bg-green-500" : "bg-muted-200",
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
            <ShippingStep
              initialData={billingData}
              onNext={handleNext}
              orderError={orderError}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}

        {currentStep === "confirmation" && orderResult && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-text-900 mb-3">Order Created!</h2>
            <p className="text-sm text-muted-500 mb-2">
              Order #{orderResult.orderNumber}
            </p>

            {/* Payment Instructions Card */}
            <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6 text-left max-w-md mx-auto mb-6">
              <h3 className="font-semibold text-text-900 mb-3">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-500">Amount</span>
                  <span className="font-bold text-text-900">Rs. {formatPrice(Number(orderResult.totalAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Bank</span>
                  <span className="text-text-800">Dialog Finance PLC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Account</span>
                  <span className="text-text-800">001020613595</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Account Name</span>
                  <span className="text-text-800">Sahan Nawarathne</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Branch</span>
                  <span className="text-text-800">Head Office</span>
                </div>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-muted-500 mb-1">Reference Code</p>
                  <p className="text-lg font-bold text-primary-600 font-mono">{orderResult.referenceCode}</p>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-orange-700">
                  Include the <strong>Reference Code</strong> in your bank transfer to ensure automatic matching.
                  Payment must be completed within 25 minutes.
                </p>
              </div>
            </div>

            <p className="text-muted-500 max-w-md mx-auto mb-8 text-sm">
              Click below to view your order. After transferring payment, click "I've Paid" on the order page to get instant digital delivery.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={`/dashboard/orders/${orderResult.id}`}
                className={cn(
                  "inline-flex items-center px-8 py-3 rounded-lg",
                  "bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors",
                )}
              >
                View Order & Pay
              </Link>
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center px-8 py-3 rounded-lg",
                  "border border-accent-300 text-text-700 font-medium hover:bg-accent-50 transition-colors",
                )}
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
