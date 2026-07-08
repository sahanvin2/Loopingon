"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    title: "Games",
    subtitle: "PC, Console & Mobile",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop",
    href: "/products?category=games",
  },
  {
    title: "Software",
    subtitle: "Productivity & OS",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=150&h=150&fit=crop",
    href: "/products?category=software",
  },
  {
    title: "Gift Cards",
    subtitle: "Wallet top-ups",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop",
    href: "/products?category=gift-cards",
  },
  {
    title: "AI Prompts",
    subtitle: "ChatGPT & Midjourney",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop",
    href: "/products?category=ai-productivity",
  },
  {
    title: "Courses",
    subtitle: "Learn new skills",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop",
    href: "/products?category=educational",
  },
  {
    title: "Templates",
    subtitle: "Web & Design assets",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=150&h=150&fit=crop",
    href: "/products?category=web-development",
  },
  {
    title: "E-Books",
    subtitle: "Digital reading",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop",
    href: "/products?category=educational",
  },
  {
    title: "Audio",
    subtitle: "Music & Sound FX",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&h=150&fit=crop",
    href: "/products?category=digital-services",
  },
  {
    title: "Digital Art",
    subtitle: "Illustrations & Graphics",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=150&h=150&fit=crop",
    href: "/products?category=creative-assets",
  },
  {
    title: "Subscriptions",
    subtitle: "Memberships & Services",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=150&h=150&fit=crop",
    href: "/products?category=digital-services",
  },
];

export function ShopByCategory() {
  return (
    <section className="w-full bg-[#FCFDFD] py-16 border-b border-surface-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            Shop by Category
          </h2>
          <Link href="/categories" className="flex items-center gap-1 text-sm font-bold text-[#62A7B0] hover:text-[#4A8A92] transition-colors">
            Explore all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.title} 
              href={category.href}
              className="group flex flex-col justify-between p-4 bg-[#F8F5F1] rounded-2xl border border-transparent hover:border-[#62A7B0]/30 hover:shadow-md transition-all h-[140px] lg:h-[160px] relative overflow-hidden"
            >
              <div className="z-10 w-[60%]">
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-[#E63946] transition-colors">{category.title}</h3>
                <p className="text-[11px] font-medium text-text-500 mt-1 leading-snug">{category.subtitle}</p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-[45%]">
                <Image 
                  src={category.image} 
                  alt={category.title} 
                  fill sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover object-left mask-image-to-l group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F1] via-[#F8F5F1]/80 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
