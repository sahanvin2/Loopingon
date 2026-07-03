"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { get } from "@/lib/api-client";
import { useCart } from "@/hooks/use-cart";
import type { ApiResponse, Cart, CartItem } from "@/types";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();
  
  useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      const savedCart = useCartStore.getState().items;
      if (savedCart.length === 0) {
        try {
          const persisted = localStorage.getItem("cart-storage");
          if (persisted) {
            const parsed = JSON.parse(persisted);
            if (parsed?.state?.items?.length > 0) {
              setCart(parsed.state.items);
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [isAuthenticated, setCart]);

  return <>{children}</>;
}
