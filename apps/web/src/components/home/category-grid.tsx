"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categoryItems = [
  {
    name: "Handloom & Textiles",
    slug: "handloom-textiles",
    image: "/images/categories/handloom.jpg",
    count: 1240,
  },
  {
    name: "Wood Carving & Masks",
    slug: "wood-carving-masks",
    image: "/images/categories/wood-carving.jpg",
    count: 876,
  },
  {
    name: "Pottery & Ceramics",
    slug: "pottery-ceramics",
    image: "/images/categories/pottery.jpg",
    count: 654,
  },
  {
    name: "Jewelry & Brassware",
    slug: "jewelry-brassware",
    image: "/images/categories/jewelry.jpg",
    count: 1120,
  },
  {
    name: "Batik & Dyeing",
    slug: "batik-dyeing",
    image: "/images/categories/batik.jpg",
    count: 432,
  },
  {
    name: "Lacquerware",
    slug: "lacquerware",
    image: "/images/categories/lacquerware.jpg",
    count: 298,
  },
  {
    name: "Coir & Reed Products",
    slug: "coir-reed",
    image: "/images/categories/coir.jpg",
    count: 345,
  },
  {
    name: "Leather Crafts",
    slug: "leather-crafts",
    image: "/images/categories/leather.jpg",
    count: 567,
  },
];

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

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 max-w-8xl mx-auto">
      <h2 className="font-serif text-3xl text-charcoal-900 text-center mb-10">
        Explore by Craft
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {categoryItems.map((category) => (
          <motion.div key={category.slug} variants={itemVariants}>
            <Link
              href={`/categories/${category.slug}`}
              className={cn(
                "group block relative aspect-[3/2] rounded-lg overflow-hidden",
                "shadow-sm hover:shadow-md transition-shadow duration-300",
                "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2",
              )}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-white text-base sm:text-lg font-medium">
                  {category.name}
                </h3>
                <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full mt-1",
                      "bg-white/20 backdrop-blur-sm text-white text-xs",
                    )}
                >
                  {category.count.toLocaleString()} products
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
