"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { EmptyCart } from "@/components/cart/empty-cart";

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
      <div className="min-h-screen bg-cream-100 py-16">
        <div className="mx-auto max-w-2xl px-4">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-center font-serif text-3xl font-bold text-charcoal-900">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
