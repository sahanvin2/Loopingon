"use client";

import React, { useState } from "react";
import Image from "next/image";

export function NewsletterAndApp() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-white border-b border-surface-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Newsletter */}
          <div className="bg-[#fcfaf8] rounded-2xl p-8 lg:p-12 relative overflow-hidden flex items-center border border-surface-200">
            <div className="relative z-10 max-w-sm">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-900 mb-3">Get special offers & updates</h2>
              <p className="text-muted-600 mb-8">Be the first to know about new arrivals, exclusive offers and more.</p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow rounded-full border border-surface-300 px-5 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary-500 px-8 py-3 font-bold text-white transition-colors hover:bg-primary-600 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="absolute right-0 bottom-0 w-48 h-48 opacity-60 pointer-events-none hidden sm:block">
              <Image src="https://images.unsplash.com/photo-1505691938895-1758d7bef511?q=80&w=400&auto=format&fit=crop" alt="Floral decor" fill className="object-cover rounded-tl-full mix-blend-multiply" />
            </div>
          </div>

          {/* Download App */}
          <div className="bg-surface-50 rounded-2xl p-8 lg:p-12 relative overflow-hidden flex items-center border border-surface-200">
            <div className="relative z-10 max-w-sm">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-900 mb-3">Download the Kandyam App</h2>
              <p className="text-muted-600 mb-8">Shop on the go, track orders & get exclusive app deals!</p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#" className="inline-block transition-transform hover:scale-105">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" width={140} height={42} className="h-11 w-auto" />
                </a>
                <a href="#" className="inline-block transition-transform hover:scale-105">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" width={140} height={42} className="h-11 w-auto" />
                </a>
              </div>
            </div>
            
            <div className="absolute -right-8 -bottom-16 w-64 h-80 pointer-events-none hidden md:block">
              {/* Fake phone silhouette for illustration */}
              <div className="w-full h-full bg-text-900 rounded-[2rem] border-[6px] border-surface-300 shadow-xl relative rotate-12 flex flex-col overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-text-900 rounded-b-xl z-20"></div>
                <div className="flex-1 bg-white pt-10 px-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary-500 font-serif font-bold text-lg">kandyam</span>
                  </div>
                  <div className="w-full h-32 bg-surface-100 rounded-lg mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full h-24 bg-surface-100 rounded-lg"></div>
                    <div className="w-full h-24 bg-surface-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
