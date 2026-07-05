"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Order, ApiResponse } from "@/types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => get<ApiResponse<Order>>(`/admin/orders/${id}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (updates: { status?: string; paymentStatus?: string; note?: string }) =>
      patch(`/admin/orders/${id}/status`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "order", id] });
    },
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
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-mono font-bold text-text-900">{order.orderNumber}</h1>
            <p className="text-sm text-muted-500">Placed: {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={order.status}
              onChange={(e) => updateStatusMutation.mutate({ status: e.target.value })}
              disabled={updateStatusMutation.isPending}
              className="text-sm border-accent-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-surface-50 py-1.5 pl-3 pr-8"
            >
              {Object.entries(ORDER_STATUS_MAP).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={order.paymentStatus}
              onChange={(e) => updateStatusMutation.mutate({ paymentStatus: e.target.value })}
              disabled={updateStatusMutation.isPending}
              className="text-sm border-accent-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-surface-50 py-1.5 pl-3 pr-8"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-500">Customer</p><p className="font-medium">{order.customer?.fullName || "—"}</p></div>
          <div><p className="text-muted-500">Vendor</p><p className="font-medium">{order.vendor?.storeName || "—"}</p></div>
          <div><p className="text-muted-500">Total</p><p className="font-medium">{formatPrice(Number(order.totalAmount))}</p></div>
          <div><p className="text-muted-500">Commission</p><p className="font-medium text-red-600">{formatPrice(Number(order.commissionAmount))}</p></div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold text-text-900 mb-3">
            Customer Info
          </h2>
          <div className="space-y-1 text-sm text-text-700">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
            <p className="pt-2"><span className="font-semibold text-text-900">Email:</span> {order.customer?.email || "N/A"}</p>
            <p><span className="font-semibold text-text-900">Contact 1:</span> {order.shippingAddress.phone}</p>
            {order.contactNumberTwo && <p><span className="font-semibold text-text-900">Contact 2:</span> {order.contactNumberTwo}</p>}
            {order.facebookPage && <p><span className="font-semibold text-text-900">Facebook Page:</span> <a href={order.facebookPage.startsWith('http') ? order.facebookPage : `https://${order.facebookPage}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{order.facebookPage}</a></p>}
            {order.estimatedDelivery && <p><span className="font-semibold text-text-900">Due Date:</span> {formatDate(order.estimatedDelivery)}</p>}
            <p><span className="font-semibold text-text-900">Payment Method:</span> {order.paymentMethod || "COD"}</p>
          </div>
        </div>
      )}

      {order.orderNote && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Order Note</h2>
          <p className="text-sm text-amber-800 whitespace-pre-wrap">{order.orderNote}</p>
        </div>
      )}

      {order.items && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-left py-2">Product ID</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-accent-100">
                  <td className="py-2">{item.productTitle}</td>
                  <td className="py-2 text-xs text-muted-500">{item.productId}</td>
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
