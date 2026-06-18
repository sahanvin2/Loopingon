import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";

export function LuxuryHero() {
  const quickTags = [
    "Handmade", "Fashion", "Vintage", "Jewelry", 
    "Art", "Home Decor", "Gifts", "Collectibles"
  ];

  return (
    <section className="relative w-full bg-accent-50 overflow-hidden" style={{ minHeight: "650px" }}>
      {/* Background Gradients & Accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-50 via-white to-accent-100 z-0" />
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-accent-300 stroke-current stroke-1 fill-none">
          <path d="M0,100 C30,60 70,40 100,0" />
          <path d="M20,100 C50,60 90,40 100,20" />
        </svg>
      </div>

      <div className="container-wide relative z-10 mx-auto flex flex-col lg:flex-row items-center h-full min-h-[650px]">
        {/* Left Side: 50% Text */}
        <div className="w-full lg:w-1/2 pt-20 pb-16 lg:py-0 pr-0 lg:pr-12 flex flex-col justify-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-navy-900 leading-[1.1] mb-6">
            Discover <br/> Unique Finds
            <span className="block text-primary-500 mt-2 text-4xl md:text-5xl lg:text-6xl">Made for Every Story.</span>
          </h1>
          
          <p className="text-navy-700 text-lg md:text-xl font-sans max-w-xl mb-10 leading-relaxed">
            Shop handmade, vintage, art, fashion, home decor, collectibles, gifts, and unique products from creators worldwide.
          </p>

          <div className="w-full max-w-xl mb-8 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-text-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for anything..." 
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-navy-900 font-medium placeholder:text-text-400 shadow-soft-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="absolute inset-y-1.5 right-1.5 bg-primary-500 hover:bg-primary-600 text-white px-6 rounded-full font-medium transition-colors">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-navy-600 py-1 mr-2">Quick:</span>
            {quickTags.map((tag) => (
              <Link 
                key={tag} 
                href={`/search?q=${tag.toLowerCase()}`}
                className="text-xs font-medium text-navy-700 bg-white hover:bg-accent-500 hover:text-white border border-accent-200 rounded-full px-3 py-1.5 transition-all shadow-sm hover:shadow-md"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: 50% Luxury Visual */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[650px] relative hidden md:block">
          {/* Luxury composition placeholder - In a real scenario these would be highly curated images */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[500px] max-w-[500px]">
            {/* Center piece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-2xl overflow-hidden shadow-soft-xl z-30 border-4 border-white">
               <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop" alt="Sri Lankan Wooden Elephant" className="w-full h-full object-cover" />
            </div>
            {/* Top right piece */}
            <div className="absolute top-[10%] right-[10%] w-40 h-48 rounded-xl overflow-hidden shadow-soft-lg z-20 border-2 border-white opacity-95 hover:scale-105 transition-transform duration-500 hover:z-40">
               <img src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop" alt="Luxury Flower Vase" className="w-full h-full object-cover" />
            </div>
            {/* Bottom left piece */}
            <div className="absolute bottom-[10%] left-[10%] w-48 h-48 rounded-full overflow-hidden shadow-soft-lg z-40 border-4 border-white hover:scale-105 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1599643477874-c11f7c8fccbd?q=80&w=400&auto=format&fit=crop" alt="Traditional Masks" className="w-full h-full object-cover" />
            </div>
            {/* Top left piece */}
            <div className="absolute top-[20%] left-[5%] w-32 h-40 rounded-xl overflow-hidden shadow-soft-lg z-10 border-2 border-white opacity-90">
               <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop" alt="Luxury Jewelry" className="w-full h-full object-cover" />
            </div>
            {/* Bottom right piece */}
            <div className="absolute bottom-[20%] right-[5%] w-40 h-40 rounded-xl overflow-hidden shadow-soft-lg z-20 border-2 border-white opacity-95">
               <img src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=400&auto=format&fit=crop" alt="Rattan Bag" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
