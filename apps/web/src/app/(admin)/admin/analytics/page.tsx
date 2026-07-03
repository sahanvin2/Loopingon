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

const COLORS = ["#c86482", "#dc9b91", "#827378", "#a39296", "#1e191c"];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin", "analytics", dateRange],
    queryFn: () => get<ApiResponse<any>>("/admin/analytics/stats", { period: dateRange }),
  });

  const stats = statsData?.data;

  const { data: telemetryData } = useQuery({
    queryKey: ["admin", "telemetry", dateRange],
    queryFn: () => get<ApiResponse<any>>("/analytics/dashboard", { period: dateRange }),
  });

  const telemetry = telemetryData?.data;

  const handleExport = () => {
    if (!telemetry && !stats) return;

    let csv = "Category,Metric,Value\n";
    
    // Add stats
    if (stats) {
      csv += `Stats,Revenue,${stats.revenue || 0}\n`;
      csv += `Stats,Orders,${stats.orders || 0}\n`;
      csv += `Stats,New Users,${stats.newUsers || 0}\n`;
      csv += `Stats,New Vendors,${stats.newVendors || 0}\n`;
      csv += `Stats,Avg Order Value,${stats.avgOrderValue || 0}\n`;
    }
    
    // Add Page Views
    if (telemetry?.pageVisits) {
      telemetry.pageVisits.forEach((pv: any) => {
        csv += `Page Views,${pv.date},${pv.views}\n`;
      });
    }
    
    // Add Interactions
    if (telemetry?.interactions) {
      telemetry.interactions.forEach((i: any) => {
        csv += `Interactions,${i.type},${i._count.id}\n`;
      });
    }
    
    // Add Top Pages
    if (telemetry?.topPages) {
      telemetry.topPages.forEach((p: any) => {
        csv += `Top Pages,${p.path},${p._count.id}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kandyam_analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Analytics & Telemetry</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white rounded-lg border border-accent-200 p-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${dateRange === range ? "bg-primary-600 text-white" : "text-muted-600"}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={5} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Revenue" value={formatPrice(Number(stats?.revenue || 0))} icon={DollarSign} variant="blush" />
          <StatCard title="Orders" value={stats?.orders ?? 0} icon={ShoppingBag} variant="rose" />
          <StatCard title="New Users" value={stats?.newUsers ?? 0} icon={Users} variant="default" />
          <StatCard title="New Vendors" value={stats?.newVendors ?? 0} icon={Store} variant="muted" />
          <StatCard title="Avg Order" value={formatPrice(Number(stats?.avgOrderValue || 0))} icon={TrendingUp} variant="default" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Page Views Trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry?.pageVisits || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#c86482" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        
        <ChartCard title="User Interactions">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telemetry?.interactions?.map((i: any) => ({ name: i.type, count: i._count.id })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#dc9b91" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top Pages Visited">
          <div className="h-64 overflow-y-auto">
            <table className="w-full text-sm text-left text-muted-600">
              <thead className="text-xs text-text-700 uppercase bg-surface-100">
                <tr>
                  <th className="px-4 py-2 rounded-l-lg">Path</th>
                  <th className="px-4 py-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {telemetry?.topPages?.map((page: any, idx: number) => (
                  <tr key={idx} className="border-b border-surface-200">
                    <td className="px-4 py-2 font-medium text-text-900 truncate max-w-[200px]">{page.path}</td>
                    <td className="px-4 py-2">{page._count.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Top Search Queries">
          <div className="h-64 overflow-y-auto">
            <table className="w-full text-sm text-left text-muted-600">
              <thead className="text-xs text-text-700 uppercase bg-surface-100">
                <tr>
                  <th className="px-4 py-2 rounded-l-lg">Query</th>
                  <th className="px-4 py-2">Searches</th>
                </tr>
              </thead>
              <tbody>
                {telemetry?.searchQueries?.map((search: any, idx: number) => (
                  <tr key={idx} className="border-b border-surface-200">
                    <td className="px-4 py-2 font-medium text-text-900">{search.query}</td>
                    <td className="px-4 py-2">{search._count.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
