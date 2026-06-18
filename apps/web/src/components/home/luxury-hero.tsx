"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export function LuxuryHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="w-full bg-[#fdfaf5] py-6 md:py-10 px-4 md:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        
        {/* Single Wide Calm Banner */}
        <div className="w-full bg-accent-50 rounded-[32px] md:rounded-[40px] overflow-hidden mb-12 flex flex-col md:flex-row items-stretch border border-accent-100 shadow-sm">
          
          {/* Text Side (Calm site colors) */}
          <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white via-accent-50 to-accent-100 min-h-[300px] md:min-h-[460px]">
            <h2 className="text-navy-900 font-serif text-[36px] md:text-[52px] leading-[1.15] tracking-tight mb-6">
              Discover quality finds, <br/>
              <span className="text-accent-700">for every need.</span>
            </h2>
            <p className="text-navy-700 text-lg md:text-xl max-w-md mb-8 leading-relaxed">
              Find unique, handcrafted pieces that bring calm and timeless beauty to your space.
            </p>
            <Link 
              href="/products" 
              className="bg-navy-900 text-white rounded-full px-8 py-3.5 font-semibold w-fit hover:bg-navy-800 transition-all text-sm md:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Shop the Collection
            </Link>
          </div>
          
          {/* Image Side */}
          <div className="w-full md:w-[45%] h-[300px] md:h-auto relative">
            <img 
              src="https://kandyam.b-cdn.net/site/hero-bg.webp" 
              alt="Calm handcrafted items" 
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Centered Text */}
        <h1 className="font-serif text-[28px] md:text-[36px] text-[#222222] mb-6 text-center max-w-3xl tracking-tight">
          Discover extraordinary items from independent sellers
        </h1>

        {/* Prominent Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-[850px] relative mb-8"
        >
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anything..." 
            className="w-full h-[64px] pl-6 pr-[80px] rounded-full bg-white text-[#222222] text-[17px] border-[2px] border-primary-500 hover:bg-[#f8f8f8] focus:bg-white focus:outline-none focus:border-primary-600 transition-colors shadow-sm placeholder:text-gray-500"
          />
          <button 
            type="submit"
            aria-label="Search"
            className="absolute right-[6px] top-[6px] bottom-[6px] aspect-square bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <Search className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </form>

      </div>
    </section>
  );
}
