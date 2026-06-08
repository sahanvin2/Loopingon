"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { EmptyCart } from "@/components/cart/empty-cart";

import { OrderSummary } from "@/components/checkout/order-summary";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50 py-16">
        <div className="mx-auto max-w-2xl px-4">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 font-serif text-3xl font-bold text-text-900">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-2xl shadow-soft-sm border border-surface-200 p-6 md:p-8">
              <CheckoutForm className="max-w-full" />
            </div>
          </div>
          
          <div className="lg:col-span-5 xl:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
