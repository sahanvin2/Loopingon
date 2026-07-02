"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    title: "Home Decor",
    subtitle: "Decorate your dream space",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=150&h=150&fit=crop",
    href: "/products?category=home-decor",
  },
  {
    title: "Jewelry",
    subtitle: "Timeless pieces for every style",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop",
    href: "/products?category=jewelry",
  },
  {
    title: "Clothing",
    subtitle: "Trendy looks for every season",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    href: "/products?category=clothing",
  },
  {
    title: "Accessories",
    subtitle: "Complete your perfect look",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop",
    href: "/products?category=accessories",
  },
  {
    title: "Art & Collectibles",
    subtitle: "Unique finds for every collector",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=150&h=150&fit=crop",
    href: "/products?category=art",
  },
  {
    title: "Beauty",
    subtitle: "Skincare, makeup & more",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop",
    href: "/products?category=beauty",
  },
  {
    title: "Wedding",
    subtitle: "Everything for your special day",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&h=150&fit=crop",
    href: "/products?category=weddings",
  },
  {
    title: "Toys & Games",
    subtitle: "Fun for kids of all ages",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=150&h=150&fit=crop",
    href: "/products?category=toys",
  },
  {
    title: "Books",
    subtitle: "Stories that inspire",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop",
    href: "/products?category=books",
  },
  {
    title: "Vintage",
    subtitle: "Timeless items with history",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=150&h=150&fit=crop",
    href: "/products?category=vintage",
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
