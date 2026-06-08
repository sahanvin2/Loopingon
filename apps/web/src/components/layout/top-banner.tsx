"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  { text: "Free shipping on orders over Rs. 5,000", icon: Truck },
  { text: "Support Sri Lankan Creators", icon: Heart },
  { text: "Handmade with love, delivered with care.", icon: Sparkles },
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
    <div className="relative bg-accent-500 overflow-hidden text-white">
      {/* Mobile Slider */}
      <div className="md:hidden h-10 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-xs font-medium"
          >
            {React.createElement(messages[currentIndex].icon, { className: "w-3 h-3" })}
            <span>{messages[currentIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop Static List */}
      <div className="hidden md:flex max-w-7xl mx-auto h-10 items-center justify-center px-12 gap-8 text-sm font-medium">
        {messages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-2">
              <msg.icon className="w-4 h-4" />
              <span>{msg.text}</span>
            </div>
            {idx < messages.length - 1 && <span className="text-white/40">|</span>}
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        onClick={dismiss}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded",
          "text-white/80 hover:text-white hover:bg-white/10 transition-colors",
        )}
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
