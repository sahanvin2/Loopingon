"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  Share2,
  Copy,
  ShoppingCart,
  TrendingDown,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { get, del } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import type { Wishlist, WishlistItem, ApiResponse } from "@/types";

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const [isPublic, setIsPublic] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => get<ApiResponse<Wishlist>>("/wishlist"),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => del(`/wishlist/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (isPublic: boolean) =>
      get(`/wishlist/toggle-visibility`, { isPublic }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const wishlist = data?.data;
  const items = wishlist?.items || [];

  const handleShare = () => {
    const url = `${window.location.origin}/wishlist/${wishlist?.id}`;
    navigator.clipboard.writeText(url);
  };

  const handleAddAllToCart = () => {
    // Bulk add to cart logic here
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-muted-200 animate-pulse" />
        <LoadingSkeleton variant="product-card" count={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Error loading wishlist"
        description="Something went wrong. Please try again later."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-900">
          My Wishlist ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Wishlist
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPublic(!isPublic);
              toggleVisibilityMutation.mutate(!isPublic);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50 transition-colors"
          >
            {isPublic ? (
              <>
                <Eye className="w-4 h-4" />
                Public
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Private
              </>
            )}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Your wishlist is empty"
          description="Heart products you love to save them for later."
          action={{ label: "Browse Products", href: "/shop" }}
        />
      ) : (
        <>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart ({items.length})
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const priceDropped =
                item.addedPrice &&
                Number(product.price) < Number(item.addedPrice);

              return (
                <div key={item.id} className="relative">
                  <ProductCard product={product} />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={removeMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-600 bg-muted-50 hover:bg-muted-100 rounded-md transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                  {priceDropped && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="muted" size="sm">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Price Drop
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
