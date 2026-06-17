"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Store, ArrowRight } from "lucide-react";
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
  craftType: string[];
  storeDescription?: string;
  craftDescription?: string;
}

export default function MakersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendors", "all"],
    queryFn: () => get<{ data: ApiVendor[] }>("/vendors", { limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const makers = data?.data || [];

  return (
    <main className="min-h-screen bg-surface-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
            Meet Our Sellers
          </h1>
          <p className="text-lg text-text-600 leading-relaxed">
            Behind every product on Kandyam is a dedicated seller. Discover their stories and explore their unique storefronts.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft-sm border border-surface-200 animate-pulse">
                <div className="h-56 bg-surface-200 w-full" />
                <div className="p-6">
                  <div className="h-6 bg-surface-300 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-surface-200 rounded w-full mb-2" />
                  <div className="h-4 bg-surface-200 rounded w-5/6 mb-6" />
                  <div className="h-10 bg-surface-300 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : makers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {makers.map((maker, idx) => (
              <motion.div
                key={maker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft-md border border-accent-100 hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-56 overflow-hidden relative bg-surface-100">
                  <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={maker.storeLogo ? getImageUrl(maker.storeLogo) : "/images/placeholder-avatar.svg"}
                    alt={maker.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-navy-900">{maker.rating ? maker.rating.toFixed(1) : "5.0"}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-bold text-navy-900">{maker.storeName}</h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs font-medium text-text-500">
                      <MapPin className="w-3.5 h-3.5" />
                      Sri Lanka
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-600 line-clamp-3 mb-6 leading-relaxed">
                    {maker.storeDescription || maker.craftDescription || "A dedicated seller on Kandyam."}
                  </p>
                  
                  <Link
                    href={`/vendors/${maker.storeSlug}`}
                    className="flex items-center justify-between w-full py-2.5 px-4 border border-accent-200 rounded-xl text-sm font-medium text-navy-900 hover:border-primary-500 hover:text-primary-600 transition-colors group/btn"
                  >
                    Visit Shop
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-2xl p-12 shadow-soft-sm border border-surface-200 mb-24">
            <Store className="w-16 h-16 text-muted-300 mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-navy-900 mb-2">No Sellers Found</h3>
            <p className="text-text-500">Check back soon as more creators join our platform.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Store className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Ready to start selling?
            </h2>
            <p className="text-navy-100 text-lg mb-10 leading-relaxed">
              Join Kandyam's growing community of sellers. Turn your passion into a business with our easy-to-use platform and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sell-on-kandyam"
                className="px-8 py-3.5 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 w-full sm:w-auto"
              >
                Become a Seller
              </Link>
              <Link
                href="/about-us"
                className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
