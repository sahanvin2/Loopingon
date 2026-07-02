"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Wand2, Search } from "lucide-react";
import Link from "next/link";

export default function AIGiftFinderPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-surface-50 px-4 py-20 relative overflow-hidden">
      {/* Decorative blobs */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-10 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-10 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
      />

      <div className="relative z-10 max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-24 h-24 bg-white rounded-3xl shadow-soft-xl flex items-center justify-center mb-8 rotate-12 hover:rotate-0 transition-transform duration-500"
        >
          <Wand2 className="w-10 h-10 text-primary-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight"
        >
          Your Personal <br />
          <span className="text-primary-500 italic">AI Gift Finder</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-text-600 mb-10 max-w-lg mx-auto"
        >
          Our magical AI is currently being trained to find the perfect Sri Lankan gifts for your loved ones. We're putting the finishing touches on it!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-soft-md hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            Browse Manually
          </Link>
          <Link
            href="/categories"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white border border-accent-200 px-8 py-3.5 text-sm font-medium text-text-800 shadow-sm transition-all hover:bg-primary-50 hover:border-primary-400 hover:text-primary-500"
          >
            <Gift className="w-4 h-4" />
            View Categories
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-200 shadow-sm text-sm font-medium text-text-500"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Coming Soon</span>
        </motion.div>
      </div>
    </main>
  );
}
