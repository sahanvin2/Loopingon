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

const CATEGORIES = [
  { name: "Games", icon: Gamepad2, href: "/products?category=games", color: "text-[#62A7B0]" },
  { name: "Software", icon: Monitor, href: "/products?category=software", color: "text-[#62A7B0]" },
  { name: "Gift Cards", icon: Gift, href: "/products?category=gift-cards", color: "text-[#62A7B0]" },
  { name: "Templates", icon: Code, href: "/products?category=web-development", color: "text-[#62A7B0]" },
  { name: "Creative Assets", icon: Palette, href: "/products?category=creative-assets", color: "text-[#E63946]" },
  { name: "Courses", icon: GraduationCap, href: "/products?category=educational", color: "text-[#E63946]" },
  { name: "AI Prompts", icon: Server, href: "/products?category=ai-productivity", color: "text-[#F4A261]" },
  { name: "Audio", icon: Headphones, href: "/products?category=digital-services", color: "text-[#F4A261]" },
  { name: "E-Books", icon: BookOpen, href: "/products?category=educational", color: "text-[#E63946]" },
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
