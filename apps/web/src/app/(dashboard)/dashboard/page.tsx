"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Heart,
  Crown,
  Share2,
  ChevronRight,
  Copy,
  Users,
  Gem,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderCard } from "@/components/order/order-card";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { get } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import type { Order, Product, Competition, ApiResponse, LoyaltyAccount } from "@/types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const tierColors: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-700",
  Silver: "bg-text-100 text-text-700",
  Gold: "bg-accent-100 text-accent-700",
  Platinum: "bg-purple-100 text-purple-700",
};

const quickLinks = [
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Addresses", href: "/dashboard/addresses", icon: ShoppingBag },
  { label: "Reviews", href: "/dashboard/reviews", icon: ShoppingBag },
  { label: "Messages", href: "/dashboard/messages", icon: ShoppingBag },
  { label: "Loyalty", href: "/dashboard/loyalty", icon: Crown },
  { label: "Referrals", href: "/dashboard/referrals", icon: Share2 },
  { label: "Settings", href: "/dashboard/settings", icon: ShoppingBag },
];

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["dashboard", "orders"],
    queryFn: () => get<ApiResponse<Order[]>>("/users/orders", { limit: 3 }),
  });

  const { data: wishlistData } = useQuery({
    queryKey: ["dashboard", "wishlist-count"],
    queryFn: () => get<ApiResponse<{ count: number }>>("/wishlist/count"),
  });

  const { data: loyaltyData } = useQuery({
    queryKey: ["dashboard", "loyalty"],
    queryFn: () => get<ApiResponse<LoyaltyAccount>>("/loyalty"),
  });

  const { data: referralsData } = useQuery({
    queryKey: ["dashboard", "referral-summary"],
    queryFn: () => get<ApiResponse<{ totalReferrals: number; totalEarnings: string }>>("/referrals/summary"),
  });

  const { data: recommendedData } = useQuery({
    queryKey: ["dashboard", "recommended"],
    queryFn: () => get<ApiResponse<Product[]>>("/products/recommended"),
  });

  const { data: competitionsData } = useQuery({
    queryKey: ["dashboard", "competitions"],
    queryFn: () => get<ApiResponse<Competition[]>>("/competitions", { status: "ACTIVE", limit: 3 }),
  });

  const { data: referralCodeData } = useQuery({
    queryKey: ["dashboard", "referral-code"],
    queryFn: () => get<ApiResponse<{ code: string }>>("/referrals/code"),
  });

  const orders = ordersData?.data || [];
  const loyalty = loyaltyData?.data;
  const tier = loyalty?.tier || "Bronze";
  const referrals = referralsData?.data || { totalReferrals: 0, totalEarnings: "0" };

  const handleCopyReferral = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // silently fail
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-900">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-600 mt-1">Here&apos;s what&apos;s happening with your account.</p>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          variant="rose"
        />
        <StatCard
          title="Wishlist Items"
          value={wishlistData?.data?.count || 0}
          icon={Heart}
          variant="blush"
        />
        <StatCard
          title="Loyalty Points"
          value={
            <div className="flex items-center gap-2">
              {loyalty?.availablePoints ?? 0}
              <Badge
                variant={tier === "blush" || tier === "Platinum" ? "blush" : "gray"}
                size="sm"
                className={tierColors[loyalty?.tier || "Bronze"]}
              >
                {tier}
              </Badge>
            </div>
          }
          icon={Crown}
          variant="muted"
        />
        <StatCard
          title="Active Referrals"
          value={
            <div className="flex items-center gap-2">
              {referrals.totalReferrals}
              <span className="text-sm text-muted-500 font-normal">
                {formatPrice(Number(referrals.totalEarnings))}
              </span>
            </div>
          }
          icon={Share2}
          variant="default"
        />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-900">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All Orders
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {ordersLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Start exploring handcrafted treasures and place your first order!"
            action={{ label: "Browse Products", href: "/shop" }}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </motion.div>

      {recommendedData?.data && recommendedData.data.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-900">
              Recommended for You
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {recommendedData.data.map((product) => (
              <div key={product.id} className="min-w-[220px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {competitionsData?.data && competitionsData.data.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-900">
              Active Competitions
            </h2>
            <Link
              href="/competitions"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitionsData.data.map((comp) => (
              <Link
                key={comp.id}
                href={`/competitions/${comp.slug}`}
                className="block bg-white rounded-lg border border-accent-200 p-5 hover:shadow-soft transition-shadow"
              >
                <h3 className="font-semibold text-text-900">{comp.title}</h3>
                <p className="text-sm text-muted-600 mt-1 line-clamp-2">
                  {comp.prizeDescription}
                </p>
                <Badge variant="muted" size="sm" className="mt-3">
                  Active
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {referralCodeData?.data?.code && (
        <motion.div
          variants={item}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Share & Earn Rewards</h3>
              <p className="text-sm text-primary-100 mt-1">
                Refer friends and earn rewards when they make their first purchase
              </p>
              <div className="flex items-center gap-3 mt-3">
                <code className="px-4 py-2 bg-white/20 rounded-lg text-lg font-mono tracking-wider">
                  {referralCodeData.data.code}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopyReferral(referralCodeData.data.code)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Copy referral code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-primary-100 mt-2">
                Total Earnings: {formatPrice(Number(referrals.totalEarnings))}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = `https://wa.me/?text=Join%20Kandyam%20using%20my%20referral%20code:%20${referralCodeData.data.code}`;
                  window.open(url, "_blank");
                }}
                className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = `https://www.facebook.com/sharer/sharer.php?u=https://kandyam.com`;
                  window.open(url, "_blank");
                }}
                className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Facebook
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-accent-200 hover:border-primary-200 hover:shadow-soft transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-muted-100 text-muted-600 flex items-center justify-center">
                <link.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-text-700 group-hover:text-primary-600">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
