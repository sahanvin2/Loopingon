"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import type { ApiResponse } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, Users, Store, TrendingUp } from "lucide-react";

const COLORS = ["#C75B39", "#D4A843", "#2D8B7D", "#6B5E53", "#1E1E1E"];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin", "analytics", dateRange],
    queryFn: () => get<ApiResponse<any>>("/admin/analytics/stats", { period: dateRange }),
  });

  const stats = statsData?.data;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white rounded-lg border border-cream-200 p-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${dateRange === range ? "bg-terracotta-600 text-white" : "text-warm-gray-600"}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={5} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Revenue" value={formatPrice(Number(stats?.revenue || 0))} icon={DollarSign} variant="gold" />
          <StatCard title="Orders" value={stats?.orders ?? 0} icon={ShoppingBag} variant="terracotta" />
          <StatCard title="New Users" value={stats?.newUsers ?? 0} icon={Users} variant="default" />
          <StatCard title="New Vendors" value={stats?.newVendors ?? 0} icon={Store} variant="teal" />
          <StatCard title="Avg Order" value={formatPrice(Number(stats?.avgOrderValue || 0))} icon={TrendingUp} variant="default" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#C75B39" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Orders by Status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={[]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>{COLORS.map((c, i) => <Cell key={i} fill={c} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
