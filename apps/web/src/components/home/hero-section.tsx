"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <section className="w-full bg-surface-50 pt-8 pb-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Banners - Etsy Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[420px]">
          
          {/* Left Block - Primary CTA */}
          <div className="md:col-span-5 bg-[#7E8862] rounded-l-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden text-white">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] mb-8 tracking-tight z-10">
              Unique finds <br />
              for everyone <br />
              you love.
            </h1>
            <div className="z-10">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-white text-navy-900 rounded-full font-semibold text-sm hover:scale-105 transition-transform shadow-md"
              >
                Shop our favorites
              </Link>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Middle Block - Provided Hero Image */}
          <div className="md:col-span-4 bg-surface-200 relative overflow-hidden group hidden md:block">
            <Image
              src="/images/hero.png"
              alt="Global Marketplace Finds"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Optional Overlay if needed for contrast */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Right Block - Secondary CTA */}
          <div className="md:col-span-3 bg-navy-900 rounded-r-2xl relative overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
              alt="Clothing & Fashion"
              fill
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h3 className="text-white font-serif text-2xl font-medium mb-3 leading-tight">
                Fresh arrivals <br />
                for the new season
              </h3>
              <Link
                href="/categories/clothing"
                className="text-white text-sm font-semibold hover:underline underline-offset-4"
              >
                Shop now
              </Link>
            </div>
          </div>

        </div>

        {/* Global Search Bar Underneath (Etsy style placement) */}
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-navy-900 mb-6">Discover extraordinary items from independent sellers</h2>
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="w-full h-14 pl-6 pr-16 rounded-full border-2 border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-base shadow-sm"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 w-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
