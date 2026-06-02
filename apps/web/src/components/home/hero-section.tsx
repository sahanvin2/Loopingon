"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative w-full py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto rounded-[2rem] bg-gradient-to-br from-rose-50 to-white overflow-hidden relative border border-blush-100 shadow-soft-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 lg:p-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-xs font-medium text-charcoal-600 mb-6 shadow-sm border border-blush-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>New spring drop</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 leading-[1.1] mb-5 tracking-tight">
              Handmade things,<br />
              <span className="text-rose-500 italic font-medium">made with care.</span>
            </h1>

            <p className="text-base text-charcoal-600 mb-8 font-light leading-relaxed max-w-md">
              A softer marketplace where every piece is one of a kind — by makers you can root for.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/categories"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                  "bg-rose-500 text-white font-medium text-sm",
                  "hover:bg-rose-600 hover:shadow-md transition-all duration-300 group",
                )}
              >
                Shop the collection
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-up/vendor"
                className={cn(
                  "inline-flex items-center px-6 py-3 rounded-full",
                  "bg-white text-charcoal-800 font-medium text-sm",
                  "hover:bg-muted-50 hover:shadow-md transition-all duration-300 shadow-sm border border-blush-200",
                )}
              >
                Become a seller
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-charcoal-500 font-medium">
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                </div>
                Buyer protection
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-4 h-4 text-rose-600" />
                </div>
                12k+ makers
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[300px] lg:h-[400px] w-full rounded-[1.5rem] overflow-hidden shadow-soft-xl group"
          >
            <Image
              src="/images/hero/handloom.jpg"
              alt="Handmade pink crafts and candles"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Soft overlay to make it match the pink aesthetic */}
            <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay group-hover:bg-rose-500/0 transition-colors duration-500" />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md p-3.5 rounded-xl shadow-soft-lg border border-white/20"
            >
              <p className="text-[10px] uppercase tracking-wider text-charcoal-500 mb-0.5 font-semibold">Today's pick</p>
              <p className="font-serif font-medium text-charcoal-900 text-sm">Rose Petal Candle</p>
              <p className="text-rose-600 font-bold text-sm mt-0.5">$32</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
