"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ShoppingBag,
  Grid3X3,
  Info,
  Newspaper,
  HelpCircle,
  LayoutDashboard,
  Package,
  Heart,
  MessageSquare,
  LogIn,
  Users,
  Gift,
  Share2,
  Search,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";

const navSections = [
  { icon: ShoppingBag, label: "Shop", href: "/products" },
  { icon: Grid3X3, label: "Categories", href: "/categories" },
  { icon: Users, label: "Makers", href: "/makers" },
  { icon: Gift, label: "Gifts", href: "/gift" },
  { icon: Info, label: "About", href: "/about-us" },
  { icon: Newspaper, label: "Blog", href: "/blog" },
  { icon: Share2, label: "Referral Program", href: "/referral" },
  { icon: HelpCircle, label: "Help", href: "/help-center" },
];

const categories = [
  {
    label: "Home Decor",
    href: "/products?category=home-decor",
    subcategories: [
      { label: "Wall Art", href: "/products?category=home-decor&subcategory=wall-art" },
      { label: "Vases & Pots", href: "/products?category=home-decor&subcategory=vases" },
      { label: "Rugs", href: "/products?category=home-decor&subcategory=rugs" },
    ]
  },
  {
    label: "Jewelry",
    href: "/products?category=jewelry",
    subcategories: [
      { label: "Necklaces", href: "/products?category=jewelry&subcategory=necklaces" },
      { label: "Earrings", href: "/products?category=jewelry&subcategory=earrings" },
      { label: "Bracelets", href: "/products?category=jewelry&subcategory=bracelets" },
    ]
  },
  { label: "Bags & Accessories", href: "/products?category=bags" },
  { label: "Candles", href: "/products?category=candles" },
  { label: "Wood Crafts", href: "/products?category=wood" },
  { label: "Pottery & Ceramics", href: "/products?category=pottery" },
  { label: "Fashion & Apparel", href: "/products?category=clothing" },
];

const accountLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Orders", href: "/dashboard/orders" },
  { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
];

export function MobileNav() {
  const { isAuthenticated } = useAuthStore();
  const { isMobileMenuOpen, closeMobileMenu, openModal } = useUIStore();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeMobileMenu();
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-text-900/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <motion.aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white overflow-y-auto lg:hidden",
              "shadow-soft-lg",
            )}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-accent-200">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="font-serif text-xl text-primary-600 font-bold"
              >
                Kandyam
              </Link>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="p-1.5 rounded-lg text-muted-500 hover:text-text-700 hover:bg-muted-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-accent-100">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search handcrafted items..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-accent-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </form>
            </div>

            <nav className="px-3 py-4">
              <ul className="space-y-1">
                {navSections.map((section) => (
                  <li key={section.label}>
                    {section.label === "Categories" ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setCategoriesOpen(!categoriesOpen)}
                          className={cn(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg",
                            "text-text-700 hover:bg-accent-50 transition-colors text-sm font-medium",
                          )}
                        >
                          <section.icon className="w-5 h-5 text-muted-500" />
                          <span className="flex-1 text-left">{section.label}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-muted-400 transition-transform duration-200",
                              categoriesOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {categoriesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden ml-9 border-l-2 border-primary-200 pl-3 mt-1"
                            >
                              {categories.map((cat) => (
                                <div key={cat.label}>
                                  <Link
                                    href={cat.href}
                                    onClick={closeMobileMenu}
                                    className="block py-2 text-sm font-medium text-muted-700 hover:text-primary-600 transition-colors"
                                  >
                                    {cat.label}
                                  </Link>
                                  {cat.subcategories && (
                                    <div className="pl-4 pb-1 border-l border-accent-200 ml-1">
                                      {cat.subcategories.map(sub => (
                                        <Link
                                          key={sub.label}
                                          href={sub.href}
                                          onClick={closeMobileMenu}
                                          className="block py-1.5 text-xs text-muted-500 hover:text-primary-600 transition-colors"
                                        >
                                          {sub.label}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={section.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          "text-text-700 hover:bg-accent-50 transition-colors text-sm font-medium",
                        )}
                      >
                        <section.icon className="w-5 h-5 text-muted-500" />
                        {section.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {isAuthenticated && (
                <>
                  <div className="mt-6 pt-6 border-t border-accent-200">
                    <p className="px-3 text-xs font-semibold text-muted-500 uppercase tracking-wider mb-2">
                      My Account
                    </p>
                    <ul className="space-y-1">
                      {accountLinks.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "text-text-700 hover:bg-accent-50 transition-colors text-sm font-medium",
                            )}
                          >
                            <link.icon className="w-5 h-5 text-muted-500" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="mt-6 px-3">
                  <button
                    onClick={() => { closeMobileMenu(); openModal("signin"); }}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg",
                      "bg-primary-600 text-white text-sm font-medium hover:bg-primary-700",
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </div>
              )}
            </nav>

            <div className="sticky bottom-0 bg-white border-t border-accent-200 px-4 py-3 flex items-center gap-3">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
