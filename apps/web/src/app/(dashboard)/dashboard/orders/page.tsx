"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronRight, ShoppingBag } from "lucide-react";
import { OrderCard } from "@/components/order/order-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Order, PaginatedResponse } from "@/types";
import { ORDER_STATUS_MAP } from "@/lib/constants";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active", statuses: ["PROCESSING", "SHIPPED", "IN_TRANSIT"] },
  { key: "delivered", label: "Delivered", statuses: ["DELIVERED", "COMPLETED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const statusParam = activeTab !== "all"
    ? tabs.find((t) => t.key === activeTab)?.statuses?.join(",")
    : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", activeTab, search, page],
    queryFn: () =>
      get<PaginatedResponse<Order>>("/users/orders", {
        page,
        limit: 10,
        search: search || undefined,
        status: statusParam,
      }),
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-charcoal-900">My Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-1 bg-white rounded-lg border border-blush-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === tab.key
                  ? "bg-rose-600 text-white"
                  : "text-muted-600 hover:text-charcoal-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : isError ? (
        <EmptyState
          title="Error loading orders"
          description="Something went wrong. Please try again later."
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="No orders found"
          description={
            activeTab === "all"
              ? "You haven't placed any orders yet. Start exploring handcrafted treasures!"
              : `No ${activeTab} orders to show.`
          }
          action={{ label: "Browse Products", href: "/shop" }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-blush-200 p-4 hover:shadow-soft transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-mono font-semibold text-charcoal-900">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-muted-500 ml-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Badge
                  variant={
                    order.status === "DELIVERED" || order.status === "COMPLETED"
                      ? "muted"
                      : order.status === "CANCELLED"
                        ? "red"
                        : "amber"
                  }
                  size="sm"
                >
                  {ORDER_STATUS_MAP[order.status]?.label || order.status}
                </Badge>
              </div>

              {order.items && (
                <div className="flex items-center gap-2 mt-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 rounded-md border border-blush-200 overflow-hidden bg-cream-50"
                      style={{ marginLeft: i > 0 ? -12 : 0 }}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-400 text-xs">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  <span className="text-sm text-muted-600">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-semibold text-charcoal-900">
                  {Number(order.totalAmount).toLocaleString("en-LK", {
                    style: "currency",
                    currency: "LKR",
                  })}
                </span>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                >
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </motion.div>
  );
}
