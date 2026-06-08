"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

interface ProductSectionProps {
  title: React.ReactNode;
  viewAllLink: string;
  queryParams: Record<string, any>;
  queryKey: string[];
  limit?: number;
  className?: string;
  columns?: "4" | "5";
}

export function ProductSection({ 
  title, 
  viewAllLink, 
  queryParams, 
  queryKey, 
  limit = 4, 
  className,
  columns = "4"
}: ProductSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [...queryKey, limit],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { limit, ...queryParams },
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const products = data?.products || [];

  return (
    <section className={cn("py-12 px-4 max-w-8xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium flex items-center gap-2">
          {title}
        </h2>
        <Link
          href={viewAllLink}
          className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
        >
          View all <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {isLoading && (
        <LoadingSkeleton 
          variant="product-card" 
          count={limit} 
          className={columns === "5" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} 
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className={cn(
            "grid gap-4 sm:gap-6",
            columns === "5" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
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
