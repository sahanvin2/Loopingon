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
  Truck,
  ShieldCheck,
  Tag
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
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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
        {mounted && showAnnouncement && (
          <motion.div
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#62A7B0] text-white text-xs font-medium relative z-[60] overflow-hidden"
          >
            <div className="max-w-8xl mx-auto flex items-center justify-center py-2.5 px-4 text-center">
              <span className="flex items-center gap-2 sm:gap-6 flex-wrap justify-center">
                <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Customize your order to make it unique</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Support independent sellers</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Electronics, Fashion, Home & more</span>
              </span>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors focus:outline-none p-1 text-[10px] uppercase tracking-wider"
                aria-label="Close announcement"
              >
                <span className="hidden sm:inline">Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-surface-200 bg-white/95 backdrop-blur-md transition-all duration-300",
          isScrolled ? "shadow-soft-sm" : "",
        )}
      >
        <div className="max-w-8xl mx-auto flex h-[80px] items-center px-4 sm:px-6 xl:px-8 gap-4 xl:gap-8">
          <div className="flex items-center gap-4 lg:gap-8 lg:mr-8">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group focus:outline-none"
              aria-label="Kandyam home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F7444E" className="w-8 h-8 shrink-0">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
              </svg>
              <span className="font-serif text-[28px] tracking-tight text-navy-900 font-bold hidden sm:block">
                Kandyam
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            <div className="relative" ref={categoriesRef}>
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-text-700 hover:text-primary-600 transition-colors"
              >
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-6 w-[600px] bg-white rounded-xl shadow-soft-xl border border-surface-200 overflow-hidden p-6 max-h-[70vh] overflow-y-auto scrollbar-thin grid grid-cols-3 gap-y-2 gap-x-6"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link 
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-text-700 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/products" className="text-sm font-medium text-text-700 hover:text-primary-600 transition-colors">
              Shop
            </Link>
            <Link href="/custom-orders" className="text-sm font-medium text-text-700 hover:text-primary-600 transition-colors">
              Custom Orders
            </Link>
            <Link href="/gift-ideas" className="text-sm font-medium text-text-700 hover:text-primary-600 transition-colors">
              Gift Ideas
            </Link>
            <Link href="/deals" className="text-sm font-medium text-text-700 hover:text-primary-600 transition-colors">
              Deals
            </Link>
            <Link href="/about" className="text-sm font-medium text-text-700 hover:text-primary-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Persistent Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xl mx-auto relative group">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..." 
                className="w-full h-[42px] bg-surface-50 border border-surface-200 rounded-full pl-5 pr-12 text-sm focus:outline-none focus:border-[#E63946] focus:bg-white focus:ring-4 focus:ring-primary-50 transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 h-7 w-7 grid place-items-center rounded-full hover:bg-surface-100 transition-colors">
                <Search className="w-4 h-4 text-text-500 group-focus-within:text-[#E63946]" />
              </button>
            </form>
          </div>

          {/* Right side nav */}
          <nav className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => isSearchOpen ? closeSearch() : openSearch()}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
              aria-label="Search"
            >
               <Search className="h-5 w-5 text-navy-900" />
            </button>

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
              <Heart className="h-[22px] w-[22px] text-navy-900" />
            </button>

            {/* User Menu */}
            {mounted ? (
              isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
                >
                   <User className="h-[22px] w-[22px] text-navy-900" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-soft-xl"
                    >
                      <div className="border-b border-surface-100 px-4 py-3">
                        <p className="text-xs text-text-400">Signed in as</p>
                        <p className="truncate text-sm font-medium text-navy-900">{user.email}</p>
                      </div>
                      <div className="py-1 text-sm">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-text-600 hover:bg-surface-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logoutMutation.mutate();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => openModal("signin")}
                aria-label="Sign in"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
              >
                <User className="h-[22px] w-[22px] text-navy-900" />
              </button>
            )) : (
              <div className="h-10 w-10 rounded-full bg-surface-100 animate-pulse" />
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors group"
            >
              <ShoppingCart className="h-[22px] w-[22px] text-navy-900 group-hover:scale-105 transition-transform" />
              {mounted && itemCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-[#E63946] px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={openMobileMenu}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-surface-100 transition-colors"
            >
              <Menu className="h-[22px] w-[22px] text-navy-900" />
            </button>
          </nav>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-surface-200 bg-white px-4 py-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..." 
                  className="w-full h-11 bg-surface-50 border border-surface-200 rounded-xl pl-4 pr-12 text-sm focus:outline-none focus:border-[#E63946]"
                  autoFocus
                />
                <button type="button" onClick={closeSearch} className="absolute right-2 top-1.5 h-8 w-8 grid place-items-center rounded-lg hover:bg-surface-200 text-text-500">
                  <X className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
