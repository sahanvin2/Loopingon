"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, del } from "@/lib/api-client";
import type { Wishlist, WishlistItem, ApiResponse } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await get<ApiResponse<Wishlist & { items: WishlistItem[] }>>("/wishlist");
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await post<ApiResponse<WishlistItem>>("/wishlist/items", {
        productId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Added to wishlist");
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return del<ApiResponse<null>>(`/wishlist/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });
}

export function useIsWishlisted(productId: string | undefined) {
  const { data: wishlist } = useWishlist();

  if (!productId || !wishlist?.items) return { data: false };

  const isWishlisted = wishlist.items.some((item) => item.productId === productId);
  const wishlistItem = wishlist.items.find((item) => item.productId === productId);

  return { data: isWishlisted, wishlistItem };
}

export function useToggleWishlist(productId: string) {
  const queryClient = useQueryClient();
  const { data: wishlist } = useWishlist();
  const { isAuthenticated } = useAuthStore();

  const wishlistItem = wishlist?.items?.find((item) => item.productId === productId);
  const isWishlisted = !!wishlistItem;

  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await post<ApiResponse<WishlistItem>>("/wishlist/items", { productId });
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: typeof wishlist) => {
        if (!old) return old;
        return {
          ...old,
          items: [...(old.items || []), { id: crypto.randomUUID(), wishlistId: old.id, productId, addedPrice: null, createdAt: new Date().toISOString() }],
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["wishlist"], context.previous);
      }
      toast.error("Failed to update wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (wishlistItem) {
        return del<ApiResponse<null>>(`/wishlist/items/${wishlistItem.id}`);
      }
      return null;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: typeof wishlist) => {
        if (!old) return old;
        return {
          ...old,
          items: (old.items || []).filter(
            (item) => item.productId !== productId,
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["wishlist"], context.previous);
      }
      toast.error("Failed to update wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const toggle = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your wishlist");
      return;
    }
    if (isWishlisted) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return {
    isWishlisted,
    isLoading: addMutation.isPending || removeMutation.isPending,
    toggle,
  };
}
