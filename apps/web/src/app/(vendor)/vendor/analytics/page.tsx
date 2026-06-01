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
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Eye,
  ShoppingBag,
  DollarSign,
  Percent,
  TrendingUp,
  CreditCard,
} from "lucide-react";

const COLORS = ["#C75B39", "#D4A843", "#2D8B7D", "#6B5E53", "#1E1E1E"];

export default function VendorAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["vendor", "analytics", dateRange],
    queryFn: () =>
      get<ApiResponse<{
        totalViews: number;
        totalOrders: number;
        totalRevenue: string;
        commissionPaid: string;
        conversionRate: number;
        avgOrderValue: string;
      }>>("/vendor/analytics/stats", { period: dateRange }),
  });

  const stats = statsData?.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-charcoal-900">Analytics</h1>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-cream-200 p-1">
          {[
            { key: "7d", label: "7d" },
            { key: "30d", label: "30d" },
            { key: "90d", label: "90d" },
            { key: "1y", label: "1Y" },
          ].map((range) => (
            <button
              key={range.key}
              type="button"
              onClick={() => setDateRange(range.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                dateRange === range.key
                  ? "bg-terracotta-600 text-white"
                  : "text-warm-gray-600 hover:text-charcoal-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Views"
            value={stats?.totalViews?.toLocaleString() ?? "0"}
            icon={Eye}
            variant="default"
          />
          <StatCard
            title="Orders"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingBag}
            variant="teal"
          />
          <StatCard
            title="Revenue"
            value={formatPrice(Number(stats?.totalRevenue || 0))}
            icon={DollarSign}
            variant="gold"
          />
          <StatCard
            title="Commission"
            value={formatPrice(Number(stats?.commissionPaid || 0))}
            icon={CreditCard}
            variant="terracotta"
          />
          <StatCard
            title="Conv. Rate"
            value={`${(stats?.conversionRate ?? 0).toFixed(1)}%`}
            icon={Percent}
            variant="teal"
          />
          <StatCard
            title="Avg Order"
            value={formatPrice(Number(stats?.avgOrderValue || 0))}
            icon={TrendingUp}
            variant="default"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Over Time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#C75B39" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Orders by Status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top Products">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#2D8B7D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium hover:bg-cream-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium hover:bg-cream-50"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </motion.div>
  );
}
