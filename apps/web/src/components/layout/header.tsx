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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useLogout } from "@/hooks/use-auth";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const { openCartDrawer, openMobileMenu, isMobileMenuOpen, openModal } = useUIStore();
  const logoutMutation = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-blush-200 bg-cream-50/85 backdrop-blur-md transition-all duration-300",
        isScrolled ? "shadow-soft-sm" : "",
      )}
    >
      <div className="max-w-8xl mx-auto flex h-16 items-center gap-4 px-4 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Loopingon home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-serif text-lg shadow-[0_8px_20px_-8px_rgba(176,86,110,0.7)] group-hover:scale-105 transition-transform">
            L
          </span>
          <span className="font-serif text-2xl tracking-tight text-charcoal-900 hidden sm:block">
            loopingo
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={cn(
            "hidden md:flex items-center flex-1 max-w-xl",
            searchFocused && "max-w-2xl",
          )}
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-400" />
            <input
              type="search"
              placeholder="Search handmade treasures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "h-11 w-full rounded-full border border-blush-200 bg-blush-50/60 pl-10 pr-4 text-sm outline-none transition-all",
                "focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-400/20",
                "placeholder:text-muted-400",
              )}
              aria-label="Search products"
            />
          </div>
        </form>

        {/* Right side nav */}
        <nav className="ml-auto flex items-center gap-0.5 text-sm">
          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 mr-2">
              <Link
                href="/products"
                className="rounded-full px-3 py-2 text-charcoal-600 hover:bg-blush-100 hover:text-charcoal-900 transition-colors"
              >
                Shop
              </Link>
            {user?.role === "VENDOR" && (
              <Link
                href="/vendor/dashboard"
                className="rounded-full px-3 py-2 text-charcoal-600 hover:bg-blush-100 hover:text-charcoal-900 transition-colors hidden sm:inline-flex items-center gap-1"
              >
                <Store className="h-4 w-4" /> Seller Dashboard
              </Link>
            )}
            <Link
              href="/about-us"
              className="rounded-full px-3 py-2 text-charcoal-600 hover:bg-blush-100 hover:text-charcoal-900 transition-colors hidden md:inline-flex"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3 py-2 text-charcoal-600 hover:bg-blush-100 hover:text-charcoal-900 transition-colors hidden md:inline-flex"
            >
              Contact
            </Link>
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
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush-100 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-charcoal-600" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-blush-100 transition-colors group"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingCart className="h-5 w-5 text-charcoal-600 group-hover:scale-105 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white shadow-sm">
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
                  "ml-1 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-medium text-sm",
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
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-blush-200 bg-white shadow-[0_30px_80px_-20px_rgba(176,86,110,0.4)]"
                    role="menu"
                  >
                    <div className="border-b border-blush-100 px-4 py-3">
                      <p className="text-xs text-muted-400">Signed in as</p>
                      <p className="truncate text-sm font-medium text-charcoal-700">{user.email}</p>
                    </div>
                    <div className="py-1 text-sm">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-charcoal-600 hover:bg-blush-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-400" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-charcoal-600 hover:bg-blush-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Package className="h-4 w-4 text-muted-400" /> Orders
                      </Link>
                      <Link
                        href="/dashboard/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-charcoal-600 hover:bg-blush-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <HeartIcon className="h-4 w-4 text-muted-400" /> Wishlist
                      </Link>
                      <Link
                        href="/dashboard/messages"
                        className="flex items-center gap-3 px-4 py-2.5 text-charcoal-600 hover:bg-blush-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <MessageSquare className="h-4 w-4 text-muted-400" /> Messages
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-charcoal-600 hover:bg-blush-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 text-muted-400" /> Settings
                      </Link>
                    </div>
                    <div className="border-t border-blush-100">
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
                className="ml-1 hidden h-10 items-center rounded-full px-4 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 sm:inline-flex"
              >
                Sign in
              </button>
              <button
                onClick={() => openModal("signup")}
                className="hidden h-10 items-center rounded-full bg-gradient-to-r from-rose-400 to-rose-600 px-4 text-sm font-medium text-white shadow-[0_12px_28px_-14px_rgba(176,86,110,0.7)] hover:opacity-95 hover:scale-105 transition-all sm:inline-flex"
              >
                Join
              </button>
              <button
                onClick={() => openModal("signin")}
                aria-label="Sign in"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush-100 sm:hidden"
              >
                <User className="h-5 w-5 text-charcoal-600" />
              </button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush-100 transition-colors lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-charcoal-600" />
            ) : (
              <Menu className="h-5 w-5 text-charcoal-600" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
