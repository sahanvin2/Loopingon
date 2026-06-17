"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Order, ApiResponse } from "@/types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => get<ApiResponse<Order>>(`/admin/orders/${id}`),
  });

  const order = data?.data;

  if (isLoading) return <LoadingSkeleton variant="detail" />;
  if (!order) return <EmptyState title="Order not found" action={{ label: "Back", href: "/admin/orders" }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-text-700">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <Link 
          href={`/admin/orders/${order.id}/invoice`} 
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-accent-200 rounded-lg text-sm font-medium hover:bg-surface-50 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-xl font-mono font-bold text-text-900">{order.orderNumber}</h1>
            <p className="text-sm text-muted-500">Placed: {formatDate(order.createdAt)}</p>
          </div>
          <Badge variant="amber">{ORDER_STATUS_MAP[order.status]?.label || order.status}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-500">Customer</p><p className="font-medium">{order.customer?.fullName || "—"}</p></div>
          <div><p className="text-muted-500">Vendor</p><p className="font-medium">{order.vendor?.storeName || "—"}</p></div>
          <div><p className="text-muted-500">Total</p><p className="font-medium">{formatPrice(Number(order.totalAmount))}</p></div>
          <div><p className="text-muted-500">Commission</p><p className="font-medium text-red-600">{formatPrice(Number(order.commissionAmount))}</p></div>
        </div>
      </div>

      {order.items && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-accent-100">
                  <td className="py-2">{item.productTitle}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatPrice(Number(item.price))}</td>
                  <td className="text-right py-2 font-medium">{formatPrice(Number(item.totalPrice))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {order.statusHistory && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
          <div className="space-y-3">
            {order.statusHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                <span className="font-medium">{ORDER_STATUS_MAP[entry.status]?.label || entry.status}</span>
                <span className="text-xs text-muted-500">{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
