"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, UserPlus } from "lucide-react";

const SELLERS = [
  {
    name: "Pixel Masters",
    category: "Game Assets",
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop",
  },
  {
    name: "Code & Co.",
    category: "Web Templates",
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop",
  },
  {
    name: "DevScripts",
    category: "Software",
    rating: 4.9,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=150&h=150&fit=crop",
  },
  {
    name: "Artisan Keys",
    category: "Game Keys",
    rating: 4.8,
    reviews: 150,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150&h=150&fit=crop",
  },
  {
    name: "Prompt Magic",
    category: "AI Prompts",
    rating: 4.9,
    reviews: 260,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&h=150&fit=crop",
  },
];

export function MeetOurSellers() {
  return (
    <section className="w-full bg-[#FCFDFD] py-16 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text */}
          <div className="w-full lg:w-[20%] text-center lg:text-left">
            <h2 className="font-serif text-2xl font-bold text-navy-900 leading-tight">
              Meet Our Amazing Sellers
            </h2>
            <p className="text-sm font-medium text-text-500 mt-3 mb-4 max-w-xs mx-auto lg:mx-0">
              Discover the stories behind the products you love.
            </p>
            <Link href="/vendors" className="inline-flex items-center gap-1 text-sm font-bold text-[#E63946] hover:text-[#D92D3A] transition-colors">
              View all sellers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Center Sellers */}
          <div className="w-full lg:w-[55%] flex justify-center overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-6 sm:gap-8 px-2">
              {SELLERS.map((seller) => (
                <Link key={seller.name} href={`/vendors/${seller.name.toLowerCase().replace(/\s+/g, '-')}`} className="group flex flex-col items-center min-w-[100px] snap-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-100 border-2 border-transparent group-hover:border-[#E63946] transition-all p-1 shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image src={seller.image} alt={seller.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 mt-3 group-hover:text-[#E63946] transition-colors">{seller.name}</h3>
                  <p className="text-[11px] font-medium text-text-500">{seller.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-[#F4A261] text-[#F4A261]" />
                    <span className="text-[11px] font-bold text-navy-900">{seller.rating}</span>
                    <span className="text-[11px] text-text-400">({seller.reviews})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Box */}
          <div className="w-full lg:w-[25%] bg-[#F2EAE1] rounded-2xl p-6 flex items-center justify-between shadow-sm border border-transparent hover:border-[#62A7B0]/30 transition-all">
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-navy-900">Become a Seller</h3>
              <p className="text-xs font-medium text-text-600 mt-1 mb-4 leading-snug">
                Join our community of talented sellers.
              </p>
              <Link 
                href="/sell" 
                className="inline-block bg-[#62A7B0] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-[#4A8A92] transition-colors shadow-sm"
              >
                Start Selling <ArrowRight className="inline w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="w-16 h-16 rounded-full border border-[#62A7B0]/20 flex items-center justify-center bg-white/50 shrink-0 ml-4">
               <UserPlus className="w-6 h-6 text-[#62A7B0]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
