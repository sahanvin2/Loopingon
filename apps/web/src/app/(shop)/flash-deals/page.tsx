"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Zap, Search } from "lucide-react";
import Link from "next/link";

export default function FlashDealsPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-surface-50 py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative lightning bolts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <Zap className="absolute top-10 left-[10%] w-32 h-32 text-primary-500 -rotate-12" />
        <Zap className="absolute bottom-20 right-[15%] w-48 h-48 text-primary-500 rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
          >
            <Timer className="w-12 h-12 text-red-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
            Flash Deals
          </h1>
          <p className="text-lg text-text-600 leading-relaxed mb-8">
            Limited time offers on exquisite handcrafted pieces. Grab them before they're gone!
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4 text-center">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-soft border border-surface-200">
              <span className="block text-3xl font-bold text-primary-600 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-xs text-text-500 uppercase tracking-wider font-semibold mt-1 block">Hours</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">:</span>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-soft border border-surface-200">
              <span className="block text-3xl font-bold text-primary-600 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-xs text-text-500 uppercase tracking-wider font-semibold mt-1 block">Mins</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">:</span>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-soft border border-surface-200">
              <span className="block text-3xl font-bold text-primary-600 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-text-500 uppercase tracking-wider font-semibold mt-1 block">Secs</span>
            </div>
          </div>
        </div>

        {/* Empty State / Coming Soon */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-soft-sm border border-surface-200">
          <Zap className="w-16 h-16 text-muted-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">No Active Flash Deals</h2>
          <p className="text-text-500 max-w-md mx-auto mb-8">
            Our artisans are currently preparing the next batch of amazing deals. Check back soon or browse our regular catalog in the meantime!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-primary-600"
          >
            <Search className="w-4 h-4" />
            Browse All Products
          </Link>
        </div>
      </div>
    </main>
  );
}
