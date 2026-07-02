"use client";

import React from "react";
import Link from "next/link";
import { 
  Home, 
  Gem, 
  Shirt, 
  Briefcase, 
  Palette, 
  Sparkles, 
  HeartHandshake, 
  Gamepad2, 
  BookOpen, 
  MoreHorizontal 
} from "lucide-react";

const CATEGORIES = [
  { name: "Home & Living", icon: Home, href: "/products?category=home-living", color: "text-[#62A7B0]" },
  { name: "Jewelry", icon: Gem, href: "/products?category=jewelry", color: "text-[#62A7B0]" },
  { name: "Clothing", icon: Shirt, href: "/products?category=clothing", color: "text-[#62A7B0]" },
  { name: "Accessories", icon: Briefcase, href: "/products?category=accessories", color: "text-[#62A7B0]" },
  { name: "Art & Collectibles", icon: Palette, href: "/products?category=art-collectibles", color: "text-[#E63946]" },
  { name: "Beauty", icon: Sparkles, href: "/products?category=beauty", color: "text-[#E63946]" },
  { name: "Wedding", icon: HeartHandshake, href: "/products?category=weddings", color: "text-[#F4A261]" },
  { name: "Toys & Games", icon: Gamepad2, href: "/products?category=toys-games", color: "text-[#F4A261]" },
  { name: "Books", icon: BookOpen, href: "/products?category=books", color: "text-[#E63946]" },
  { name: "More", icon: MoreHorizontal, href: "/products", color: "text-text-500" },
];

export function CategoryIconRow() {
  return (
    <section className="w-full bg-[#FCFDFD] py-12 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8 overflow-hidden">
        <div className="flex justify-between items-start gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.name} 
                href={cat.href}
                className="flex flex-col items-center gap-3 min-w-[90px] snap-start group"
              >
                <div className="w-16 h-16 rounded-full border border-surface-200 bg-white flex items-center justify-center shadow-sm group-hover:border-[#62A7B0] group-hover:bg-[#f0f7f8] transition-all">
                  <Icon className={`w-7 h-7 ${cat.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-navy-900 text-center max-w-[80px] leading-tight group-hover:text-[#62A7B0] transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
