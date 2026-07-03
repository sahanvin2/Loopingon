"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get, del } from "@/lib/api-client";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { PRODUCT_STATUS_MAP } from "@/lib/constants";
import type { Product, PaginatedResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "PUBLISHED", label: "Published" },
  { key: "PENDING_REVIEW", label: "Pending Review" },
  { key: "DRAFT", label: "Draft" },
  { key: "OUT_OF_STOCK", label: "Out of Stock" },
];

export default function VendorProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor", "products", search, statusFilter, page],
    queryFn: () =>
      get<PaginatedResponse<Product>>("/vendor/products", {
        page,
        limit: 12,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/vendor/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
      setDeleteConfirm(null);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-900">
          My Products ({meta?.total || 0})
        </h1>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={(val: string) => {
            setStatusFilter(val);
            setPage(1);
          }}
          options={statusFilters.map(f => ({ value: f.key, label: f.label }))}
          wrapperClassName="w-48"
          className="border-accent-200 focus:ring-2 focus:ring-primary-500 py-2 px-3 h-9"
        />
      </div>

      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <span className="text-sm font-medium text-primary-700">
            {selectedRows.size} selected
          </span>
          <button
            type="button"
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md"
          >
            Bulk Delete
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs font-medium text-text-600 bg-white hover:bg-surface-50 rounded-md border border-accent-200"
          >
            Bulk Apply Discount
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : isError ? (
        <EmptyState
          title="Error loading products"
          description="Something went wrong. Please try again later."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="No products yet"
          description="Add your first handcrafted product!"
          action={{ label: "Add Product", href: "/vendor/products/new" }}
        />
      ) : (
        <DataTable
          columns={[
            {
              header: "Image",
              accessor: (row: Product) => (
                <div className="w-12 h-12 rounded-md border border-accent-200 overflow-hidden bg-surface-50">
                  {row.images?.[0]?.url ? (
                    <img
                      src={row.images[0].url}
                      alt={row.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-50" />
                  )}
                </div>
              ),
              className: "w-16",
            },
            {
              header: "Title",
              accessor: (row: Product) => (
                <div>
                  <p className="font-medium text-text-900 text-sm">
                    {row.title}
                  </p>
                  <p className="text-[11px] font-mono text-muted-500 mt-0.5">ID: {row.id}</p>
                  {row.sku && (
                    <p className="text-[11px] text-muted-500 mt-0.5">SKU: {row.sku}</p>
                  )}
                </div>
              ),
              sortable: true,
            },
            {
              header: "Price",
              accessor: (row: Product) => formatPrice(Number(row.price)),
              sortable: true,
            },
            {
              header: "Stock",
              accessor: (row: Product) => (
                <span
                  className={cn(
                    "text-sm font-medium",
                    row.quantity === 0
                      ? "text-red-600"
                      : row.quantity < 5
                        ? "text-amber-600"
                        : "text-muted-600",
                  )}
                >
                  {row.quantity}
                </span>
              ),
              sortable: true,
            },
            {
              header: "Status",
              accessor: (row: Product) => (
                <Badge
                  variant={
                    row.status === "PUBLISHED"
                      ? "muted"
                      : row.status === "DRAFT"
                        ? "gray"
                        : "amber"
                  }
                  size="sm"
                >
                  {PRODUCT_STATUS_MAP[row.status]?.label || row.status}
                </Badge>
              ),
            },
            {
              header: "Sales",
              accessor: (row: Product) => row.salesCount || 0,
              sortable: true,
            },
            {
              header: "Rating",
              accessor: (row: Product) => (
                <span className="text-sm text-accent-600">
                  {(row.averageRating || 0).toFixed(1)}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row: Product) => (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/vendor/products/${row.id}/edit`}
                    className="px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(row.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Delete
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
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-muted-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium text-text-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
