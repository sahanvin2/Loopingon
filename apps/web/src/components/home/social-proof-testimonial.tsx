"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

export function SocialProofTestimonial() {
  return (
    <section className="w-full bg-[#FCFDFD] py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="bg-[#0A2342] rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          
          {/* Left: Quote */}
          <div className="w-full lg:w-1/2 flex items-start gap-4">
            <Quote className="w-12 h-12 text-[#E63946] shrink-0 opacity-80" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                "Kandyam is my go-to for unique, high-quality finds and supporting small businesses."
              </h2>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#62A7B0]">
                  <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Sarah M." width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Sarah M.</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider mt-1">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Images */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center gap-6 lg:justify-end relative">
            <div className="flex gap-3">
              {[
                "https://images.unsplash.com/photo-1601392740426-907c7b028119?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1544931170-3ca1337cce88?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=120&h=160&fit=crop",
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&h=160&fit=crop",
              ].map((src, i) => (
                <div key={i} className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border border-white/20 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                  <Image src={src} alt={`Customer purchase ${i+1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left ml-2">
              <p className="text-white font-serif font-bold leading-tight">
                Trusted by<br/>
                <span className="text-xl">10,000+</span><br/>
                happy<br/>customers
              </p>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#E63946] mt-2 hidden sm:block">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
