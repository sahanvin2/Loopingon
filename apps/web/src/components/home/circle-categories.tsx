"use client";

import React from "react";
import Link from "next/link";
import { 
  Home, 
  Gem, 
  Shirt, 
  Watch, 
  Palette, 
  Sparkles, 
  Heart, 
  Gamepad2, 
  Book, 
  MoreHorizontal 
} from "lucide-react";

const categories = [
  { name: "Home & Living", icon: Home, href: "/categories/home-living" },
  { name: "Jewelry", icon: Gem, href: "/categories/jewelry" },
  { name: "Clothing", icon: Shirt, href: "/categories/clothing" },
  { name: "Accessories", icon: Watch, href: "/categories/accessories" },
  { name: "Art & Collectibles", icon: Palette, href: "/categories/art-collectibles" },
  { name: "Beauty", icon: Sparkles, href: "/categories/beauty" },
  { name: "Wedding", icon: Heart, href: "/categories/wedding" },
  { name: "Toys & Games", icon: Gamepad2, href: "/categories/toys-games" },
  { name: "Books", icon: Book, href: "/categories/books" },
  { name: "More", icon: MoreHorizontal, href: "/categories" },
];

export function CircleCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-surface-200 bg-white flex items-center justify-center group-hover:shadow-soft group-hover:-translate-y-1 transition-all duration-300">
                <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-text-700 group-hover:text-primary-600 transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-text-900 text-center max-w-[80px]">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
