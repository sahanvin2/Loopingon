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
} from "lucide-react";
import { cn, getAvatarUrl, getInitials, getInitialsColor } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useLogout } from "@/hooks/use-auth";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const { openCartDrawer, openMobileMenu, isMobileMenuOpen } = useUIStore();
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
        "sticky top-0 z-50 h-16 bg-cream-100/95 backdrop-blur-sm border-b transition-shadow duration-300",
        isScrolled ? "border-cream-200 shadow-soft" : "border-transparent",
      )}
    >
      <div className="max-w-8xl mx-auto h-full flex items-center gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Loopingon home"
        >
          <span className="font-serif text-2xl text-terracotta-600 font-bold">
            Loopingon
          </span>
          <span className="hidden sm:block w-2 h-2 rounded-full bg-gold-500" />
        </Link>

        <form
          onSubmit={handleSearch}
          className={cn(
            "hidden md:flex items-center flex-1 max-w-md mx-auto transition-all duration-300",
            searchFocused && "max-w-lg",
          )}
        >
          <div
            className={cn(
              "relative w-full",
              "rounded-full bg-white shadow-sm border border-cream-300",
              "focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-transparent",
              "transition-all duration-300",
            )}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-500" />
            <input
              type="search"
              placeholder="Search handmade treasures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-full text-sm",
                "bg-transparent text-charcoal-700 placeholder:text-warm-gray-400",
                "focus:outline-none",
              )}
              aria-label="Search products"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Link
            href="/dashboard/wishlist"
            className="hidden sm:inline-flex p-2 rounded-lg text-charcoal-600 hover:bg-warm-gray-100 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative p-2 rounded-lg text-charcoal-600 hover:bg-warm-gray-100 transition-colors"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-terracotta-600 text-white text-xs flex items-center justify-center font-medium">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 p-1.5 rounded-lg",
                  "hover:bg-warm-gray-100 transition-colors",
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-cream-300"
                  />
                ) : (
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white",
                      getInitialsColor(user.fullName),
                    )}
                  >
                    {getInitials(user.fullName)}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-warm-gray-500 transition-transform duration-200",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-soft-md border border-cream-200 overflow-hidden"
                    role="menu"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-terracotta-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-terracotta-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    <Link
                      href="/dashboard/wishlist"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-terracotta-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <HeartIcon className="w-4 h-4" /> Wishlist
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-terracotta-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <MessageSquare className="w-4 h-4" /> Messages
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-terracotta-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <hr className="border-cream-200" />
                    <button
                      type="button"
                      onClick={() => {
                        logoutMutation.mutate();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta-600 text-white text-sm font-medium hover:bg-terracotta-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={openMobileMenu}
            className="p-2 rounded-lg text-charcoal-600 hover:bg-warm-gray-100 transition-colors lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
