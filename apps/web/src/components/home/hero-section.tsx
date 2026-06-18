"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const popularSearches = [
  "Wall Art",
  "Jewelry",
  "Home Decor",
  "Candles",
  "Clothing",
  "Gift for Her",
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative w-full bg-[#FCFaf8] pt-12 pb-20 overflow-hidden">
      {/* Decorative top left marks */}
      <div className="absolute left-8 top-12 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5L15 20" stroke="#F7444E" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 10L20 15" stroke="#F7444E" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 5V20" stroke="#F7444E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Decorative top right heart outline */}
      <div className="absolute right-[55%] top-16 opacity-30 hidden lg:block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#78BCC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column: Text & Search */}
          <div className="w-full lg:w-[45%] flex flex-col z-10 pt-4 lg:pt-10">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] tracking-tight text-text-900">
              Find things you'll love.<br />
              <span className="text-primary-500">Support sellers worldwide.</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-600 max-w-lg leading-relaxed">
              Shop handmade, vintage, custom and unique items from independent sellers around the world.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl">
              <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-full p-1.5 shadow-sm border border-surface-300">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-grow bg-transparent px-5 py-3 text-text-900 outline-none placeholder:text-muted-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary-500 px-8 py-3.5 font-bold text-white transition-colors hover:bg-primary-600"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Popular Searches */}
            <div className="mt-8">
              <p className="text-xs text-muted-500 mb-3 font-medium">Popular searches:</p>
              <div className="flex flex-wrap gap-2.5">
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-surface-300 bg-white px-4 py-2 text-xs font-semibold text-text-700 transition-colors hover:bg-surface-100 hover:text-text-900"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Image Collage */}
          <div className="w-full lg:w-[55%] relative mt-12 lg:mt-0">
            {/* Floating Badge */}
            <div className="absolute right-0 lg:-right-8 top-[30%] z-20 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-soft-xl border border-surface-100 rotate-12">
              <p className="text-center font-serif text-lg font-bold leading-tight text-text-900 -rotate-12">
                Millions<br />of unique<br />finds
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                <div className="relative h-[65%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1599643477874-c11c470eb06b?q=80&w=600&auto=format&fit=crop" alt="Jewelry" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative h-[35%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop" alt="Textiles" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 pt-8">
                <div className="relative h-[45%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop" alt="Candle" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative h-[55%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop" alt="Clothing" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              
              {/* Column 3 */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                <div className="relative h-[35%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=600&auto=format&fit=crop" alt="Vase" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative h-[65%] w-full rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop" alt="Leather Bag" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
