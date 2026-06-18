"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Heart as HeartIcon,
  MessageSquare,
  Settings,
  Store,
  Gift,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useLogout } from "@/hooks/use-auth";
import { SearchBar } from "@/components/search/search-bar";

const PRODUCT_CATEGORIES = [
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Art & Collectibles", href: "/products?category=art-collectibles" },
  { label: "Bags & Purses", href: "/products?category=bags-purses" },
  { label: "Bath & Beauty", href: "/products?category=bath-beauty" },
  { label: "Books, Movies & Music", href: "/products?category=books-movies-music" },
  { label: "Clothing", href: "/products?category=clothing" },
  { label: "Craft Supplies & Tools", href: "/products?category=craft-supplies-tools" },
  { label: "Electronics & Accessories", href: "/products?category=electronics-accessories" },
  { label: "Gifts", href: "/products?category=gifts" },
  { label: "Home & Living", href: "/products?category=home-living" },
  { label: "Jewelry", href: "/products?category=jewelry" },
  { label: "Kids & Baby", href: "/products?category=kids-baby" },
  { label: "Paper & Party Supplies", href: "/products?category=paper-party-supplies" },
  { label: "Pet Supplies", href: "/products?category=pet-supplies" },
  { label: "Shoes", href: "/products?category=shoes" },
  { label: "Toys & Games", href: "/products?category=toys-games" },
  { label: "Weddings", href: "/products?category=weddings" },
];

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const { openCartDrawer, openMobileMenu, isMobileMenuOpen, openModal, isSearchOpen, openSearch, closeSearch } = useUIStore();
  const logoutMutation = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementMounted, setAnnouncementMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnnouncementMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <AnimatePresence>
        {announcementMounted && showAnnouncement && (
          <motion.div
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-navy-500 text-white text-xs md:text-sm font-medium relative z-[60] overflow-hidden"
          >
            <div className="max-w-8xl mx-auto flex items-center justify-center py-2 px-4">
              <span className="text-center pr-16">
                Kandyam: Sri Lanka's Premier Marketplace for Authentic Handmade Crafts.
              </span>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors focus:outline-none p-1 text-xs uppercase tracking-wider"
                aria-label="Close announcement"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-surface-200 bg-white/90 backdrop-blur-md transition-all duration-300",
          isScrolled ? "shadow-soft-sm" : "",
        )}
      >
        <div className="max-w-8xl mx-auto flex h-[90px] items-center gap-4 px-4 sm:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Kandyam home"
          >
            <span className="grid h-10 w-10 place-items-center text-primary-500 group-hover:scale-105 transition-transform bg-primary-50 rounded-xl">
               {/* Simple Triangle Logo */}
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                 <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
               </svg>
            </span>
            <span className="font-serif text-3xl tracking-tight text-navy-900 hidden sm:block font-bold">
               Kandyam
            </span>
          </Link>

          {/* Center Content: Nav Links or SearchBar */}
          <div className="hidden lg:flex items-center justify-center gap-6 mx-auto absolute left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none">
            <div className="pointer-events-auto flex w-full justify-center">
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search-bar"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="w-full px-4"
                  >
                    <SearchBar 
                      className="w-full shadow-soft-md" 
                      expanded={true} 
                      onExpand={(exp) => { if (!exp) closeSearch(); }} 
                    />
                  </motion.div>
                ) : (
                  <motion.nav
                    key="nav-links"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center gap-6"
                  >
                    <div className="relative" ref={categoriesRef}>
                      <button 
                        onClick={() => setCategoriesOpen(!categoriesOpen)}
                        className="flex items-center gap-1 text-[15px] font-medium text-text-700 hover:text-primary-600 transition-colors"
                      >
                        Categories <ChevronDown className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {categoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[800px] bg-white rounded-2xl shadow-soft-xl border border-surface-200 overflow-hidden p-6 max-h-[70vh] overflow-y-auto scrollbar-thin grid grid-cols-3 gap-y-2 gap-x-6"
                          >
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <Link 
                                key={cat.label}
                                href={cat.href}
                                onClick={() => setCategoriesOpen(false)}
                                className="block px-4 py-2 text-sm font-medium text-text-700 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Link href="/products" className="text-[15px] font-medium text-text-700 hover:text-primary-600 transition-colors">
                      Shop
                    </Link>
                    <Link href="/gift-ideas" className="text-[15px] font-medium text-text-700 hover:text-primary-600 transition-colors">
                      Gift Ideas
                    </Link>
                    <Link href="/custom-orders" className="text-[15px] font-medium text-text-700 hover:text-primary-600 transition-colors">
                      Custom Orders
                    </Link>
                    <Link href="/creators" className="text-[15px] font-medium text-text-700 hover:text-primary-600 transition-colors">
                      Creators
                    </Link>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side nav */}
          <nav className="ml-auto flex items-center gap-1 text-sm">
            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <button
                onClick={() => isSearchOpen ? closeSearch() : openSearch()}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-100 transition-colors"
                aria-label="Search"
              >
                 <Search className="h-[22px] w-[22px] text-navy-900" />
              </button>
            </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              if (isAuthenticated) {
                window.location.href = "/dashboard/wishlist";
              } else {
                e.preventDefault();
                openModal("signin");
              }
            }}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-navy-900" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors group order-1 sm:order-none"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingCart className="h-5 w-5 text-navy-900 group-hover:scale-105 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary-500 px-1 text-[11px] font-semibold text-white shadow-sm">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* User menu or Sign in */}
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "ml-1 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium text-sm",
                  "shadow-[0_8px_20px_-8px_rgba(176,86,110,0.6)] hover:scale-105 transition-transform",
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                {(user.firstName || user.fullName || "U")[0].toUpperCase()}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-[0_30px_80px_-20px_rgba(176,86,110,0.4)]"
                    role="menu"
                  >
                    <div className="border-b border-accent-100 px-4 py-3">
                      <p className="text-xs text-muted-400">Signed in as</p>
                      <p className="truncate text-sm font-medium text-text-700">{user.email}</p>
                    </div>
                    <div className="py-1 text-sm">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-400" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Package className="h-4 w-4 text-muted-400" /> Orders
                      </Link>
                      <Link
                        href="/dashboard/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <HeartIcon className="h-4 w-4 text-muted-400" /> Wishlist
                      </Link>
                      <Link
                        href="/dashboard/messages"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <MessageSquare className="h-4 w-4 text-muted-400" /> Messages
                      </Link>
                      <Link
                        href="/dashboard/referrals"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Share2 className="h-4 w-4 text-muted-400" /> Referral Program
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-accent-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 text-muted-400" /> Settings
                      </Link>
                    </div>
                    <div className="border-t border-accent-100">
                      <button
                        type="button"
                        onClick={() => {
                          logoutMutation.mutate();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={() => openModal("signin")}
                aria-label="Sign in"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
              >
                <User className="h-5 w-5 text-navy-900" />
              </button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent-100 transition-colors lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-text-600" />
            ) : (
              <Menu className="h-5 w-5 text-text-600" />
            )}
          </button>
        </nav>
      </div>
    </header>
    </>
  );
}
