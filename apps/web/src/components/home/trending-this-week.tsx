"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function TrendingThisWeek() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "trending"],
    queryFn: async () => {
      const res = await get<ApiResponse<Product[]>>(
        "/products/trending",
        { limit: 4 },
      );
      return res;
    },
    staleTime: 60 * 1000,
  });

  const products = Array.isArray(data?.data) ? data.data : (data as unknown as Product[]) || [];

  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-surface-300 pb-4">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium flex items-center gap-2">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 fill-orange-500" />
          Trending This Week
        </h2>
        <Link
          href="/products?sort=popular"
          className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
        >
          View all trending <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {isLoading && <LoadingSkeleton variant="product-card" count={4} />}

      {!isLoading && !isError && products.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
