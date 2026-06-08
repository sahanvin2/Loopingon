"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Gem, 
  Briefcase, 
  Flame, 
  Hammer, 
  Palette, 
  Coffee, 
  Brush, 
  Shirt,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";

const categoryItems = [
  { name: "Wood Crafts", slug: "wood-crafts", icon: Hammer, color: "text-amber-700", border: "border-amber-200" },
  { name: "Batik", slug: "batik", icon: Palette, color: "text-blue-600", border: "border-blue-200" },
  { name: "Hand Loom", slug: "hand-loom", icon: Shirt, color: "text-indigo-500", border: "border-indigo-200" },
  { name: "Jewelry", slug: "jewelry", icon: Gem, color: "text-teal-600", border: "border-teal-200" },
  { name: "Pottery", slug: "pottery", icon: Coffee, color: "text-red-500", border: "border-red-200" },
  { name: "Home Decor", slug: "home-decor", icon: Home, color: "text-rose-600", border: "border-rose-200" },
  { name: "Paintings", slug: "paintings", icon: Brush, color: "text-purple-600", border: "border-purple-200" },
  { name: "Leather", slug: "leather-products", icon: Briefcase, color: "text-stone-700", border: "border-stone-200" },
  { name: "More", slug: "categories", icon: MoreHorizontal, color: "text-primary-500", border: "border-primary-200" },
];

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
        className="flex flex-nowrap overflow-x-auto overflow-y-visible py-4 px-2 -mx-2 gap-4 sm:gap-6 md:gap-8 scrollbar-hide snap-x"
      >
        {categoryItems.map((category) => (
          <motion.div key={category.slug} variants={itemVariants} className="snap-start shrink-0">
            <Link
              href={category.slug === "categories" ? "/categories" : `/categories/${category.slug}`}
              className="flex flex-col items-center gap-3 group focus:outline-none"
            >
              <div className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border bg-white transition-all duration-300",
                "group-hover:shadow-soft-md group-hover:-translate-y-2 group-hover:scale-[1.02]",
                category.border
              )}>
                <category.icon className={cn("w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110", category.color)} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-text-700 group-hover:text-primary-600 transition-colors text-center w-20 sm:w-24">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
