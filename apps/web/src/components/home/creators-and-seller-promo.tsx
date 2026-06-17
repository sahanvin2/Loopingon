"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const creators = [
  {
    name: "Maya Studio",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    rating: 4.9,
    reviews: 320,
  },
  {
    name: "Oak & Co.",
    category: "Wood Crafts",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
    rating: 4.8,
    reviews: 210,
  },
  {
    name: "Knit & Knot",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    rating: 4.9,
    reviews: 415,
  },
  {
    name: "Artisan Clay",
    category: "Ceramics",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80",
    rating: 4.8,
    reviews: 180,
  },
  {
    name: "Paper Stories",
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    rating: 4.9,
    reviews: 360,
  },
];

export function CreatorsAndSellerPromo() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Creators Section */}
          <div className="flex-1 bg-surface-50 rounded-2xl p-8 border border-surface-200 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center md:text-left">
              <h2 className="font-serif text-3xl font-bold text-text-900 mb-3">Meet Our Amazing Creators</h2>
              <p className="text-muted-600 mb-6">Discover the stories behind the products you love.</p>
              <Link href="/creators" className="inline-flex items-center text-sm font-semibold text-accent-600 hover:text-accent-700">
                View all creators <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="md:w-2/3 flex flex-wrap justify-center md:justify-end gap-6 sm:gap-8">
              {creators.map((creator) => (
                <Link key={creator.name} href={`/creators/${creator.name.toLowerCase().replace(/\s+/g, '-')}`} className="group flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-white shadow-soft group-hover:shadow-soft-lg group-hover:-translate-y-1 transition-all duration-300">
                    <Image src={creator.image} alt={creator.name} width={96} height={96} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="font-bold text-text-900 text-sm group-hover:text-primary-600 transition-colors">{creator.name}</h3>
                  <p className="text-xs text-muted-500 mb-1">{creator.category}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-600">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-text-800">{creator.rating}</span>
                    <span>({creator.reviews})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Become a Seller Box */}
          <div className="lg:w-[350px] shrink-0 bg-[#78BCC4] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <Sparkles className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-bold mb-3">Become a Seller</h2>
              <p className="text-white/90 mb-8 max-w-[200px]">Join our community of talented creators.</p>
              <Link href="/sell-on-kandyam" className="inline-flex items-center justify-center bg-white text-[#78BCC4] px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-50 hover:shadow-soft transition-all hover:-translate-y-0.5">
                Start Selling <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
