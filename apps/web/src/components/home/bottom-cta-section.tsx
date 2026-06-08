"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomCtaSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Newsletter Box */}
        <div className="bg-surface-100 rounded-[2rem] p-8 md:p-12 border border-surface-300 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="relative z-10 max-w-md">
            <h3 className="font-serif text-3xl text-navy-900 mb-2">Stay in the loop</h3>
            <p className="text-sm text-text-600 mb-6">
              Get early access to new arrivals, exclusive offers & more.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                disabled={status === "loading" || status === "success"}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium text-white shadow-sm transition-colors shrink-0",
                  "bg-primary-500 hover:bg-primary-600",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            {status === "success" && <p className="mt-2 text-sm text-green-600">Thanks for subscribing!</p>}
          </div>
          
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-60 pointer-events-none">
             <Image src="/images/categories/pottery.jpg" alt="Decoration" fill className="object-cover object-left mask-image-gradient" />
          </div>
        </div>

        {/* App Download Box */}
        <div className="bg-surface-50 rounded-[2rem] p-8 md:p-12 border border-surface-300 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="relative z-10 max-w-sm">
            <h3 className="font-serif text-3xl text-navy-900 mb-2">Download the Kandyam App</h3>
            <p className="text-sm text-text-600 mb-6">
              Shop on the go, track orders & get exclusive app deals!
            </p>
            <div className="flex items-center gap-3">
              <button className="bg-navy-900 text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-navy-800 transition-colors">
                {/* SVG Apple Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.89 13.91c-.34 1.05-1.4 3.02-3.1 3.02-1.63 0-2.12-.99-3.95-.99-1.8 0-2.39.96-3.92.96-1.74 0-3.04-2.22-3.52-3.66-1.2-3.62-.21-7.23 2.1-8.58 1.09-.64 2.29-.68 3.01-.68 1.55 0 2.45.89 3.51.89 1.13 0 2.29-1 3.86-1 .4 0 2.28.16 3.32 1.66-2.82 1.48-2.33 5.48.69 6.38zM14.6 7.23c-.76.92-1.86 1.44-2.89 1.34-.17-1.12.35-2.26 1.04-3.07.72-.85 1.88-1.46 2.89-1.34.19 1.12-.34 2.19-1.04 3.07z"/>
                </svg>
                <div className="text-left flex flex-col">
                   <span className="text-[10px] leading-tight">Download on the</span>
                   <span className="text-xs font-semibold leading-tight">App Store</span>
                </div>
              </button>
              <button className="bg-navy-900 text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-navy-800 transition-colors">
                {/* SVG Play Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M3 2v20l18-10L3 2zm2 3.83L15.22 12 5 18.17V5.83z"/>
                </svg>
                <div className="text-left flex flex-col">
                   <span className="text-[10px] leading-tight">GET IT ON</span>
                   <span className="text-xs font-semibold leading-tight">Google Play</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Phone mockups decorative */}
          <div className="absolute right-0 bottom-0 w-1/2 h-[90%] pointer-events-none hidden sm:block">
            <div className="absolute bottom-0 right-10 w-40 h-64 bg-white rounded-t-3xl border-8 border-navy-900 shadow-xl overflow-hidden transform rotate-6 z-10">
               <Image src="/images/categories/handloom.jpg" alt="App screen" fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 right-28 w-40 h-56 bg-surface-100 rounded-t-3xl border-8 border-navy-900 shadow-xl overflow-hidden transform -rotate-6">
               <Image src="/images/categories/jewelry.jpg" alt="App screen" fill className="object-cover" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
