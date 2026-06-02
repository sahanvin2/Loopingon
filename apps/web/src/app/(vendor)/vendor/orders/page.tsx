"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get, patch } from "@/lib/api-client";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Order, PaginatedResponse } from "@/types";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "NEW", label: "New" },
  { key: "PROCESSING", label: "Processing" },
  { key: "READY_TO_SHIP", label: "Ready to Ship" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function VendorOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor", "orders", activeTab, search, page],
    queryFn: () =>
      get<PaginatedResponse<Order>>("/vendor/orders", {
        page,
        limit: 15,
        search: search || undefined,
        status: activeTab !== "all" ? activeTab : undefined,
      }),
  });

  const markReadyMutation = useMutation({
    mutationFn: (ids: string[]) =>
      patch("/vendor/orders/bulk-status", {
        orderIds: ids,
        status: "READY_TO_SHIP",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "orders"] });
      setSelectedRows(new Set());
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-1 bg-white rounded-lg border border-blush-200 p-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
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
            className="w-full pl-10 pr-4 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted-50 border border-muted-200 rounded-lg">
          <span className="text-sm font-medium text-muted-700">
            {selectedRows.size} selected
          </span>
          <button
            type="button"
            onClick={() => markReadyMutation.mutate(Array.from(selectedRows))}
            disabled={markReadyMutation.isPending}
            className="px-3 py-1 text-xs font-medium bg-muted-600 text-white rounded-md hover:bg-muted-700 disabled:opacity-50"
          >
            Mark as Ready to Ship
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : isError ? (
        <EmptyState
          title="Error loading orders"
          description="Something went wrong."
        />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" description="No orders match your filters." />
      ) : (
        <DataTable
          columns={[
            {
              header: "Order #",
              accessor: (row: any) => (
                <span className="font-mono text-sm">{row.orderNumber}</span>
              ),
            },
            {
              header: "Date",
              accessor: (row: any) => formatDate(row.createdAt),
            },
            {
              header: "Customer",
              accessor: (row: any) =>
                row.customer?.fullName || row.shippingAddress?.fullName || "—",
            },
            {
              header: "Items",
              accessor: (row: any) => row.items?.length || 0,
            },
            {
              header: "Total",
              accessor: (row: any) => formatPrice(Number(row.totalAmount || 0)),
            },
            {
              header: "Commission",
              accessor: (row: any) => formatPrice(Number(row.commissionAmount || 0)),
            },
            {
              header: "Your Earnings",
              accessor: (row: any) =>
                formatPrice(Number(row.vendorPayoutAmount || 0)),
            },
            {
              header: "Status",
              accessor: (row: any) => (
                <Badge
                  variant={
                    row.status === "DELIVERED"
                      ? "muted"
                      : row.status === "CANCELLED"
                        ? "red"
                        : "amber"
                  }
                  size="sm"
                >
                  {ORDER_STATUS_MAP[row.status]?.label || row.status}
                </Badge>
              ),
            },
            {
              header: "Action",
              accessor: (row: any) => (
                <Link
                  href={`/vendor/orders/${row.id}`}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  View
                </Link>
              ),
            },
          ]}
          data={orders as any}
          showSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => (row as any).id}
        />
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
