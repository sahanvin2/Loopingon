"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import { OrderTimeline } from "@/components/order/order-timeline";
import { TrackingMap } from "@/components/order/tracking-map";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { cn, formatDate, formatPrice, copyToClipboard } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Order, ApiResponse } from "@/types";

const timelineSteps = [
  { key: "PENDING_PAYMENT", label: "Order Placed", done: true },
  { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed", done: false },
  { key: "PROCESSING", label: "Processing", done: false },
  { key: "READY_TO_SHIP", label: "Ready to Ship", done: false },
  { key: "SHIPPED", label: "Shipped", done: false },
  { key: "IN_TRANSIT", label: "In Transit", done: false },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", done: false },
  { key: "DELIVERED", label: "Delivered", done: false },
];

const statusOrder = timelineSteps.map((s) => s.key);

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => get<ApiResponse<Order>>(`/users/orders/${id}`),
  });

  const cancelMutation = useMutation({
    mutationFn: () => patch(`/users/orders/${id}/cancel`, { reason: "Customer request" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  const order = data?.data;

  const currentStepIndex = order
    ? statusOrder.indexOf(order.status)
    : 0;

  const isEligibleForReturn =
    order?.status === "DELIVERED" || order?.status === "COMPLETED";
  const canCancel =
    order?.status &&
    !["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED", "SHIPPED"].includes(order.status);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order doesn't exist or you don't have access to it."
        action={{ label: "Back to My Orders", href: "/dashboard/orders" }}
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
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-text-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
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
          <Badge
            variant={
              order.status === "DELIVERED" || order.status === "COMPLETED"
                ? "muted"
                : order.status === "CANCELLED"
                  ? "red"
                  : "amber"
            }
          >
            {ORDER_STATUS_MAP[order.status]?.label || order.status}
          </Badge>
        </div>

        <OrderTimeline
          steps={timelineSteps.map((step, i) => ({
            ...step,
            done: i <= currentStepIndex,
            completedAt: i <= currentStepIndex ? order.createdAt : undefined,
          }))}
        />
      </div>

      {order.trackingNumber && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold text-text-900 mb-4">Tracking</h2>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted-100 text-muted-600 flex items-center justify-center">
                <span className="text-xs font-bold">
                  {order.courierName?.slice(0, 2).toUpperCase() || "CT"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-600">Tracking Number</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-text-900">
                    {order.trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.trackingNumber!)}
                    className="p-1 rounded hover:bg-surface-50 transition-colors"
                    aria-label="Copy tracking number"
                  >
                    <Copy className="w-3.5 h-3.5 text-muted-500" />
                  </button>
                </div>
              </div>
            </div>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-muted-700 transition-colors"
              >
                Track on Courier Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {order.estimatedDelivery && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-surface-50 rounded-lg">
              <Clock className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-text-700">
                Estimated Delivery:{" "}
                <strong>{formatDate(order.estimatedDelivery)}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Order Items
        </h2>
        <div className="divide-y divide-surface-50">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-md border border-accent-200 overflow-hidden bg-surface-50 flex-shrink-0">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-900 truncate">
                  {item.productTitle}
                </p>
                <p className="text-xs text-muted-500">
                  Qty: {item.quantity} x {formatPrice(Number(item.price))}
                </p>
                <p className="text-[10px] text-muted-400 font-mono mt-0.5">
                  ID: {item.productId}
                </p>
              </div>
              <span className="text-sm font-semibold text-text-900">
                {formatPrice(Number(item.totalPrice))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold text-text-900 mb-4">
            Shipping Address
          </h2>
          <div className="space-y-1 text-sm text-text-700">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.district}
            </p>
            <p className="flex items-center gap-1.5 mt-1">
              <Phone className="w-3.5 h-3.5 text-muted-500" />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Payment Info
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-500">Amount</p>
            <p className="font-semibold text-text-900">
              {formatPrice(Number(order.totalAmount))}
            </p>
          </div>
          <div>
            <p className="text-muted-500">Method</p>
            <p className="font-semibold text-text-900">
              {order.paymentMethod || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-500">Transaction ID</p>
            <p className="font-mono text-xs text-text-700 truncate">
              {order.paymentId || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-500">Status</p>
            <Badge
              variant={
                order.paymentStatus === "COMPLETED" ? "muted" : "amber"
              }
              size="sm"
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/messages?order=${order.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50 transition-colors"
        >
          Contact Vendor
        </Link>

        {canCancel && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel this order?")) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {isEligibleForReturn && (
          <Link
            href={`/dashboard/orders/${order.id}/return`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Request Return
          </Link>
        )}

        {isEligibleForReturn && !order.items?.some((i) => false) && (
          <Link
            href={`/products/${order.items?.[0]?.productId || ""}#review`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-100 border border-accent-200 rounded-lg text-sm font-medium text-accent-700 hover:bg-accent-200 transition-colors"
          >
            Write a Review
          </Link>
        )}
      </div>

      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h2 className="text-lg font-semibold text-text-900 mb-4">
            Order Timeline
          </h2>
          <div className="space-y-4">
            {order.statusHistory.map((entry, i) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border-2",
                      i === 0
                        ? "bg-primary-600 border-primary-600"
                        : "bg-surface-50 border-accent-300",
                    )}
                  />
                  {i < order.statusHistory!.length - 1 && (
                    <div className="flex-1 w-0.5 bg-surface-200" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-text-900">
                    {ORDER_STATUS_MAP[entry.status]?.label || entry.status}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-muted-500 mt-0.5">
                      {entry.note}
                    </p>
                  )}
                  <p className="text-xs text-muted-400 mt-0.5">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
