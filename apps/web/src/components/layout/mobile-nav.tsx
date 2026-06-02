"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ShoppingBag,
  Grid3X3,
  Store,
  Info,
  Newspaper,
  Trophy,
  HelpCircle,
  LayoutDashboard,
  Package,
  Heart,
  MessageSquare,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";

const navSections = [
  { icon: ShoppingBag, label: "Shop", href: "/products" },
  { icon: Grid3X3, label: "Categories", href: "/categories" },
  { icon: Store, label: "Sell on Loopingon", href: "/vendor/register" },
  { icon: Info, label: "About", href: "/about" },
  { icon: Newspaper, label: "Blog", href: "/blog" },
  { icon: Trophy, label: "Competitions", href: "/competitions" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

const categories = [
  { label: "Handloom & Textiles", href: "/categories/handloom-textiles" },
  { label: "Wood Carving & Masks", href: "/categories/wood-carving-masks" },
  { label: "Pottery & Ceramics", href: "/categories/pottery-ceramics" },
  { label: "Jewelry & Brassware", href: "/categories/jewelry-brassware" },
  { label: "Batik & Dyeing", href: "/categories/batik-dyeing" },
  { label: "Lacquerware", href: "/categories/lacquerware" },
  { label: "Coir & Reed Products", href: "/categories/coir-reed" },
  { label: "Leather Crafts", href: "/categories/leather-crafts" },
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

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden"
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
            <div className="flex items-center justify-between px-5 py-4 border-b border-blush-200">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="font-serif text-xl text-rose-600 font-bold"
              >
                Loopingon
              </Link>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="p-1.5 rounded-lg text-muted-500 hover:text-charcoal-700 hover:bg-muted-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
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
                            "text-charcoal-700 hover:bg-blush-50 transition-colors text-sm font-medium",
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
                              className="overflow-hidden ml-9 border-l-2 border-rose-200 pl-3 mt-1"
                            >
                              {categories.map((cat) => (
                                <Link
                                  key={cat.label}
                                  href={cat.href}
                                  onClick={closeMobileMenu}
                                  className="block py-2 text-sm text-muted-600 hover:text-rose-600 transition-colors"
                                >
                                  {cat.label}
                                </Link>
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
                          "text-charcoal-700 hover:bg-blush-50 transition-colors text-sm font-medium",
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
                  <div className="mt-6 pt-6 border-t border-blush-200">
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
                              "text-charcoal-700 hover:bg-blush-50 transition-colors text-sm font-medium",
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
                      "bg-rose-600 text-white text-sm font-medium hover:bg-rose-700",
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </div>
              )}
            </nav>

            <div className="sticky bottom-0 bg-white border-t border-blush-200 px-4 py-3 flex items-center gap-3">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
