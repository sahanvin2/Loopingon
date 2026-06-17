"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { Product, ApiResponse, PaginationMeta } from "@/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function HomeTopWidgets() {
  const { data: trendingData } = useQuery({
    queryKey: ["products", "trending", "widget"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { limit: 3, sort: "popular" }
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const { data: recentData } = useQuery({
    queryKey: ["products", "recent", "widget"],
    queryFn: async () => {
      const res = await get<ApiResponse<{ products: Product[]; meta: PaginationMeta }>>(
        "/products",
        { limit: 3, recent: true }
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const trending = trendingData?.products || [
    { id: "1", title: "Boho Ceramic Vase", price: 42.50, rating: 4.8, reviews: 120, images: ["https://images.unsplash.com/photo-1613564834361-9436948817d1?w=300&q=80"] },
    { id: "2", title: "Gold Hoop Earrings", price: 26.00, rating: 4.9, reviews: 84, images: ["https://images.unsplash.com/photo-1599643477874-c11c470eb06b?w=300&q=80"] },
    { id: "3", title: "Minimalist Desk Lamp", price: 68.00, rating: 4.7, reviews: 56, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80"] },
  ] as any[];

  const recent = recentData?.products || [
    { id: "4", title: "Wooden Wall Clock", price: 35.00, images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&q=80"] },
    { id: "5", title: "Scented Soy Candle", price: 22.00, images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80"] },
    { id: "6", title: "Macrame Wall Hanging", price: 28.00, images: ["https://images.unsplash.com/photo-1522757525875-9252033bc715?w=300&q=80"] },
  ] as any[];

  return (
    <section className="bg-white py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Trending This Week */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-text-900">
                <span className="text-orange-500">🔥</span> Trending This Week
              </h2>
              <Link href="/products?sort=popular" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              {trending.map((product, index) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100">
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-900 group-hover:text-primary-600 transition-colors line-clamp-1">{product.title}</h3>
                    <p className="font-bold text-text-900 mt-1">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-500">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium text-text-700">{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Editors' Picks */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-text-900">
                <span className="text-yellow-500">✨</span> Editors' Picks
              </h2>
              <Link href="/products?tags=editors-pick" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            <Link href="/products?tags=editors-pick" className="group block relative rounded-2xl overflow-hidden bg-surface-100 h-[280px]">
              <Image src="https://images.unsplash.com/photo-1583847268964-b28ce8f30e9b?q=80&w=800&auto=format&fit=crop" alt="Scandi Living Room Collection" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-2">Scandi Living Room Collection</h3>
                <span className="inline-flex items-center text-sm font-semibold text-primary-200 group-hover:text-primary-300 transition-colors">
                  Shop the look <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Recently Viewed */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-text-900">
                <span className="text-blue-500">👀</span> Recently Viewed
              </h2>
              <Link href="/account/recently-viewed" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recent.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-surface-100 mb-3">
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-sm font-medium text-text-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{product.title}</h3>
                  <p className="text-sm font-bold text-text-900 mt-1">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
