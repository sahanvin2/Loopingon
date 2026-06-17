"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner 1: Custom Made */}
        <div className="relative rounded-2xl overflow-hidden bg-[#FAEDE8] p-8 lg:p-10 flex flex-col justify-center min-h-[260px] border border-[#f5e0d8]">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-text-900 mb-2 leading-tight">
              Custom made just for you
            </h3>
            <p className="text-sm text-text-700 mb-6">
              Bring your ideas to life with our talented creators.
            </p>
            <Link
              href="/custom-orders"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-soft"
            >
              Start Custom Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
            <Image src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop" alt="Custom made" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAEDE8] via-[#FAEDE8]/80 to-transparent"></div>
          </div>
        </div>

        {/* Banner 2: Handpicked Deals */}
        <div className="relative rounded-2xl overflow-hidden bg-navy-900 text-white p-8 lg:p-10 flex flex-col justify-center min-h-[260px]">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 leading-tight">
              Up to 30% off<br />Handpicked deals
            </h3>
            <p className="text-sm text-navy-200 mb-6">
              Limited time offers on favorite finds.
            </p>
            <Link
              href="/flash-deals"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-soft"
            >
              Shop Deals
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
             {/* Fake 3D gift box image using unsplash as a placeholder for the mockup gift box */}
             <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" alt="Gift deals" fill className="object-cover mix-blend-screen opacity-90" />
             <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent"></div>
          </div>
        </div>

        {/* Banner 3: Gift Ideas */}
        <div className="relative rounded-2xl overflow-hidden bg-[#E5F1F4] p-8 lg:p-10 flex flex-col justify-center min-h-[260px] border border-[#d2e8ee]">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2 leading-tight">
              Gift ideas for every occasion
            </h3>
            <p className="text-sm text-navy-700 mb-6">
              Birthday, anniversary, wedding or just because.
            </p>
            <Link
              href="/gift"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-soft"
            >
              Explore Gifts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
             <Image src="https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop" alt="Gifts" fill className="object-cover" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#E5F1F4] via-[#E5F1F4]/80 to-transparent"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
