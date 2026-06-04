"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { get } from "@/lib/api-client";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/shared/badge";

export function EditorsPicks() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "editors-picks"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { sort: "featured", limit: 4 },
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const products = data?.products || [];

  return (
    <section className="py-20 px-4 bg-primary-50/50 border-y border-accent-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="rose" className="mb-4">Etsy's Pick</Badge>
          <h2 className="font-serif text-3xl md:text-4xl text-text-800 mb-4">
            Editors' Picks
          </h2>
          <p className="text-muted-500 max-w-xl mx-auto">
            Discover the most extraordinary handcrafted items selected by our style editors.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="product-card" count={1} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
