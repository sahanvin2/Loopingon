"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, subtotal } = useCartStore();

  const cartItems = useMemo(() => items, [items]);

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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-text-900">Shopping Cart</h1>
            <p className="mt-1 text-sm text-muted-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div key={item.id} layout exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}>
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary 
              subtotal={subtotal} 
              itemCount={itemCount} 
              onCheckout={() => router.push("/checkout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
