"use client";

import React from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function TrendingWeek() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "trending-week"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { sort: "salesCount", order: "desc", limit: 10 },
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.products || [];
  const displayProducts = products.length >= 5 ? products.slice(0, 5) : [];

  return (
    <section className="py-16 bg-white">
      <div className="container-page mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy-900 flex items-center gap-2">
              Trending This Week <span className="text-2xl">🔥</span>
            </h2>
            <p className="text-text-500 mt-2 font-medium">Most loved items by our community right now.</p>
          </div>
          <Link href="/products?sort=popular" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            See all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="product-card" count={1} />
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayProducts.map((product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
              const imageUrl = getImageUrl(primaryImage?.medium || primaryImage?.url);
              const price = parseFloat(product.price);
              
              return (
                <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-100">
                    <img 
                      src={imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23f0f0f0'%3E%3Crect width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                    />
                    <button className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-text-400 hover:text-primary-500 hover:bg-white backdrop-blur-sm transition-all shadow-sm z-10">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-text-500 mb-1">{product.vendor?.storeName || "Kandiyam Creator"}</span>
                    <Link href={`/products/${product.slug}`} className="font-semibold text-navy-900 hover:text-primary-600 transition-colors line-clamp-1 mb-2">
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                      <span className="text-sm font-medium text-navy-900">{product.averageRating?.toFixed(1) || "4.5"}</span>
                      <span className="text-xs text-text-400">({product.reviewCount || 0})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-lg text-navy-900">රු {price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-text-400">
            <p>No trending products available right now. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
