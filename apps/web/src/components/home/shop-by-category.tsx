"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { title: "Games", href: "/products?category=games" },
  { title: "Gift Cards", href: "/products?category=gift-cards" },
  { title: "Software", href: "/products?category=software" },
  { title: "AI", href: "/products?category=ai" },
  { title: "Education", href: "/products?category=education" },
  { title: "Design Assets", href: "/products?category=design-assets" },
  { title: "Web Development", href: "/products?category=web-development" },
  { title: "Mobile Apps", href: "/products?category=mobile-apps" },
  { title: "Business Tools", href: "/products?category=business-tools" },
  { title: "Streaming", href: "/products?category=streaming" },
  { title: "Freelance Services", href: "/products?category=freelance-services" },
  { title: "Digital Downloads", href: "/products?category=digital-downloads" },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.title} 
              href={category.href}
              className="group flex items-center justify-center p-4 bg-[#F8F5F1] rounded-xl border border-transparent hover:border-[#62A7B0]/30 hover:shadow-sm hover:bg-white transition-all text-center min-h-[80px]"
            >
              <h3 className="text-sm font-bold text-navy-900 group-hover:text-[#E63946] transition-colors">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
