import React from "react";
import Link from "next/link";
import { 
  Home, Gem, Shirt, Sparkles, Palette, 
  Archive, Clock, Briefcase, BookOpen, ToyBrick 
} from "lucide-react";

export function CategoryCircle() {
  const categories = [
    { name: "Home Decor", icon: Home, href: "/categories/home-decor", color: "bg-orange-50 text-orange-600" },
    { name: "Jewelry", icon: Gem, href: "/categories/jewelry", color: "bg-purple-50 text-purple-600" },
    { name: "Fashion", icon: Shirt, href: "/categories/fashion", color: "bg-pink-50 text-pink-600" },
    { name: "Beauty", icon: Sparkles, href: "/categories/beauty", color: "bg-rose-50 text-rose-600" },
    { name: "Art", icon: Palette, href: "/categories/art", color: "bg-blue-50 text-blue-600" },
    { name: "Collectibles", icon: Archive, href: "/categories/collectibles", color: "bg-amber-50 text-amber-600" },
    { name: "Vintage", icon: Clock, href: "/categories/vintage", color: "bg-emerald-50 text-emerald-600" },
    { name: "Bags", icon: Briefcase, href: "/categories/bags", color: "bg-indigo-50 text-indigo-600" },
    { name: "Books", icon: BookOpen, href: "/categories/books", color: "bg-cyan-50 text-cyan-600" },
    { name: "Toys", icon: ToyBrick, href: "/categories/toys", color: "bg-red-50 text-red-600" },
  ];

  return (
    <section className="py-16 bg-main">
      <div className="container-page mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-navy-900">Explore by Category</h2>
          <div className="w-16 h-1 bg-primary-500 mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="flex flex-col items-center group gap-3"
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${cat.color} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent group-hover:ring-surface-200`}>
                <cat.icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-navy-900 text-center group-hover:text-primary-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
