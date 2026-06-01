"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  view?: "grid" | "list";
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ProductGrid({
  products,
  isLoading = false,
  isError = false,
  onRetry,
  view = "grid",
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <LoadingSkeleton
        variant="product-card"
        count={view === "grid" ? 8 : 4}
        className={className}
      />
    );
  }

  if (isError) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-warm-gray-600 mb-4">Failed to load products.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-terracotta-600 text-white text-sm font-medium",
              "hover:bg-terracotta-700 transition-colors",
            )}
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        )}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No Products Found"
        description="Try adjusting your filters or search terms."
        className={className}
      />
    );
  }

  if (view === "list") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn("space-y-4", className)}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} showQuickView={false} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
        className,
      )}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
