"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/shared/badge";

const testimonials = [
  {
    name: "Priya Fernando",
    city: "Colombo",
    initials: "PF",
    rating: 5,
    text: "I ordered a handloom saree for my sister's wedding and it was absolutely stunning. The quality, the colors, and the craftsmanship were beyond my expectations. Knowing it was made by a local seller made it even more special.",
    product: "Handloom Silk Saree",
  },
  {
    name: "James Anderson",
    city: "Melbourne",
    initials: "JA",
    rating: 5,
    text: "As someone who collects art from around the world, the Sri Lankan mask I received is one of my favorite pieces. The detail is incredible. Shipping to Australia was fast and the packaging was excellent.",
    product: "Traditional Raksha Mask",
  },
  {
    name: "Samantha Perera",
    city: "Kandy",
    initials: "SP",
    rating: 4,
    text: "I love that I can find genuine Sri Lankan crafts all in one place. The batik wall hanging I received was even more beautiful than the photos. The seller even included a handwritten note!",
    product: "Batik Wall Hanging",
  },
  {
    name: "Michael Becker",
    city: "Berlin",
    initials: "MB",
    rating: 5,
    text: "The brass elephant statue I ordered is magnificent. It's clear that generations of skill went into this piece. Kandyam made it easy to buy authentic Sri Lankan crafts from overseas.",
    product: "Brass Elephant Statue",
  },
  {
    name: "Dilani Weerasinghe",
    city: "Galle",
    initials: "DW",
    rating: 5,
    text: "Every purchase from Kandyam makes me feel connected to my heritage. The coir products I ordered were exactly like the ones my grandmother used to make. Thank you for preserving these crafts.",
    product: "Handwoven Coir Mat",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const itemsPerView = 3;
  const maxIndex = testimonials.length - itemsPerView;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="py-16 px-4 max-w-8xl mx-auto">
      <h2 className="font-serif text-3xl text-text-900 text-center mb-12">
        What Our Customers Say
      </h2>

      <div className="relative">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${current * (100 / itemsPerView)}%` }}
            transition={{ type: "tween", duration: 0.5 }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "flex-shrink-0 bg-white rounded-lg border border-accent-200 shadow-sm p-6",
                  "w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]",
                )}
              >
                <Quote className="w-8 h-8 text-primary-200 mb-4" />

                <p className="text-muted-600 italic mb-6 line-clamp-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-600 font-semibold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-text-700 font-medium text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-500 text-xs">{t.city}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <RatingStars rating={t.rating} size="sm" />
                  <Badge variant="outline" size="sm">
                    {t.product}
                  </Badge>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
          disabled={current === 0}
          className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
            "bg-white border border-surface-300 shadow-sm text-muted-600",
            "hidden lg:flex items-center justify-center transition-colors",
            "hover:bg-muted-50 disabled:opacity-40 disabled:cursor-not-allowed",
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrent((prev) => Math.min(maxIndex, prev + 1))}
          disabled={current >= maxIndex}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
            "bg-white border border-surface-300 shadow-sm text-muted-600",
            "hidden lg:flex items-center justify-center transition-colors",
            "hover:bg-muted-50 disabled:opacity-40 disabled:cursor-not-allowed",
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === current
                  ? "bg-primary-600 w-6"
                  : "bg-muted-300 hover:bg-muted-400",
              )}
              aria-label={`Go to testimonial group ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
