"use client";

import React, { useState } from "react";
import Image from "next/image";

export function BottomCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic
    setEmail("");
  };

  return (
    <section className="w-full bg-[#FCFDFD] py-16 pb-24 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Newsletter */}
          <div className="bg-[#FCFDFD] rounded-3xl border border-surface-200 p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative z-10 w-full md:w-2/3">
              <h3 className="font-serif text-2xl font-bold text-navy-900 leading-tight">Get special offers & updates</h3>
              <p className="text-sm font-medium text-text-600 mt-2 mb-6">
                Be the first to know about new arrivals, exclusive offers and more.
              </p>
              
              <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-[320px] h-12 bg-white border border-surface-300 rounded-full overflow-hidden focus-within:border-[#E63946] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-full pl-5 pr-[110px] bg-transparent outline-none text-sm placeholder:text-text-400"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-5 bg-[#E63946] hover:bg-[#D92D3A] text-white text-xs font-bold rounded-full transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="absolute right-0 bottom-0 w-1/3 h-[120%] translate-y-[10%] hidden sm:block">
              <Image 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop" 
                alt="Digital artwork" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-contain object-bottom opacity-90 mix-blend-multiply" 
              />
            </div>
          </div>

          {/* Right: App Download */}
          <div className="bg-[#FCFDFD] rounded-3xl border border-surface-200 p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative z-10 w-full md:w-[60%]">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-2xl font-bold text-navy-900 leading-tight">Download the Kandyam App</h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap">Coming Soon</span>
              </div>
              <p className="text-sm font-medium text-text-600 mt-2 mb-6">
                Shop on the go, track orders & get exclusive app deals!
              </p>
              
              <div className="flex items-center gap-3 opacity-60 pointer-events-none">
                {/* App Store Button */}
                <button className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg transition-colors cursor-not-allowed">
                  <svg viewBox="0 0 384 512" fill="currentColor" className="w-6 h-6">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[8px] leading-none text-gray-300">Download on the</p>
                    <p className="text-sm font-semibold leading-tight">App Store</p>
                  </div>
                </button>
                
                {/* Google Play Button */}
                <button className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg transition-colors cursor-not-allowed">
                  <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6 text-green-500">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[8px] leading-none text-gray-300">GET IT ON</p>
                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 w-[45%] h-[120%] translate-y-[10%] hidden sm:block opacity-60">
              {/* Using a generic mockup image to represent the app screens */}
              <Image 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=400&fit=crop" 
                alt="App mockup" 
                fill sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-contain object-bottom mask-image-to-b" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
