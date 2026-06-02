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

  const canProcess = order?.status === "PAYMENT_CONFIRMED";
  const canReadyShip = order?.status === "PROCESSING";
  const canShip = order?.status === "READY_TO_SHIP";

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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-charcoal-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-blush-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-mono font-bold text-charcoal-900">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-muted-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant="amber">
            {ORDER_STATUS_MAP[order.status]?.label || order.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {canProcess && (
            <button
              type="button"
              onClick={() =>
                updateStatusMutation.mutate({ status: "PROCESSING" })
              }
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 bg-muted-600 text-white rounded-lg text-sm font-medium hover:bg-muted-700 disabled:opacity-50"
            >
              Mark as Processing
            </button>
          )}
          {canReadyShip && (
            <button
              type="button"
              onClick={() =>
                updateStatusMutation.mutate({ status: "READY_TO_SHIP" })
              }
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 bg-blush-500 text-white rounded-lg text-sm font-medium hover:bg-blush-600 disabled:opacity-50"
            >
              Mark as Ready to Ship
            </button>
          )}
          {(canReadyShip || canShip) && (
            <button
              type="button"
              onClick={() => setShowTrackingModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Truck className="w-4 h-4 inline mr-1" />
              Add Tracking
            </button>
          )}
          {canShip && (
            <button
              type="button"
              onClick={() =>
                updateStatusMutation.mutate({ status: "SHIPPED" })
              }
              disabled={updateStatusMutation.isPending || !order.trackingNumber}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              Mark as Shipped
            </button>
          )}
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white rounded-xl border border-blush-200 p-6">
          <h2 className="text-lg font-semibold text-charcoal-900 mb-3">
            Customer Info
          </h2>
          <div className="space-y-1 text-sm text-charcoal-700">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-blush-200 p-6">
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
          Order Items
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-blush-200">
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                Item
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                Qty
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                Price
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-50">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-3 text-sm text-charcoal-700">
                  {item.productTitle}
                </td>
                <td className="px-3 py-3 text-sm text-charcoal-700 text-right">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-sm text-charcoal-700 text-right">
                  {formatPrice(Number(item.price))}
                </td>
                <td className="px-3 py-3 text-sm font-medium text-charcoal-900 text-right">
                  {formatPrice(Number(item.totalPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-blush-200 p-6">
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
          Earnings Breakdown
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-500">Order Total</span>
            <span className="font-medium text-charcoal-900">
              {formatPrice(Number(order.totalAmount || 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-500">
              Commission ({order.commissionRate || 20}%)
            </span>
            <span className="font-medium text-red-600">
              -{formatPrice(Number(order.commissionAmount || 0))}
            </span>
          </div>
          <div className="flex justify-between border-t border-blush-200 pt-2">
            <span className="font-semibold text-charcoal-900">
              Your Earnings
            </span>
            <span className="font-semibold text-muted-600">
              {formatPrice(Number(order.vendorPayoutAmount || 0))}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/vendor/messages?order=${order.id}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-blush-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50"
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
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={() => setShowTrackingModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
                Add Tracking Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Courier
                  </label>
                  <select
                    value={trackingForm.courierName}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, courierName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm"
                  >
                    <option value="">Select courier</option>
                    <option value="Domex">Domex</option>
                    <option value="Sri Lanka Post">Sri Lanka Post</option>
                    <option value="PromptXpress">PromptXpress</option>
                    <option value="Koombiyo">Koombiyo</option>
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={trackingForm.trackingNumber}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={trackingForm.trackingUrl}
                    onChange={(e) =>
                      setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTrackingModal(false)}
                  className="flex-1 px-4 py-2.5 border border-blush-200 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addTrackingMutation.mutate(trackingForm)}
                  disabled={!trackingForm.trackingNumber || addTrackingMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
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
