"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";
import { Badge } from "@/components/shared/badge";

interface OrderCardProps {
  order: Order;
  className?: string;
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: "rose" | "blush" | "muted" | "green" | "red" | "amber" | "gray" | "outline" }> = {
    PENDING_PAYMENT: { label: "Pending Payment", variant: "amber" },
    PAYMENT_CONFIRMED: { label: "Paid", variant: "muted" },
    PROCESSING: { label: "Processing", variant: "blush" },
    READY_TO_SHIP: { label: "Ready to Ship", variant: "blush" },
    SHIPPED: { label: "Shipped", variant: "muted" },
    IN_TRANSIT: { label: "In Transit", variant: "muted" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "muted" },
    DELIVERED: { label: "Delivered", variant: "green" },
    CANCELLED: { label: "Cancelled", variant: "red" },
    RETURN_REQUESTED: { label: "Return Requested", variant: "gray" },
    RETURNED: { label: "Returned", variant: "gray" },
    REFUNDED: { label: "Refunded", variant: "gray" },
    COMPLETED: { label: "Completed", variant: "green" },
  };
  return map[status] || { label: status, variant: "gray" as const };
}

export function OrderCard({ order, className }: OrderCardProps) {
  const status = getStatusBadge(order.status);
  const total = parseFloat(order.totalAmount);
  const items = order.items || [];
  const thumbnails = items.slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={cn(
        "bg-white rounded-lg border border-blush-200 shadow-sm overflow-hidden",
        "hover:shadow-soft transition-shadow",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-charcoal-900">
              Order #{order.orderNumber}
            </p>
            <p className="text-xs text-muted-500 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center">
            {thumbnails.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  "w-10 h-10 rounded-md border-2 border-white bg-muted-100 overflow-hidden",
                  i > 0 && "-ml-2",
                )}
              >
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-500">
                    N/A
                  </div>
                )}
              </div>
            ))}
            {items.length > 3 && (
              <div className="w-10 h-10 rounded-md border-2 border-white bg-muted-200 flex items-center justify-center text-xs text-muted-600 font-medium -ml-2">
                +{items.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-500">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-charcoal-900">
            {formatPrice(total)}
          </span>
          <Link
            href={`/dashboard/orders/${order.id}`}
            className={cn(
              "text-sm font-medium text-rose-600 hover:text-rose-700",
              "hover:underline transition-colors",
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
