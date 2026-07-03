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

type CheckoutStep = "shipping" | "confirmation";

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "shipping", label: "Delivery" },
  { key: "confirmation", label: "Confirmed" },
];

interface ShippingFormData {
  email: string;
  fullName: string;
  phone: string;
  contactNumberTwo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  facebookPage: string;
  orderNote: string;
  dueDate: string;
}

interface GiftFormData {
  isGift: boolean;
  giftMessage: string;
  giftWrap: boolean;
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
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("KOOMBIYO");
  const [orderError, setOrderError] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    contactNumberTwo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Sri Lanka",
    facebookPage: "",
    orderNote: "",
    dueDate: "",
  });

  const [giftData, setGiftData] = useState<GiftFormData>({
    isGift: false,
    giftMessage: "",
    giftWrap: false,
  });

  const handleShippingNext = useCallback(async (data: ShippingFormData, method: string) => {
    setShippingData(data);
    setSelectedMethod(method);
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const vendorId = items[0]?.product?.vendorId || "";
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      }));

      const res = await post<{ data: { id: string; orderNumber: string } }>("/orders", {
        vendorId,
        items: orderItems,
        shippingAddress: {
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          district: data.district,
          postalCode: data.postalCode,
          country: data.country,
        },
        shippingMethod: method,
        paymentMethod: "COD",
        contactNumberTwo: data.contactNumberTwo,
        facebookPage: data.facebookPage,
        orderNote: data.orderNote,
        expectedDelivery: data.dueDate,
        isGift: giftData.isGift,
        giftMessage: giftData.giftMessage || undefined,
        giftWrap: giftData.giftWrap || undefined,
        couponCode: undefined,
      });

      setOrderId(res.data.id);
      clearCart();
      setCurrentStep("confirmation");
      toast.success("Order placed! Pay on delivery.");
    } catch (err: any) {
      const message = err?.message || "Failed to place order.";
      setOrderError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [items, giftData, clearCart]);

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
              initialData={shippingData}
              onNext={handleShippingNext}
              selectedMethod={selectedMethod}
              orderError={orderError}
              isSubmitting={isSubmitting}
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
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-text-900 mb-3">Order Confirmed!</h2>
            {orderId && (
              <p className="text-sm text-muted-500 mb-2">Order #{orderId.slice(0, 8).toUpperCase()}</p>
            )}
            <p className="text-muted-600 max-w-md mx-auto mb-2">
              Your order has been placed successfully.
            </p>
            <p className="text-muted-500 max-w-md mx-auto mb-8 text-sm">
              Pay cash when your order arrives. We will deliver via Koombiyo within 1-3 business days.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/dashboard/orders"
                className={cn(
                  "inline-flex items-center px-8 py-3 rounded-lg",
                  "bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors",
                )}
              >
                View Order
              </a>
              <a
                href="/products"
                className={cn(
                  "inline-flex items-center px-8 py-3 rounded-lg",
                  "border border-accent-300 text-text-700 font-medium hover:bg-accent-50 transition-colors",
                )}
              >
                Continue Shopping
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
