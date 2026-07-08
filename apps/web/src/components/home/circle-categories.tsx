"use client";

import React from "react";
import Link from "next/link";
import { 
  Gamepad2, 
  Monitor, 
  Code, 
  Palette, 
  Gift, 
  GraduationCap, 
  Server, 
  Headphones, 
  BookOpen, 
  MoreHorizontal 
} from "lucide-react";

const categories = [
  { name: "Games", icon: Gamepad2, href: "/products?category=games" },
  { name: "Software", icon: Monitor, href: "/products?category=software" },
  { name: "Gift Cards", icon: Gift, href: "/products?category=gift-cards" },
  { name: "Templates", icon: Code, href: "/products?category=web-development" },
  { name: "Creative Assets", icon: Palette, href: "/products?category=creative-assets" },
  { name: "Courses", icon: GraduationCap, href: "/products?category=educational" },
  { name: "AI Prompts", icon: Server, href: "/products?category=ai-productivity" },
  { name: "Audio", icon: Headphones, href: "/products?category=digital-services" },
  { name: "E-Books", icon: BookOpen, href: "/products?category=educational" },
  { name: "More", icon: MoreHorizontal, href: "/products" },
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
