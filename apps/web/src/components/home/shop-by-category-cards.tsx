"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Home Decor",
    subtitle: "Decorate your dream space",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80",
    href: "/categories/home-living",
  },
  {
    title: "Jewelry",
    subtitle: "Timeless pieces for every style",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80",
    href: "/categories/jewelry",
  },
  {
    title: "Clothing",
    subtitle: "Trendy looks for every season",
    image: "https://images.unsplash.com/photo-1489987707023-afc824cdb142?w=300&q=80",
    href: "/categories/clothing",
  },
  {
    title: "Accessories",
    subtitle: "Complete your perfect look",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=300&q=80",
    href: "/categories/accessories",
  },
  {
    title: "Art & Collectibles",
    subtitle: "Unique finds for every collector",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80",
    href: "/categories/art-collectibles",
  },
  {
    title: "Beauty",
    subtitle: "Skincare, makeup & more",
    image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=300&q=80",
    href: "/categories/beauty",
  },
  {
    title: "Wedding",
    subtitle: "Everything for your special day",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80",
    href: "/categories/wedding",
  },
  {
    title: "Toys & Games",
    subtitle: "Fun for kids of all ages",
    image: "https://images.unsplash.com/photo-1558060370-d641142865b2?w=300&q=80",
    href: "/categories/toys-games",
  },
  {
    title: "Books",
    subtitle: "Stories that inspire",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
    href: "/categories/books",
  },
  {
    title: "Vintage",
    subtitle: "Timeless items with history",
    image: "https://images.unsplash.com/photo-1588665049386-896db5f2316d?w=300&q=80",
    href: "/categories/vintage",
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
                <Image src={category.image} alt={category.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
