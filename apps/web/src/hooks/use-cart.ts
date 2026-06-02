"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/api-client";
import type { Cart, CartItem, ApiResponse } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export function useCart() {
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await get<ApiResponse<Cart & { items: CartItem[] }>>("/cart");
      const cart = response.data;
      setCart(cart.items || []);
      return cart;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { addItem, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity = 1,
    }: {
      productId: string;
      variantId?: string;
      quantity?: number;
    }) => {
      if (isAuthenticated) {
        const response = await post<ApiResponse<CartItem>>("/cart/items", {
          productId,
          variantId,
          quantity,
        });
        return response.data;
      }
      return { productId, variantId, quantity, id: crypto.randomUUID(), price: "0", cartId: "", createdAt: "", updatedAt: "" } as unknown as CartItem;
    },
    onMutate: async ({ productId, variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousItems = items;
      const safeQuantity = quantity ?? 1;
      addItem({
        id: crypto.randomUUID(),
        cartId: "",
        productId,
        variantId: variantId || null,
        quantity: safeQuantity,
        price: "0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      toast.error("Failed to add item to cart");
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      toast.success("Added to cart");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { updateQuantity, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (isAuthenticated) {
        const response = await patch<ApiResponse<CartItem>>(`/cart/items/${itemId}`, {
          quantity,
        });
        return response.data;
      }
      return { id: itemId, quantity };
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousItems = items;
      updateQuantity(itemId, quantity);
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      toast.error("Failed to update cart");
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { removeItem, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (isAuthenticated) {
        return del<ApiResponse<null>>(`/cart/items/${itemId}`);
      }
      return null;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousItems = items;
      removeItem(itemId);
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      toast.error("Failed to remove item");
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      toast.success("Item removed from cart");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearCart, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        return del<ApiResponse<null>>("/cart");
      }
      return null;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousItems = items;
      clearCart();
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      toast.error("Failed to clear cart");
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useCartCount() {
  const itemCount = useCartStore((state) => state.itemCount);
  return { data: itemCount };
}
