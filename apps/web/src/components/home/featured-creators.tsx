"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";

interface ApiVendor {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  craftType: string[];
}

export function FeaturedCreators() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendors", "featured"],
    queryFn: () => get<{ data: ApiVendor[] }>("/vendors", { limit: 5 }),
    staleTime: 5 * 60 * 1000,
  });

  const creators = data?.data || [];

  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Featured Creators
        </h2>
        <Link href="/makers" className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
          View all creators <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-surface-100 rounded-2xl p-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-surface-300 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-300 rounded w-3/4" />
                <div className="h-3 bg-surface-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 bg-surface-100 rounded-2xl p-4 border border-surface-300 hover:border-primary-200 hover:shadow-soft-md transition-all group"
            >
              <Link href={`/vendors/${creator.storeSlug}`} className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                <Image
                  src={creator.storeLogo ? getImageUrl(creator.storeLogo) : "/images/placeholder-avatar.svg"}
                  alt={creator.storeName}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/vendors/${creator.storeSlug}`} className="block">
                  <h3 className="font-medium text-text-900 truncate group-hover:text-primary-600 transition-colors">
                    {creator.storeName}
                  </h3>
                </Link>
                <p className="text-xs text-text-500 mb-1">{creator.craftType?.[0] || "Artisan"}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{creator.rating.toFixed(1)}</span>
                  <span className="text-text-400 font-normal">({creator.reviewCount})</span>
                </div>
                <div className="mt-2 text-xs font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
                  {creator.totalProducts}+ Products
                </div>
              </div>
            </motion.div>
          ))}

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
              <div className="w-24 h-24 bg-accent-300 rounded-full blur-xl absolute right-0 bottom-0"></div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
