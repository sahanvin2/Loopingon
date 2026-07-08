"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const POPULAR_SEARCHES = [
  "Game Keys",
  "Software",
  "Gift Cards",
  "E-Books",
  "Templates",
  "Digital Art",
];

const HERO_IMAGES = [
  // Column 1
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop", // Gaming
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop", // Retro gaming
  // Column 2
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop", // Code
  "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=500&fit=crop", // Abstract
  // Column 3
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=500&fit=crop", // Dev
  "https://images.unsplash.com/photo-1606144042898-3331b016335a?w=400&h=400&fit=crop", // Apps
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full bg-[#FCFDFD] overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col items-start relative z-10">

            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-[42px] leading-[1.1] sm:text-5xl lg:text-6xl tracking-tight text-navy-900 font-bold mb-2">
                Discover products you'll love.
                <span className="block text-[#E63946]">From local favorites to global finds.</span>
              </h1>
              
              <p className="mt-6 text-lg text-text-600 max-w-lg font-medium leading-relaxed">
                Explore a curated selection of premium goods, exclusive deals, and unique items from independent creators everywhere.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-[500px] mt-10"
            >
              <form 
                onSubmit={handleSearch}
                className="relative flex items-center w-full h-14 bg-white border-2 border-surface-200 rounded-full overflow-hidden shadow-sm focus-within:border-[#E63946] focus-within:ring-4 focus-within:ring-[#E63946]/10 transition-all"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full h-full pl-6 pr-[110px] bg-transparent outline-none text-base placeholder:text-text-400"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-6 bg-[#E63946] hover:bg-[#D92D3A] text-white font-medium rounded-full transition-colors flex items-center justify-center"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* Popular Searches */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <p className="text-xs font-semibold text-text-400 uppercase tracking-wider mb-3">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      router.push(`/products?q=${encodeURIComponent(tag)}`);
                    }}
                    className="px-4 py-1.5 bg-white border border-surface-200 rounded-full text-sm font-medium text-text-600 hover:border-[#E63946] hover:text-[#E63946] transition-colors shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image Collage */}
          <div className="w-full lg:w-[55%] xl:w-[60%] relative mt-12 lg:mt-0">
            {/* The Floating Badge */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
              className="absolute -right-4 top-1/4 z-20 hidden md:flex w-32 h-32 bg-white rounded-full border border-dashed border-[#E63946] items-center justify-center p-4 text-center shadow-xl transform rotate-12"
            >
              <div>
                <p className="text-[#E63946] font-bold text-lg leading-tight font-serif">Millions</p>
                <p className="text-text-600 text-xs font-medium">of unique finds</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 pt-8">
                <div className="relative w-full h-[55%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[0]} alt="Jewelry" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative w-full h-[45%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[1]} alt="Macrame" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 pb-8">
                <div className="relative w-full h-[45%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[2]} alt="Candle" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative w-full h-[55%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[3]} alt="Abstract Art" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 pt-12">
                <div className="relative w-full h-[50%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[4]} alt="Ceramic Vase" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative w-full h-[50%] rounded-2xl overflow-hidden shadow-md group">
                  <Image src={HERO_IMAGES[5]} alt="Leather Bag" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
