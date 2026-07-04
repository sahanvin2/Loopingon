"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  Truck,
  Send,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Order, ApiResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";

export default function VendorOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    courierName: "",
    trackingNumber: "",
    trackingUrl: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "order", id],
    queryFn: () => get<ApiResponse<Order>>(`/vendor/orders/${id}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      patch(`/vendor/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "order", id] });
    },
  });

  const addTrackingMutation = useMutation({
    mutationFn: (data: typeof trackingForm) =>
      patch(`/vendor/orders/${id}/tracking`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "order", id] });
      setShowTrackingModal(false);
    },
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order doesn't exist."
        action={{ label: "Back to Orders", href: "/vendor/orders" }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <Link
        href="/vendor/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-text-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-mono font-bold text-text-900">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-muted-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
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
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowTrackingModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Truck className="w-4 h-4 inline mr-1" />
            Update Tracking Info
          </button>
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
      {order.customerNotes && !order.orderNote && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Customer Notes</h2>
          <p className="text-sm text-amber-800 whitespace-pre-wrap">{order.customerNotes}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Order Items
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent-200">
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Product</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Product ID</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Qty</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Retail Price</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-3 text-sm text-text-700 font-medium">
                  {item.productTitle}
                </td>
                <td className="px-3 py-3 text-sm text-muted-500 font-mono text-xs">
                  {item.productId}
                </td>
                <td className="px-3 py-3 text-sm text-text-700 text-right">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-sm text-text-700 text-right">
                  {formatPrice(Number(item.price))}
                </td>
                <td className="px-3 py-3 text-sm font-medium text-text-900 text-right">
                  {formatPrice(Number(item.totalPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Earnings Breakdown
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-500">Retail Sale Amount</span>
            <span className="font-medium text-text-900">
              {formatPrice(Number(order.subtotal || 0))}
            </span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-500">Discounted Amount</span>
              <span className="font-medium text-red-600">
                -{formatPrice(Number(order.discountAmount))}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-500">Order Total (with shipping/tax)</span>
            <span className="font-medium text-text-900">
              {formatPrice(Number(order.totalAmount || 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-500">
              Platform Commission ({order.commissionRate || 20}%)
            </span>
            <span className="font-medium text-red-600">
              -{formatPrice(Number(order.commissionAmount || 0))}
            </span>
          </div>
          <div className="flex justify-between border-t border-accent-200 pt-2 bg-green-50/50 -mx-6 px-6 pb-2 rounded-b-xl mt-2">
            <span className="font-bold text-green-800">
              Estimated Profit
            </span>
            <span className="font-bold text-green-700 text-lg">
              {formatPrice(Number(order.vendorPayoutAmount || 0))}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/vendor/messages?order=${order.id}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50"
      >
        <MessageSquare className="w-4 h-4" />
        Message Customer
      </Link>

      <AnimatePresence>
        {showTrackingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-text-900/50"
              onClick={() => setShowTrackingModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-lg font-semibold text-text-900 mb-4">
                Add Tracking Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Courier
                  </label>
                  <CustomSelect
                    value={trackingForm.courierName}
                    onChange={(val: string) =>
                      setTrackingForm({ ...trackingForm, courierName: val })
                    }
                    options={[
                      { value: "Domex", label: "Domex" },
                      { value: "Sri Lanka Post", label: "Sri Lanka Post" },
                      { value: "PromptXpress", label: "PromptXpress" },
                      { value: "Koombiyo", label: "Koombiyo" },
                      { value: "DHL", label: "DHL" },
                      { value: "FedEx", label: "FedEx" },
                    ]}
                    placeholder="Select courier"
                    className="border-accent-200 focus:ring-2 focus:ring-primary-500 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={trackingForm.trackingNumber}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={trackingForm.trackingUrl}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTrackingModal(false)}
                  className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addTrackingMutation.mutate(trackingForm)}
                  disabled={!trackingForm.trackingNumber || addTrackingMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {addTrackingMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
