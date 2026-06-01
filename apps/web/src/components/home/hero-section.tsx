"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const banners = [
  {
    image: "/images/hero/handloom.jpg",
    headline: "Discover Authentic Sri Lankan Handloom",
    subheadline: "Woven with Tradition, Worn with Pride",
    cta: { label: "Shop Handloom Collection", href: "/categories/handloom-textiles" },
  },
  {
    image: "/images/hero/artisan.jpg",
    headline: "Meet the Artisans Behind Every Creation",
    subheadline: "10,000+ Verified Craftspeople",
    cta: { label: "Explore Artisan Stories", href: "/artisans" },
  },
  {
    image: "/images/hero/competition.jpg",
    headline: "Monthly Craft Challenge",
    subheadline: "Submit Your Best Work, Win Amazing Prizes",
    cta: { label: "Join Competition", href: "/competitions" },
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goTo = useCallback(
    (index: number) => setCurrent((index + banners.length) % banners.length),
    [],
  );

  const banner = banners[current];

  return (
    <section
      className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-charcoal-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero banner carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={banner.image}
            alt={banner.headline}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-8xl mx-auto w-full px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-4">
                {banner.headline}
              </h1>
              <p className="text-lg sm:text-xl text-cream-100/90 mb-8">
                {banner.subheadline}
              </p>
              <Link
                href={banner.cta.href}
                className={cn(
                  "inline-flex items-center px-8 py-3.5 rounded-full",
                  "bg-terracotta-600 text-cream-100 text-base font-medium",
                  "hover:bg-terracotta-700 hover:scale-105 transition-all duration-300",
                  "shadow-terracotta",
                )}
              >
                {banner.cta.label}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              i === current
                ? "bg-cream-100 w-8"
                : "bg-cream-100/40 hover:bg-cream-100/70",
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20",
          "hidden md:flex items-center justify-center transition-colors",
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20",
          "hidden md:flex items-center justify-center transition-colors",
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}
