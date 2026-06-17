"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Download, Filter, Search, Calendar, Loader2,
  TrendingUp, ShoppingBag, RotateCcw, DollarSign,
} from "lucide-react";
import { get } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  commissionAmount: number;
  vendorPayoutAmount: number;
  paymentMethod: string;
  customer: { id: string; fullName: string; email?: string };
  vendor: { id: string; storeName: string };
}

interface PaginatedData {
  data: Order[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean };
}

function exportToExcel(orders: Order[], filename: string) {
  // Sheet 1: All Orders
  const allOrdersRows = orders.map((o) => ({
    "Order #": o.orderNumber,
    "Date": new Date(o.createdAt).toLocaleDateString(),
    "Customer": o.customer.fullName,
    "Vendor": o.vendor.storeName,
    "Status": o.status,
    "Payment": o.paymentStatus || "N/A",
    "Subtotal": o.subtotal,
    "Shipping": o.shippingCost,
    "Tax": o.taxAmount,
    "Discount": o.discountAmount,
    "Commission": o.commissionAmount,
    "Total": o.totalAmount,
  }));

  // Sheet 2: Returns & Refunds
  const returnedOrders = orders.filter(o => ["CANCELLED", "REFUNDED", "RETURN_REQUESTED"].includes(o.status));
  const returnsRows = returnedOrders.map((o) => ({
    "Order #": o.orderNumber,
    "Date": new Date(o.createdAt).toLocaleDateString(),
    "Customer": o.customer.fullName,
    "Vendor": o.vendor.storeName,
    "Status": o.status,
    "Refund Amount": o.totalAmount,
  }));

  // Sheet 3: Vendor Payouts
  const payoutRows = orders.map((o) => ({
    "Order #": o.orderNumber,
    "Date": new Date(o.createdAt).toLocaleDateString(),
    "Vendor": o.vendor.storeName,
    "Total Order Value": o.totalAmount,
    "Platform Commission": o.commissionAmount,
    "Net Vendor Payout": o.vendorPayoutAmount,
  }));

  const wb = XLSX.utils.book_new();
  
  const ws1 = XLSX.utils.json_to_sheet(allOrdersRows);
  XLSX.utils.book_append_sheet(wb, ws1, "All Orders");
  
  const ws2 = XLSX.utils.json_to_sheet(returnsRows.length ? returnsRows : [{"Message": "No returns found"}]);
  XLSX.utils.book_append_sheet(wb, ws2, "Returns & Refunds");
  
  const ws3 = XLSX.utils.json_to_sheet(payoutRows);
  XLSX.utils.book_append_sheet(wb, ws3, "Vendor Payouts");

  XLSX.writeFile(wb, `${filename}.xlsx`);
  toast.success(`Exported ${orders.length} records to Excel`);
}

export default function SalesLedgerPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin", "orders", page, status, search],
    queryFn: () => get<PaginatedData>("/admin/orders", {
      page, limit,
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
    }),
    staleTime: 15000,
  });

  const { data: allData } = useQuery({
    queryKey: ["admin", "orders", "export", status, search],
    queryFn: () => get<PaginatedData>("/admin/orders", {
      page: 1, limit: 1000,
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
    }),
    staleTime: 60000,
    enabled: false, // only fetch on export
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const summary = useMemo(() => {
    return orders.reduce((acc, o) => ({
      totalSales: acc.totalSales + o.totalAmount,
      totalCommissions: acc.totalCommissions + (o.commissionAmount || 0),
      totalVendorPayouts: acc.totalVendorPayouts + (o.vendorPayoutAmount || 0),
      count: acc.count + 1,
    }), { totalSales: 0, totalCommissions: 0, totalVendorPayouts: 0, count: 0 });
  }, [orders]);

  const handleExport = async () => {
    try {
      const res = await get<PaginatedData>("/admin/orders", {
        page: 1, limit: 2000,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      });
      if (res.data.length > 0) {
        exportToExcel(res.data, `sales-ledger-${new Date().toISOString().slice(0, 10)}`);
      } else {
        toast.error("No data to export");
      }
    } catch {
      toast.error("Failed to export data");
    }
  };

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-indigo-100 text-indigo-700",
    CONFIRMED: "bg-cyan-100 text-cyan-700",
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
    PAYMENT_CONFIRMED: "bg-lime-100 text-lime-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-orange-100 text-orange-700",
    RETURN_REQUESTED: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-900">Sales & Returns Ledger</h1>
          <p className="text-sm text-muted-500 mt-1">Track all sales, returns, commissions, and payouts</p>
        </div>
        <button onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export to Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: `Rs. ${formatPrice(summary.totalSales)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Commissions", value: `Rs. ${formatPrice(summary.totalCommissions)}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Vendor Payouts", value: `Rs. ${formatPrice(summary.totalVendorPayouts)}`, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Orders", value: summary.count, icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-surface-200 p-4 shadow-soft-sm">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-2", card.bg)}>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </div>
            <p className="text-xl font-bold text-text-900">{card.value}</p>
            <p className="text-xs text-muted-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders..." className="pl-10 pr-4 py-2 rounded-lg border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-56"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-surface-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
          <option value="RETURN_REQUESTED">Return Requested</option>
        </select>
        {isFetching && <Loader2 className="w-4 h-4 animate-spin text-muted-400" />}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-600">Order #</th>
                <th className="px-4 py-3 font-medium text-muted-600">Date</th>
                <th className="px-4 py-3 font-medium text-muted-600">Customer</th>
                <th className="px-4 py-3 font-medium text-muted-600">Vendor</th>
                <th className="px-4 py-3 font-medium text-muted-600">Total</th>
                <th className="px-4 py-3 font-medium text-muted-600">Commission</th>
                <th className="px-4 py-3 font-medium text-muted-600">Vendor Pay</th>
                <th className="px-4 py-3 font-medium text-muted-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-primary-600">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-text-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-text-600">{order.customer.fullName}</td>
                  <td className="px-4 py-3 text-text-600">{order.vendor.storeName}</td>
                  <td className="px-4 py-3 font-medium">Rs. {formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-green-600">Rs. {formatPrice(order.commissionAmount || 0)}</td>
                  <td className="px-4 py-3 text-purple-600">Rs. {formatPrice(order.vendorPayoutAmount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[order.status] || "bg-gray-100 text-gray-700")}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !isLoading && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-500">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-surface-200 flex items-center justify-between">
            <span className="text-sm text-muted-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 rounded border border-surface-300 text-sm disabled:opacity-40">Prev</button>
              <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.hasNext}
                className="px-3 py-1 rounded border border-surface-300 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
