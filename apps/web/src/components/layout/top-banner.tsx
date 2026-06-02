"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  "Free Delivery on Orders Over Rs. 5,000",
  "New Artisans Join Weekly",
  "Shop Handmade with Love",
];

const STORAGE_KEY = "top-banner-dismissed";

export function TopBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "true") setIsDismissed(true);
  }, []);

  useEffect(() => {
    if (isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDismissed]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  if (isDismissed) return null;

  return (
    <div className="relative h-12 bg-rose-600 overflow-hidden">
      <div className="max-w-8xl mx-auto h-full flex items-center justify-center px-12">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="text-white text-sm font-medium text-center"
          >
            {messages[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
        {messages.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              i === currentIndex ? "bg-cream-50" : "bg-rose-400",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={dismiss}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded",
          "text-cream-200 hover:text-white hover:bg-rose-700/30 transition-colors",
        )}
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
