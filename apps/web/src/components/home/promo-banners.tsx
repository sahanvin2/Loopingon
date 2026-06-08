"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 mt-4 mb-5">
      <div className="flex flex-col items-center bg-navy-900/40 text-white rounded-md p-1.5 min-w-[40px]">
        <span className="text-lg font-bold font-mono">{format(timeLeft.hours)}</span>
        <span className="text-[9px] uppercase">Hours</span>
      </div>
      <span className="text-white/50 font-bold">:</span>
      <div className="flex flex-col items-center bg-navy-900/40 text-white rounded-md p-1.5 min-w-[40px]">
        <span className="text-lg font-bold font-mono">{format(timeLeft.minutes)}</span>
        <span className="text-[9px] uppercase">Mins</span>
      </div>
      <span className="text-white/50 font-bold">:</span>
      <div className="flex flex-col items-center bg-navy-900/40 text-white rounded-md p-1.5 min-w-[40px]">
        <span className="text-lg font-bold font-mono">{format(timeLeft.seconds)}</span>
        <span className="text-[9px] uppercase">Secs</span>
      </div>
    </div>
  );
}

export function PromoBanners() {
  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Orders Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-accent-100 p-8 flex flex-col justify-center min-h-[280px]">
          <div className="relative z-10 max-w-[60%]">
            <h3 className="font-serif text-2xl md:text-3xl text-navy-900 mb-3">
              Need something custom?
            </h3>
            <p className="text-sm text-navy-600 mb-6 line-clamp-3">
              Request a unique handmade item made especially for you.
            </p>
            <Link
              href="/custom-orders"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Request Custom Item <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-80 pointer-events-none">
            {/* Placeholder for pottery image */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent-200 rounded-full blur-2xl"></div>
            <Image
              src="/images/categories/pottery.jpg"
              alt="Custom Pottery"
              fill
              className="object-cover object-left rounded-l-full shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        {/* Flash Deals Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-navy-900 text-white p-8 flex flex-col justify-center min-h-[280px]">
          <div className="relative z-10">
            <h3 className="font-serif text-2xl md:text-3xl mb-2 flex items-center gap-2">
              Flash Deals
            </h3>
            <p className="text-sm text-navy-200">
              Up to 30% off on selected items
            </p>
            
            <CountdownTimer />
            
            <Link
              href="/flash-deals"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="absolute right-6 bottom-6 w-32 h-32 pointer-events-none opacity-90 transform rotate-[-15deg]">
             {/* Replace with actual 3d gift box image if available */}
             <div className="w-full h-full bg-accent-400 rounded-lg relative overflow-hidden flex items-center justify-center">
                <div className="absolute w-8 h-full bg-primary-400"></div>
                <div className="absolute h-8 w-full bg-primary-400"></div>
                <Gift className="w-16 h-16 text-white absolute z-10" />
             </div>
          </div>
        </div>

        {/* Gift Ideas Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-surface-100 p-8 flex flex-col justify-center min-h-[280px] border border-surface-300">
          <div className="relative z-10 max-w-[60%]">
            <h3 className="font-serif text-2xl md:text-3xl text-navy-900 mb-3">
              Gift Ideas
            </h3>
            <p className="text-sm text-text-600 mb-6">
              Find the perfect handmade gift for any occasion.
            </p>
            <Link
              href="/gift"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Explore Gifts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute -right-8 bottom-0 w-3/5 h-[80%] pointer-events-none">
            <Image
              src="/images/categories/wood-carving.jpg"
              alt="Gift box"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
