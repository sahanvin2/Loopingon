"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Product, ApiResponse, PaginationMeta } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function FeaturedProducts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { isFeatured: true, limit: 8 },
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const products = data?.products || [];

  return (
    <section className="py-16 px-4 max-w-8xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="flex items-center justify-between mb-10"
      >
        <h2 className="font-serif text-3xl text-charcoal-900">
          Handpicked Treasures
        </h2>
        <Link
          href="/products?sort=featured"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700",
            "hover:underline transition-colors",
          )}
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {isLoading && <LoadingSkeleton variant="product-card" count={8} />}

      {isError && (
        <div className="text-center py-12">
          <p className="text-muted-600 mb-4">Failed to load featured products.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-rose-600 text-white text-sm font-medium",
              "hover:bg-rose-700 transition-colors",
            )}
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <EmptyState
          title="No Featured Products Yet"
          description="Check back soon for our curated selection of handcrafted treasures."
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
