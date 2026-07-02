"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Sparkles, Clock } from "lucide-react";

const TRENDING_ITEMS = [
  { id: 1, name: "Boho Ceramic Vase", price: "$42.50", rating: 4.8, reviews: 120, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200&h=200&fit=crop" },
  { id: 2, name: "Gold Hoop Earrings", price: "$26.00", rating: 4.9, reviews: 86, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop" },
  { id: 3, name: "Minimalist Desk Lamp", price: "$68.00", rating: 4.7, reviews: 44, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop" },
];

const RECENTLY_VIEWED = [
  { id: 1, name: "Wooden Wall Clock", price: "$35.00", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=400&fit=crop" },
  { id: 2, name: "Scented Soy Candle", price: "$22.00", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&h=400&fit=crop" },
  { id: 3, name: "Macrame Wall Hanging", price: "$28.00", image: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=300&h=400&fit=crop" },
];

export function DiscoveryRow() {
  return (
    <section className="w-full bg-[#FCFDFD] py-16 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Trending This Week */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
                <Flame className="w-5 h-5 text-[#E63946]" />
                Trending This Week
              </h2>
              <Link href="/trending" className="text-sm font-medium text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
                View all
              </Link>
            </div>
            
            <div className="flex flex-col gap-6">
              {TRENDING_ITEMS.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100">
                      <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    {/* Rank Badge */}
                    <div className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-[#E63946] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 group-hover:text-[#E63946] transition-colors line-clamp-1">{item.name}</h3>
                    <p className="text-sm font-medium text-text-600 mt-0.5">{item.price}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
                      <span className="text-xs font-medium text-text-600">{item.rating}</span>
                      <span className="text-xs text-text-400">({item.reviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editors' Picks */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
                <Sparkles className="w-5 h-5 text-[#F4A261]" />
                Editors' Picks
              </h2>
              <Link href="/editors-picks" className="text-sm font-medium text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
                View all
              </Link>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-full h-[240px] rounded-2xl overflow-hidden relative bg-surface-100">
                <Image 
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=500&fit=crop" 
                  alt="Scandi Living Room" 
                  fill sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-navy-900">Scandi Living Room Collection</h3>
                <p className="text-sm font-medium text-[#E63946] mt-1 flex items-center gap-1">
                  Shop the look <span className="text-lg leading-none">&rarr;</span>
                </p>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
                <Clock className="w-5 h-5 text-text-500" />
                Recently Viewed
              </h2>
              <Link href="/recently-viewed" className="text-sm font-medium text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
                View all
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {RECENTLY_VIEWED.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-100 mb-3 relative">
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xs font-bold text-navy-900 group-hover:text-[#E63946] transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-text-600 mt-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
