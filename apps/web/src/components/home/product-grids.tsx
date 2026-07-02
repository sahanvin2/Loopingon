"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Sparkles, Trophy, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { Product } from "@/types";

import { useState } from "react";
import { Modal } from "@/components/shared/modal";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/shared/rating-stars";
import { Eye, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";

function ProductCard({ product, showSold }: { product: Product | any; showSold?: boolean }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addToCart = useAddToCart();
  
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.medium || primaryImage?.url) || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&h=300&fit=crop";
  const price = parseFloat(product.price || "0");
  const originalPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined;
  const sold = product.salesCount || product.sold || 0;
  const rating = product.averageRating || product.rating || (4.0 + Math.random()).toFixed(1);

  return (
    <>
      <div className="group flex flex-col gap-2">
        <div className="relative aspect-square bg-surface-100 rounded-xl overflow-hidden shadow-sm border border-surface-200">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
            <Image 
              src={imageUrl} 
              alt={product.title} 
              fill sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </Link>
          
          <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-text-400 hover:text-[#E63946] hover:bg-white transition-all shadow-sm z-10">
            <Heart className="w-3.5 h-3.5" />
          </button>
          
          <div className="absolute top-0 left-0 right-0 aspect-square bg-text-900/0 group-hover:bg-text-900/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg pointer-events-auto bg-white/90 backdrop-blur-sm text-text-700 text-sm font-medium shadow-sm hover:bg-white hover:text-primary-600 transition-colors"
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
          </div>
        </div>
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs font-bold text-navy-900 line-clamp-2 group-hover:text-[#E63946] transition-colors leading-tight">{product.title}</h3>
          </Link>
          <p className="text-sm font-bold text-navy-900 mt-1">Rs. {price.toLocaleString()}</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
              <span className="text-[11px] font-bold text-navy-900">{rating}</span>
            </div>
            {showSold && sold > 0 && (
              <span className="text-[10px] font-medium text-[#62A7B0]">Sold {sold.toLocaleString()}+</span>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        size="full"
        className="max-w-3xl p-0 overflow-hidden z-[100]"
      >
        <div className="flex flex-col md:flex-row max-h-[80vh] overflow-y-auto">
          <div className="relative w-full md:w-1/2 min-h-[300px] bg-muted-100">
            <Image src={imageUrl} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col gap-4">
            <h2 className="text-2xl font-serif font-bold text-text-900 leading-tight">{product.title}</h2>
            <div className="flex items-center justify-between">
              <PriceDisplay price={price} originalPrice={originalPrice} size="lg" />
              <RatingStars rating={Number(rating)} reviewCount={product.reviewCount || 0} size="sm" />
            </div>
            {product.shortDescription || product.description ? (
              <p className="text-muted-600 text-sm line-clamp-4">{product.shortDescription || product.description}</p>
            ) : null}
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                disabled={addToCart.isPending || (product.quantity !== undefined && product.quantity <= 0)}
                className="w-full py-3 px-4 rounded-xl font-medium shadow-sm transition-all duration-200 bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {addToCart.isPending ? "Adding..." : (product.quantity !== undefined && product.quantity <= 0 ? "Out of Stock" : "Add to Cart")}
              </button>
              <Link
                href={`/products/${product.slug}`}
                onClick={() => setIsQuickViewOpen(false)}
                className="w-full text-center py-2 px-4 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function ProductGrids() {
  const { data: newData, isLoading: newLoading } = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      const res = await get<{ data: Product[] }>("/products", { sort: "newest", limit: 6 } as any);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: bestData, isLoading: bestLoading } = useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: async () => {
      const res = await get<{ data: Product[] }>("/products", { sort: "salesCount", order: "desc", limit: 6 } as any);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: choiceData, isLoading: choiceLoading } = useQuery({
    queryKey: ["products", "your-choice"],
    queryFn: async () => {
      // Simulate personalized by fetching with a different sort or offset
      const res = await get<{ data: Product[] }>("/products", { sort: "rating", order: "desc", limit: 6 } as any);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="w-full bg-[#FCFDFD] py-16 space-y-16 border-b border-surface-100">
      
      {/* New Arrivals */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
            <Sparkles className="w-5 h-5 text-[#F4A261]" />
            New Arrivals
          </h2>
          <Link href="/products?sort=newest" className="flex items-center gap-1 text-xs font-bold text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 xl:gap-5">
          {newLoading 
            ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" />)
            : newData?.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
            <Trophy className="w-5 h-5 text-[#F4A261]" />
            Best Sellers
          </h2>
          <Link href="/products?sort=salesCount" className="flex items-center gap-1 text-xs font-bold text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 xl:gap-5">
          {bestLoading 
            ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" />)
            : bestData?.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} showSold />)}
        </div>
      </section>

      {/* Your Choice */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
            <Heart className="w-5 h-5 text-[#E63946] fill-[#E63946]" />
            Your Choice
          </h2>
          <Link href="/products?sort=rating" className="flex items-center gap-1 text-xs font-bold text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 xl:gap-5">
          {choiceLoading 
            ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" />)
            : choiceData?.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

    </div>
  );
}
