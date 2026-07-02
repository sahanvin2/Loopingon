"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="w-full bg-[#FCFDFD] py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Custom Orders */}
          <div className="relative rounded-2xl overflow-hidden bg-[#F2EAE1] h-[220px] flex items-center shadow-sm group cursor-pointer">
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
              <Image 
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop" 
                alt="Pottery" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              {/* Gradient mask for smooth blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F2EAE1] to-transparent" />
            </div>
            <div className="relative z-10 pl-8 pr-4 py-6 w-2/3">
              <h3 className="font-serif text-2xl font-bold text-navy-900 leading-tight">Custom made just for you</h3>
              <p className="text-sm font-medium text-text-700 mt-2 line-clamp-2">Bring your ideas to life with our talented sellers.</p>
              <Link 
                href="/custom-orders" 
                className="inline-flex items-center gap-2 mt-5 bg-[#E63946] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#D92D3A] transition-colors"
              >
                Start Custom Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Deals */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0A2342] h-[220px] flex items-center shadow-sm group cursor-pointer">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-[180px] h-[180px]">
              <Image 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop" 
                alt="Gift Box" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl brightness-110" 
              />
            </div>
            <div className="relative z-10 pl-8 pr-4 py-6 w-[70%]">
              <h3 className="font-serif text-2xl font-bold text-white leading-tight">Up to 30% off<br/>Handpicked deals</h3>
              <p className="text-sm font-medium text-white/80 mt-2 line-clamp-2">Limited time offers on favorite finds.</p>
              <Link 
                href="/deals" 
                className="inline-flex items-center gap-2 mt-5 bg-[#E63946] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#D92D3A] transition-colors"
              >
                Shop Deals
              </Link>
            </div>
          </div>

          {/* Card 3: Gift Ideas */}
          <div className="relative rounded-2xl overflow-hidden bg-[#E2F0F1] h-[220px] flex items-center shadow-sm group cursor-pointer">
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
              <Image 
                src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&h=300&fit=crop" 
                alt="Gifts" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E2F0F1] to-transparent" />
            </div>
            <div className="relative z-10 pl-8 pr-4 py-6 w-2/3">
              <h3 className="font-serif text-2xl font-bold text-navy-900 leading-tight">Gift ideas for every occasion</h3>
              <p className="text-sm font-medium text-text-700 mt-2 line-clamp-2">Birthday, anniversary, wedding or just because.</p>
              <Link 
                href="/gift-ideas" 
                className="inline-flex items-center gap-2 mt-5 bg-[#0A2342] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#07182D] transition-colors"
              >
                Explore Gifts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
