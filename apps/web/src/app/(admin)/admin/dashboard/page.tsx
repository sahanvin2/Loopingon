"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Percent,
  AlertTriangle,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Badge } from "@/components/shared/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
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

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () =>
      get<ApiResponse<{
        totalUsers: number;
        totalVendors: number;
        pendingVendors: number;
        totalProducts: number;
        totalOrders: number;
        grossRevenue: string;
        commissionEarned: string;
        activeDisputes: number;
        pendingVerifications: number;
      }>>("/admin/dashboard"),
  });

  const stats = statsData?.data;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-900">
          Admin Dashboard
        </h1>
        <p className="text-muted-600 mt-1">Platform overview and KPIs</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={item}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4"
        >
          <StatCard title="Total Users" value={stats?.totalUsers?.toLocaleString() ?? "0"} icon={Users} variant="default" />
          <StatCard title="Total Vendors" value={stats?.totalVendors ?? 0} icon={Store} variant="muted" />
          <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} variant="rose" />
          <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} variant="blush" />
          <StatCard title="Gross Revenue" value={formatPrice(Number(stats?.grossRevenue || 0))} icon={DollarSign} variant="blush" />
          <StatCard title="Commission" value={formatPrice(Number(stats?.commissionEarned || 0))} icon={Percent} variant="muted" />
          <StatCard title="Active Disputes" value={stats?.activeDisputes ?? 0} icon={AlertTriangle} variant="rose" />
          <StatCard title="Pending V." value={stats?.pendingVerifications ?? 0} icon={ShieldCheck} variant="amber" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/vendors?status=PENDING"
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
        >
          <p className="text-sm font-medium text-amber-800">
            {stats?.pendingVendors ?? 0} Pending Vendor Verifications
          </p>
        </Link>
        <Link
          href="/admin/products?status=PENDING_REVIEW"
          className="bg-muted-50 border border-muted-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
        >
          <p className="text-sm font-medium text-muted-800">
            Products Pending Review
          </p>
        </Link>
        <Link
          href="/admin/disputes"
          className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
        >
          <p className="text-sm font-medium text-red-800">
            {stats?.activeDisputes ?? 0} Open Disputes
          </p>
        </Link>
        <Link
          href="/admin/payouts?status=FAILED"
          className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
        >
          <p className="text-sm font-medium text-red-800">
            Failed Payouts
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview" subtitle="Last 30 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#c86482" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Recent Activity">
          <ActivityFeed items={[]} />
        </ChartCard>
      </div>
    </motion.div>
  );
}
