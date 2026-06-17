"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function CategoryGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", "featured"],
    queryFn: () => get<{ data: ApiCategory[] }>("/categories", { limit: 20 }),
    staleTime: 5 * 60 * 1000,
  });

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-12 px-4 max-w-8xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium mb-8">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-24 h-24 rounded-full bg-surface-200 animate-pulse shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Shop by Category
        </h2>
        <Link href="/categories" className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
          View all categories <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5"
      >
        {categories.map((category) => (
          <motion.div key={category.slug} variants={itemVariants}>
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 hover:shadow-soft-sm hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium text-text-700 hover:text-primary-600 focus:outline-none"
            >
              {category.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
