"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const creators = [
  { name: "Nimal Perera", craft: "Wood Crafts", rating: 4.9, reviews: 230, products: 124, image: "/images/vendors/vendor-1.jpg" },
  { name: "Samanthi Weaves", craft: "Hand Loom", rating: 4.8, reviews: 310, products: 86, image: "/images/vendors/vendor-2.jpg" },
  { name: "Dulani Batiks", craft: "Batik Artist", rating: 4.9, reviews: 180, products: 60, image: "/images/vendors/vendor-3.jpg" },
  { name: "Sanjeewa Ceramics", craft: "Pottery", rating: 4.7, reviews: 350, products: 110, image: "/images/vendors/vendor-4.jpg" },
];

export function FeaturedCreators() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Featured Creators
        </h2>
        <Link href="/creators" className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
          View all creators <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {creators.map((creator, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-center gap-4 bg-surface-100 rounded-2xl p-4 border border-surface-300 hover:border-primary-200 hover:shadow-soft-md transition-all group"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <Image
                src={creator.image}
                alt={creator.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-900 truncate group-hover:text-primary-600 transition-colors">
                {creator.name}
              </h3>
              <p className="text-xs text-text-500 mb-1">{creator.craft}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{creator.rating}</span>
                <span className="text-text-400 font-normal">({creator.reviews})</span>
              </div>
              <div className="mt-2 text-xs font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
                {creator.products}+ Products
              </div>
            </div>
          </motion.div>
        ))}

        {/* Become a seller banner inline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-accent-100 rounded-2xl p-6 border border-accent-200 flex flex-col justify-center items-start relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-medium text-navy-900 mb-1">Become a Seller</h3>
            <p className="text-xs text-navy-600 mb-4 max-w-[150px]">
              Join Kandyam and start selling your handmade creations today!
            </p>
            <Link
              href="/sell-on-kandyam"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white text-xs font-medium px-4 py-2 rounded-full transition-colors"
            >
              Start Selling →
            </Link>
          </div>
          <div className="absolute right-[-20px] bottom-[-10px] opacity-70 pointer-events-none">
            {/* Bag icon or image placeholder */}
            <div className="w-24 h-24 bg-accent-300 rounded-full blur-xl absolute right-0 bottom-0"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
