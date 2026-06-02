"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/shared/badge";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials, getInitialsColor, cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
      return;
    }
    if (!isLoading && isAuthenticated && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Admin";
  const initials = getInitials(user?.fullName || "");
  const avatarBg = getInitialsColor(user?.fullName || "");

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <Sidebar variant="admin" className="hidden md:flex" />

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full"
            >
              <Sidebar variant="admin" className="w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blush-200">
          <div className="flex items-center justify-between px-6 py-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-600 hover:bg-cream-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 hidden md:flex">
              <h1 className="text-lg font-semibold text-charcoal-900">
                Admin Dashboard
              </h1>
              <Badge variant="rose" size="sm">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </Badge>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-cream-50 transition-colors"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white",
                    avatarBg,
                  )}
                >
                  {initials}
                </div>
                <span className="text-sm text-charcoal-700 hidden sm:block">
                  {firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-500 hidden sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-blush-200 py-1 z-50"
                  >
                    <div className="px-4 py-3 border-b border-blush-100">
                      <p className="text-sm font-medium text-charcoal-900">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-muted-500">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        router.push("/sign-in");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
