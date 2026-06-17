"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export function CustomerReviewsBanner() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="bg-navy-900 rounded-[2.5rem] relative overflow-hidden px-6 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Navigation Buttons */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10 hidden md:flex">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10 hidden md:flex">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Review 1 */}
        <div className="flex items-center gap-4 flex-1 md:pr-10 md:border-r border-white/10">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-primary-500/30 flex items-center justify-center">
            <span className="text-white font-bold text-lg">TD</span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
            </div>
            <p className="text-white text-sm font-medium mb-1">"Amazing quality and beautiful packaging! You can feel the love in every detail."</p>
            <p className="text-navy-300 text-xs">— Tharushi D.</p>
          </div>
        </div>

        {/* Center: Overall Rating */}
        <div className="flex flex-col items-center justify-center shrink-0 text-center relative z-10 px-4">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">Loved by our community</h3>
          <div className="flex items-center gap-2 mb-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
            <span className="text-white font-bold text-xl ml-2">4.9/5</span>
          </div>
          <p className="text-navy-300 text-sm">from 2,500+ reviews</p>
        </div>

        {/* Review 2 */}
        <div className="flex items-center gap-4 flex-1 md:pl-10 md:border-l border-white/10">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-accent-500/30 flex items-center justify-center">
            <span className="text-white font-bold text-lg">KM</span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
            </div>
            <p className="text-white text-sm font-medium mb-1">"Supporting local artisans is so important. Kandyam makes it so easy!"</p>
            <p className="text-navy-300 text-xs">— Kasun M.</p>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-primary-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-accent-500 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </section>
  );
}
