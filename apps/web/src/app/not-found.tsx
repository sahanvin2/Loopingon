"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, Sparkles, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-surface-50 px-4 py-20 relative overflow-hidden">
      {/* Decorative background blobs using framer-motion */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, -50, 0], 
          scale: [1, 1.1, 1],
        }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-80" 
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 0],
          y: [0, 40, 0], 
          scale: [1, 1.2, 1],
        }} 
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60" 
      />
      <motion.div 
        animate={{ 
          x: [0, 40, 0],
          y: [0, 30, 0], 
          scale: [1, 0.9, 1],
        }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50" 
      />

      <div className="relative w-full max-w-2xl text-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 relative inline-block"
        >
          <h1 className="font-serif text-[140px] leading-none font-bold text-primary-500 opacity-10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-soft-lg flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
              <Sparkles className="w-10 h-10 text-primary-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mb-4 font-serif text-3xl md:text-5xl font-bold text-text-800">
            Looks like we wandered off the path.
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-muted-500 text-lg leading-relaxed">
            The item you're looking for seems to be hiding. Let's get you back to discovering great products.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mb-12 max-w-md"
        >
          <div className="relative group">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-400 transition-colors group-focus-within:text-primary-500" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full rounded-full border-2 border-accent-200 bg-white py-4 pl-14 pr-6 text-sm text-text-800 placeholder:text-muted-400 shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value.trim();
                  if (query) {
                    window.location.href = `/products?q=${encodeURIComponent(query)}`;
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-soft-md hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white border border-accent-200 px-8 py-3.5 text-sm font-medium text-text-800 shadow-sm transition-all hover:bg-primary-50 hover:border-primary-400 hover:text-primary-500"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-accent-200"
        >
          <p className="text-sm font-medium text-muted-500 mb-4 uppercase tracking-widest">
            Popular Right Now
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Games", href: "/products?category=games" },
              { label: "Software", href: "/products?category=software" },
              { label: "Gift Cards", href: "/products?category=gift-cards" },
              { label: "AI Prompts", href: "/products?category=ai-productivity" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1.5 rounded-full bg-white border border-accent-200 px-5 py-2 text-xs font-medium text-muted-500 shadow-sm transition-all hover:bg-primary-500 hover:border-primary-500 hover:text-white"
              >
                {link.label}
                <MoveRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
