"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get, patch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import { PRODUCT_STATUS_MAP } from "@/lib/constants";
import type { Product, PaginatedResponse } from "@/types";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "PENDING_REVIEW", label: "Pending Review" },
  { key: "PUBLISHED", label: "Published" },
  { key: "FLAGGED", label: "Flagged" },
];

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products", search, status, page],
    queryFn: () =>
      get<PaginatedResponse<Product>>("/admin/products", {
        page,
        limit: 20,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
      }),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: (ids: string[]) =>
      patch("/admin/products/bulk-status", { productIds: ids, status: "PUBLISHED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelectedRows(new Set());
    },
  });

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-charcoal-900">
        Product Moderation
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-cream-200 rounded-lg text-sm"
        >
          {statusFilters.map((f) => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
      </div>

      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <span className="text-sm font-medium text-teal-700">{selectedRows.size} selected</span>
          <button
            type="button"
            onClick={() => bulkApproveMutation.mutate(Array.from(selectedRows))}
            className="px-3 py-1 text-xs font-medium bg-teal-600 text-white rounded-md"
          >
            Bulk Approve
          </button>
          <button className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-md">
            Bulk Reject
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" />
      ) : (
        <DataTable
          columns={[
            {
              header: "Image",
              accessor: (row: Product) => (
                <div className="w-12 h-12 rounded-md border overflow-hidden bg-cream-50">
                  {row.images?.[0]?.url ? (
                    <img src={row.images[0].url} alt={row.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-cream-100" />
                  )}
                </div>
              ),
              className: "w-16",
            },
            {
              header: "Title",
              accessor: (row: Product) => (
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{row.title}</p>
                  <p className="text-xs text-warm-gray-500">{row.vendor?.storeName}</p>
                </div>
              ),
            },
            {
              header: "Price",
              accessor: (row: Product) => formatPrice(Number(row.price)),
            },
            {
              header: "Status",
              accessor: (row: Product) => (
                <Badge
                  variant={row.status === "PUBLISHED" ? "teal" : row.status === "PENDING_REVIEW" ? "amber" : "red"}
                  size="sm"
                >
                  {PRODUCT_STATUS_MAP[row.status]?.label || row.status}
                </Badge>
              ),
            },
            {
              header: "Submitted",
              accessor: (row: Product) => formatDate(row.createdAt),
            },
            {
              header: "Actions",
              accessor: (row: Product) => (
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded">
                    Approve
                  </button>
                  <button className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded">
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
          data={products as any}
          showSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => (row as any).id}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </motion.div>
  );
}
