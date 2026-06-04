"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/shared/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceDisplay } from "@/components/shared/price-display";
import { cn } from "@/lib/utils";

const artisans = [
  {
    name: "Sunil Perera",
    craft: "Wood Carving & Masks",
    location: "Ambalangoda",
    since: 1985,
    image: "/images/artisans/sunil.jpg",
    excerpt: [
      "Sunil is a third-generation mask carver from Ambalangoda, the heart of Sri Lanka's traditional mask-making heritage. He learned the craft from his grandfather at age 12, mastering the intricate techniques passed down through generations.",
      "Each of his masks tells a story from Sri Lankan folklore — from the Kolam dance masks to the Raksha demon masks used in traditional healing rituals. Sunil's work has been exhibited in galleries across Colombo, London, and Melbourne.",
    ],
    products: [
      { name: "Raksha Mask", price: 8500, originalPrice: 10000, image: "/images/products/mask1.jpg" },
      { name: "Kolam Mask", price: 6500, image: "/images/products/mask2.jpg" },
      { name: "Wall Panel", price: 12000, originalPrice: 15000, image: "/images/products/mask3.jpg" },
    ],
  },
  {
    name: "Nayana Wickramasinghe",
    craft: "Batik & Dyeing",
    location: "Kandy",
    since: 1998,
    image: "/images/artisans/nayana.jpg",
    excerpt: [
      "Nayana runs a small batik studio in the hills of Kandy, where she and her team of six women create stunning batik sarongs, wall hangings, and fashion pieces. Her designs blend traditional Sri Lankan motifs with contemporary aesthetics.",
      "Nayana's work is particularly known for its vibrant color palette inspired by Kandy's botanical gardens and the Perahera festival. She sources all her dyes from natural ingredients — indigo, turmeric, and madder root.",
    ],
    products: [
      { name: "Batik Sarong", price: 4500, image: "/images/products/batik1.jpg" },
      { name: "Wall Hanging", price: 7800, originalPrice: 9500, image: "/images/products/batik2.jpg" },
    ],
  },
];

const fadeInSection = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function ArtisanSpotlight() {
  return (
    <section className="py-16 px-4 bg-surface-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 25% 50%, #b0566e 0px, #b0566e 2px, transparent 2px, transparent 40px)",
        }}
      />

      <div className="max-w-8xl mx-auto relative">
        <h2 className="font-serif text-3xl text-text-900 text-center mb-12">
          Meet Our Artisans
        </h2>

        <div className="space-y-20">
          {artisans.map((artisan, index) => (
            <motion.div
              key={artisan.name}
              variants={fadeInSection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center",
                index % 2 !== 0 && "lg:direction-rtl",
              )}
            >
              <div
                className={cn(
                  "relative aspect-[4/5] rounded-lg overflow-hidden",
                  index % 2 !== 0 && "lg:order-2",
                )}
              >
                <Image
                  src={artisan.image}
                  alt={artisan.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
                <Badge variant="blush" size="sm" className="mb-3">
                  {artisan.craft}
                </Badge>
                <h3 className="font-serif text-2xl text-text-900 mb-1">
                  Meet {artisan.name}
                </h3>
                <p className="text-muted-600 text-sm mb-4">
                  {artisan.location} &middot; Crafting since {artisan.since}
                </p>

                <div className="space-y-3 text-muted-600 mb-8">
                  {artisan.excerpt.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {artisan.products.map((product) => (
                    <div
                      key={product.name}
                      className="bg-white rounded-lg border border-accent-200 overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="33vw"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-text-700 font-medium truncate">
                          {product.name}
                        </p>
                        <PriceDisplay
                          price={product.price}
                          originalPrice={product.originalPrice}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/artisans/${artisan.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={cn(
                    "inline-flex items-center px-6 py-2.5 rounded-lg",
                    "bg-primary-600 text-white text-sm font-medium",
                    "hover:bg-primary-700 transition-colors",
                  )}
                >
                  Visit Store
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
