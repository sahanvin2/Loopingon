"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AIGiftFinder() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="relative rounded-[2.5rem] bg-gradient-brand p-1 overflow-hidden shadow-soft-lg group">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-[2.4rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 relative z-10 overflow-hidden">
          
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-xs font-bold text-primary-600 mb-6 shadow-sm border border-primary-100 uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Beta Feature</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl text-navy-900 mb-4 leading-tight">
              Can't decide? Let our <span className="text-transparent bg-clip-text bg-gradient-brand">AI Gift Finder</span> help.
            </h2>
            
            <p className="text-text-600 mb-8 text-lg">
              Tell us who it's for, your budget, and the occasion. Our AI will instantly curate the perfect handmade gifts from Sri Lankan artisans.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <Link
                 href="/ai-gift-finder"
                 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
               >
                 <Sparkles className="w-4 h-4" /> Try AI Gift Finder
               </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full relative h-[300px] md:h-[400px] hidden sm:block">
            {/* Abstract representation of AI processing gifts */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-primary-100 rounded-full blur-3xl absolute animate-pulse-soft"></div>
              
              {/* Fake UI cards floating */}
              <div className="relative w-full h-full">
                <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-soft-xl border border-surface-200 rotate-6 transform transition-transform hover:rotate-0 hover:scale-105 z-20">
                  <div className="w-32 h-32 relative rounded-xl overflow-hidden mb-3">
                     <Image src="/images/categories/pottery.jpg" alt="Gift idea" fill className="object-cover" />
                  </div>
                  <div className="h-2 w-20 bg-surface-200 rounded-full mb-2"></div>
                  <div className="h-2 w-12 bg-primary-200 rounded-full"></div>
                </div>
                
                <div className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-soft-xl border border-surface-200 -rotate-6 transform transition-transform hover:rotate-0 hover:scale-105 z-10">
                  <div className="w-28 h-28 relative rounded-xl overflow-hidden mb-3">
                     <Image src="/images/categories/jewelry.jpg" alt="Gift idea" fill className="object-cover" />
                  </div>
                  <div className="h-2 w-16 bg-surface-200 rounded-full mb-2"></div>
                  <div className="h-2 w-10 bg-accent-200 rounded-full"></div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-soft-xl border border-primary-100 flex items-center justify-center z-30">
                  <Bot className="w-10 h-10 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
