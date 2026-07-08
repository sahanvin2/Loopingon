"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
  vendorId?: string;
}

export function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["products", "related", productId],
    queryFn: async () => {
      const res = await get<ApiResponse<Product[]>>(
        `/products/${productId}/related`,
        { limit: 12 },
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.filter((p) => p.id !== productId) || [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-text-900">
          You May Also Like
        </h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center",
              "border border-accent-300 text-muted-600 hover:bg-muted-100",
              "disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center",
              "border border-accent-300 text-muted-600 hover:bg-muted-100",
              "disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-56">
              <LoadingSkeleton variant="product-card" count={1} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="shrink-0 w-56 sm:w-64 snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
