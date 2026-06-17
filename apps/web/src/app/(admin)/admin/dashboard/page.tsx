"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users, Store, Package, ShoppingBag, DollarSign,
  Percent, AlertTriangle, ShieldCheck, TrendingUp, Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => get<{ data: any }>("/admin/dashboard"),
    refetchInterval: 30000,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => get<{ data: any }>("/admin/analytics"),
    staleTime: 5 * 60 * 1000,
  });

  const stats = statsData?.data;
  const analytics = analyticsData?.data;

  // Build chart data from analytics
  const chartData = analytics?.revenueByDay || analytics?.revenueTrend || [];

  // Activity from recent orders
  const recentOrders = stats?.recentOrders || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-900">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-900">Admin Dashboard</h1>
          <p className="text-muted-600 mt-1">Platform overview and KPIs</p>
        </div>
        <Link href="/admin/erp" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
          <TrendingUp className="w-4 h-4" /> ERP Analytics
        </Link>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard title="Total Users" value={stats?.totalUsers?.toLocaleString() ?? "0"} icon={Users} variant="default" />
        <StatCard title="Total Vendors" value={stats?.totalVendors ?? 0} icon={Store} variant="muted" />
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} variant="rose" />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} variant="blush" />
        <StatCard title="Total Revenue" value={`Rs. ${formatPrice(Number(stats?.totalRevenue || 0))}`} icon={DollarSign} variant="blush" />
        <StatCard title="Today's Revenue" value={`Rs. ${formatPrice(Number(stats?.revenueToday || 0))}`} icon={TrendingUp} variant="muted" />
        <StatCard title="Today's Orders" value={stats?.ordersToday ?? 0} icon={ShoppingBag} variant="amber" />
        <StatCard title="Pending Vendors" value={stats?.pendingVendors ?? 0} icon={ShieldCheck} variant="rose" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLink href="/admin/vendors?status=PENDING" count={stats?.pendingVendors} label="Pending Vendor Verifications" color="amber" />
        <QuickLink href="/admin/products?status=PENDING_REVIEW" label="Products Pending Review" color="muted" />
        <QuickLink href="/admin/disputes" count={stats?.activeDisputes} label="Open Disputes" color="red" />
        <QuickLink href="/admin/erp/sales" label="Sales Ledger & Returns" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview" subtitle={chartData.length > 0 ? "Last 30 days" : "Start making sales to see data"}>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#c86482" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-500 text-sm">
                Revenue data will appear as sales are made
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Recent Orders">
          <div className="max-h-64 overflow-y-auto">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {recentOrders.map((order: any) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-2 py-3 hover:bg-surface-50 transition-colors rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-800">{order.orderNumber}</p>
                      <p className="text-xs text-muted-500">{order.customer?.fullName} · {order.vendor?.storeName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Rs. {formatPrice(order.totalAmount)}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                        order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      )}>{order.status?.replace(/_/g, " ")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-500 text-sm py-8">
                No recent orders
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}

function QuickLink({ href, count, label, color }: { href: string; count?: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
    muted: "bg-muted-50 border-muted-200 text-muted-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <Link href={href} className={cn("border rounded-lg p-4 hover:shadow-soft transition-shadow", colors[color] || colors.muted)}>
      <p className="text-sm font-medium">{count !== undefined ? `${count} ${label}` : label}</p>
    </Link>
  );
}
