"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Star } from "lucide-react";
import { get } from "@/lib/api-client";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function RecommendedForYou() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "recommended"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { sort: "trending", limit: 10 },
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.products || [];
  const displayProducts = products.slice(0, 10);

  if (!isLoading && displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-main">
      <div className="container-page mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy-900">Recommended For You</h2>
            <p className="text-text-500 mt-2 font-medium">Curated picks based on your taste.</p>
          </div>
          <Link href="/products?sort=trending" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-64">
                <LoadingSkeleton variant="product-card" count={1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {displayProducts.map((product: any, index: number) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                const imageUrl = primaryImage?.medium || primaryImage?.url || "";
                const price = parseFloat(product.price || "0");

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="shrink-0 w-[260px] sm:w-[280px] snap-start"
                  >
                    <div className="group relative flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex sm:hidden justify-center mt-6">
          <Link href="/products?sort=trending" className="flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
