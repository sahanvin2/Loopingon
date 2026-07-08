"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Games",
    subtitle: "PC, Console & Mobile",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80",
    href: "/products?category=games",
  },
  {
    title: "Software",
    subtitle: "Productivity & OS",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&q=80",
    href: "/products?category=software",
  },
  {
    title: "Gift Cards",
    subtitle: "Wallet top-ups",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&q=80",
    href: "/products?category=gift-cards",
  },
  {
    title: "AI Prompts",
    subtitle: "ChatGPT & Midjourney",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&q=80",
    href: "/products?category=ai-productivity",
  },
  {
    title: "Courses",
    subtitle: "Learn new skills",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80",
    href: "/products?category=educational",
  },
  {
    title: "Templates",
    subtitle: "Web & Design assets",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&q=80",
    href: "/products?category=web-development",
  },
  {
    title: "E-Books",
    subtitle: "Digital reading",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
    href: "/products?category=educational",
  },
  {
    title: "Audio",
    subtitle: "Music & Sound FX",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80",
    href: "/products?category=digital-services",
  },
  {
    title: "Digital Art",
    subtitle: "Illustrations & Graphics",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&q=80",
    href: "/products?category=creative-assets",
  },
  {
    title: "Subscriptions",
    subtitle: "Memberships & Services",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&q=80",
    href: "/products?category=digital-services",
  },
];

export function ShopByCategoryCards() {
  return (
    <section className="py-16 bg-surface-50 border-y border-surface-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl font-bold text-text-900">Shop by Category</h2>
          <Link href="/categories" className="flex items-center text-sm font-semibold text-accent-600 hover:text-accent-700">
            Explore all categories <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group bg-white rounded-xl shadow-soft-sm hover:shadow-soft transition-all duration-300 overflow-hidden flex flex-row items-center p-4 border border-surface-100 hover:border-surface-300"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-text-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors">{category.title}</h3>
                <p className="text-xs text-muted-500 leading-snug">{category.subtitle}</p>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden relative bg-surface-100">
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
