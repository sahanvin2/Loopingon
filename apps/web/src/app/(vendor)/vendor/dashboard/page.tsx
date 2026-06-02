"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Star,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Plus,
  Store,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { get } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import type { ApiResponse } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VendorDashboardOverview() {
  const { user } = useAuthStore();
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Vendor";

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["vendor", "dashboard-stats"],
    queryFn: () =>
      get<ApiResponse<{
        totalProducts: number;
        activeOrders: number;
        revenueThisMonth: string;
        pendingPayout: string;
        storeRating: number;
        responseRate: number;
      }>>("/vendor/dashboard/stats"),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["vendor", "recent-orders"],
    queryFn: () => get<ApiResponse<any[]>>("/vendor/orders", { limit: 5 }),
  });

  const { data: revenueData } = useQuery({
    queryKey: ["vendor", "revenue-chart"],
    queryFn: () => get<ApiResponse<any[]>>("/vendor/dashboard/revenue-chart"),
  });

  const stats = statsData?.data;
  const recentOrders = ordersData?.data || [];
  const chartData = revenueData?.data || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-charcoal-900">
          Good {greeting}, {firstName}!
        </h1>
        <p className="text-muted-600 mt-1">
          {user?.vendor?.storeName}
          {user?.vendor?.status === "VERIFIED" ? (
            <Badge variant="muted" size="sm" className="ml-2">Verified</Badge>
          ) : (
            <Badge variant="amber" size="sm" className="ml-2">Pending</Badge>
          )}
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted-200 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats?.totalProducts ?? 0}
              icon={Package}
              variant="rose"
            />
            <StatCard
              title="Active Orders"
              value={stats?.activeOrders ?? 0}
              icon={ShoppingBag}
              variant="muted"
            />
            <StatCard
              title="Revenue (Month)"
              value={formatPrice(Number(stats?.revenueThisMonth || 0))}
              icon={DollarSign}
              variant="blush"
            />
            <StatCard
              title="Pending Payout"
              value={formatPrice(Number(stats?.pendingPayout || 0))}
              icon={CreditCard}
              variant="default"
            />
            <StatCard
              title="Store Rating"
              value={`${(stats?.storeRating ?? 0).toFixed(1)} / 5`}
              icon={Star}
              variant="blush"
            />
            <StatCard
              title="Response Rate"
              value={`${stats?.responseRate ?? 0}%`}
              icon={TrendingUp}
              variant="muted"
            />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Overview"
            subtitle="Last 30 days"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#8B7D6B" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#8B7D6B" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c86482"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Quick Actions">
          <div className="space-y-2">
            {[
              { label: "Add New Product", href: "/vendor/products/new", icon: Plus },
              { label: "View All Orders", href: "/vendor/orders", icon: ShoppingBag },
              { label: "Customize Storefront", href: "/vendor/storefront", icon: Store },
              { label: "View Analytics", href: "/vendor/analytics", icon: BarChart3 },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </ChartCard>
      </div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Recent Orders
          </h2>
          <Link
            href="/vendor/orders"
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here when customers start buying your products."
          />
        ) : (
          <div className="bg-white rounded-lg border border-blush-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-200 bg-cream-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-50">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-charcoal-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-700">
                      {order.customer?.fullName || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-700">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-charcoal-900">
                      {formatPrice(Number(order.totalAmount || 0))}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="amber" size="sm">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <motion.div
        variants={item}
        className="bg-muted-50 border border-muted-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted-100 text-muted-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-800">AI Insight</p>
            <p className="text-sm text-muted-700 mt-1">
              Products with 5+ photos get 40% more sales. Your response rate is
              great — keep it up!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
