"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

export function EmptyCart() {
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useUIStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-primary-400" />
      </div>

      <h2 className="font-serif text-2xl text-text-900 mb-2">Your Cart is Empty</h2>
      <p className="text-muted-600 max-w-sm mb-8">
        Looks like you haven&apos;t added any handmade treasures to your cart
        yet. Discover unique Sri Lankan crafts waiting for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/products"
          className={cn(
            "inline-flex items-center justify-center px-8 py-3 rounded-lg",
            "bg-primary-600 text-white font-medium",
            "hover:bg-primary-700 transition-colors",
            "shadow-rose",
          )}
        >
          Browse Handmade Treasures
        </Link>

        {!isAuthenticated && (
          <button
            onClick={() => openModal("signin")}
            className={cn(
              "inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg",
              "border border-accent-300 text-text-700 font-medium",
              "hover:bg-accent-50 transition-colors",
            )}
          >
            <LogIn className="w-4 h-4" />
            Sign in to see saved items
          </button>
        )}
      </div>
    </motion.div>
  );
}
