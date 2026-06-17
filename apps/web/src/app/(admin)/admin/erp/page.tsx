"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, ShoppingBag, TrendingUp, DollarSign,
  Package, RotateCcw, Users, Download, Calendar,
  ArrowUp, ArrowDown, Loader2,
} from "lucide-react";
import { get } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalRefunds: number;
  returnedOrdersCount: number;
  pendingVendors: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    customer: { fullName: string };
    vendor: { storeName: string };
  }>;
  ordersToday: number;
  revenueToday: number;
}

export default function ErpDashboardPage() {
  const [dateRange, setDateRange] = useState("today");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => get<{ data: DashboardStats }>("/admin/dashboard"),
    refetchInterval: 30000,
  });

  const d = stats?.data;

  const cards = [
    { label: "Today's Orders", value: d?.ordersToday || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "Today's Revenue", value: `Rs. ${formatPrice(d?.revenueToday || 0)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50", trend: "+8%" },
    { label: "Total Orders", value: d?.totalOrders || 0, icon: Package, color: "text-purple-600", bg: "bg-purple-50", trend: "" },
    { label: "Total Revenue", value: `Rs. ${formatPrice(d?.totalRevenue || 0)}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "" },
    { label: "Refunds & Returns", value: `Rs. ${formatPrice(d?.totalRefunds || 0)} (${d?.returnedOrdersCount || 0})`, icon: RotateCcw, color: "text-red-600", bg: "bg-red-50", trend: "" },
    { label: "Products", value: d?.totalProducts || 0, icon: BarChart3, color: "text-rose-600", bg: "bg-rose-50", trend: "" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-900">ERP Dashboard</h1>
          <p className="text-sm text-muted-500 mt-1">Real-time sales, orders, and financial overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/erp/sales" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" /> Export Excel
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-surface-200 p-4 shadow-soft-sm hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
              {card.trend && (
                <span className={cn("text-xs font-medium", card.trend.startsWith("+") ? "text-green-600" : "text-red-600")}>
                  {card.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-text-900">{card.value}</p>
            <p className="text-xs text-muted-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-soft-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-text-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 text-left">
              <tr>
                <th className="px-6 py-3 font-medium text-muted-600">Order</th>
                <th className="px-6 py-3 font-medium text-muted-600">Customer</th>
                <th className="px-6 py-3 font-medium text-muted-600">Vendor</th>
                <th className="px-6 py-3 font-medium text-muted-600">Amount</th>
                <th className="px-6 py-3 font-medium text-muted-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {d?.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-text-800">{order.orderNumber}</td>
                  <td className="px-6 py-3 text-text-600">{order.customer.fullName}</td>
                  <td className="px-6 py-3 text-text-600">{order.vendor.storeName}</td>
                  <td className="px-6 py-3 font-medium">Rs. {formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                      order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    )}>{order.status}</span>
                  </td>
                </tr>
              ))}
              {(!d?.recentOrders || d.recentOrders.length === 0) && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-500">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/erp/sales" className="bg-white rounded-xl border border-surface-200 p-6 shadow-soft-sm hover:shadow-soft transition-shadow group">
          <ShoppingBag className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-serif text-lg font-bold text-text-900 group-hover:text-primary-600 transition-colors">Sales Ledger</h3>
          <p className="text-sm text-muted-500 mt-1">Track all sales, returns, and transactions</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl border border-surface-200 p-6 shadow-soft-sm hover:shadow-soft transition-shadow group">
          <Package className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-serif text-lg font-bold text-text-900 group-hover:text-primary-600 transition-colors">Order Management</h3>
          <p className="text-sm text-muted-500 mt-1">View, update, and manage all orders</p>
        </Link>
        <Link href="/admin/payouts" className="bg-white rounded-xl border border-surface-200 p-6 shadow-soft-sm hover:shadow-soft transition-shadow group">
          <DollarSign className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-serif text-lg font-bold text-text-900 group-hover:text-primary-600 transition-colors">Vendor Payouts</h3>
          <p className="text-sm text-muted-500 mt-1">Process and track vendor payouts</p>
        </Link>
      </div>
    </div>
  );
}
