"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/shared/badge";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials, getInitialsColor, cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace("/sign-in");
    return null;
  }

  if (user?.role !== "VENDOR") {
    router.replace("/dashboard");
    return null;
  }

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";
  const initials = getInitials(user?.fullName || "");
  const avatarBg = getInitialsColor(user?.fullName || "");
  const vendorStatus = user?.vendor?.status === "VERIFIED" ? "Verified" : "Pending";

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <Sidebar variant="vendor" className="hidden md:flex" />

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
              <Sidebar variant="vendor" className="w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-cream-200">
          <div className="flex items-center justify-between px-6 py-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-warm-gray-600 hover:bg-cream-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 hidden md:flex">
              <h1 className="text-lg font-semibold text-charcoal-900">
                {user?.vendor?.storeName || "My Store"}
              </h1>
              <Badge
                variant={vendorStatus === "Verified" ? "teal" : "amber"}
                size="sm"
              >
                {vendorStatus}
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
                <ChevronDown className="w-3.5 h-3.5 text-warm-gray-500 hidden sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-cream-200 py-1 z-50"
                  >
                    <div className="px-4 py-3 border-b border-cream-100">
                      <p className="text-sm font-medium text-charcoal-900">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-warm-gray-500">
                        {user?.vendor?.storeName}
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
