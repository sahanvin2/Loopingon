"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="w-full bg-[#FCFDFD] py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

          {/* Card 2: Deals */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0A2342] h-[220px] flex items-center shadow-sm group cursor-pointer">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-[180px] h-[180px]">
              <Image 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop" 
                alt="Gaming Deals" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover rounded-full group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl brightness-110" 
              />
            </div>
            <div className="relative z-10 pl-8 pr-4 py-6 w-[70%]">
              <h3 className="font-serif text-2xl font-bold text-white leading-tight">Up to 30% off<br/>Digital games</h3>
              <p className="text-sm font-medium text-white/80 mt-2 line-clamp-2">Limited time offers on top tier game keys.</p>
              <Link 
                href="/deals" 
                className="inline-flex items-center gap-2 mt-5 bg-[#E63946] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#D92D3A] transition-colors"
              >
                Shop Deals
              </Link>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
