"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { get } from "@/lib/api-client";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function RecentlyViewed() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "recently-viewed"],
    queryFn: async () => {
      // In a real app, this would fetch from local storage IDs
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { sort: "newest", limit: 6 },
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const products = data?.products || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-8xl mx-auto border-t border-blush-200 mt-12">
      <h2 className="font-serif text-2xl text-charcoal-900 mb-8">
        Recently viewed & more
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="product-card" count={1} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
