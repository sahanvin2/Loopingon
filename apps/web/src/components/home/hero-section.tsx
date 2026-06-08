"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Heart, ShieldCheck, Truck, RefreshCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: Heart, title: "Handmade with Love", desc: "Crafted with care and passion" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Safe & secure checkout" },
  { icon: Truck, title: "Free Shipping", desc: "On orders over Rs. 5,000" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "Hassle-free returns within 7 days" },
  { icon: Users, title: "Support Makers", desc: "Empowering independent creators" },
];

export function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-8 pb-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card */}
        <div className="rounded-[2.5rem] bg-gradient-hero overflow-hidden relative border border-accent-100 shadow-soft-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-20 relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-text-900 leading-[1.1] mb-6 tracking-tight">
                Handmade <br />
                with heart. <br />
                <span className="text-primary-500 italic font-medium">Made for you.</span>
              </h1>

              <p className="text-lg text-text-600 mb-10 font-light leading-relaxed max-w-lg">
                Discover unique creations from talented makers across Sri Lanka.
              </p>

              {/* Large Search Bar */}
              <div className="relative max-w-xl mb-8">
                <input
                  type="text"
                  placeholder="Search handmade gifts, crafts, jewelry..."
                  className="w-full h-16 pl-6 pr-20 rounded-full border border-surface-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all text-base shadow-sm outline-none"
                />
                <button className="absolute right-2 top-2 bottom-2 w-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Popular Searches */}
              <div>
                <p className="text-sm font-medium text-text-800 mb-3">Popular searches:</p>
                <div className="flex flex-wrap items-center gap-3">
                  {["Wood Crafts", "Batik", "Jewelry", "Pottery", "Wedding Gifts"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag.toLowerCase())}`}
                      className="px-4 py-2 rounded-full bg-white text-text-600 text-sm font-medium border border-surface-300 hover:border-primary-400 hover:text-primary-600 transition-colors shadow-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Graphics area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[500px] hidden lg:block"
            >
              {/* This is a placeholder for the beautiful composite image from the mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[450px] h-[450px] bg-white rounded-full opacity-40 mix-blend-overlay absolute -right-20 -top-20 blur-3xl"></div>
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-soft-xl rotate-3 bg-surface-200">
                   <div className="absolute inset-0 bg-gradient-brand opacity-10" />
                   {/* In a real scenario, an optimized transparent PNG composite would go here */}
                   <Image
                     src="/images/hero/handloom.jpg"
                     alt="Handmade crafts"
                     fill
                     className="object-cover"
                   />
                </div>
                
                {/* Support Local Makers Badge */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full shadow-soft-lg flex items-center justify-center border border-accent-100 z-20"
                >
                  <div className="text-center">
                    <Heart className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                    <span className="block text-[10px] font-bold text-text-800 uppercase tracking-widest leading-tight">
                      Support <br/> Local <br/> Makers
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 max-w-7xl mx-auto rounded-2xl bg-white border border-surface-300 shadow-sm p-6 lg:p-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-surface-200">
            {features.map((feature, idx) => (
              <div key={idx} className={cn("flex items-start gap-4", idx > 0 ? "pt-6 lg:pt-0 lg:pl-6" : "")}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-text-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
