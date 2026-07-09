"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { RatingStars } from "@/components/shared/rating-stars";
import { get, patch } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import { VENDOR_STATUS_MAP, CRAFT_TYPES } from "@/lib/constants";
import type { Vendor, PaginatedResponse } from "@/types";
import { Users, Store, ShieldCheck, AlertTriangle } from "lucide-react";
import { CustomSelect } from "@/components/shared/custom-select";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "VERIFIED", label: "Verified" },
  { key: "PENDING", label: "Pending" },
  { key: "SUSPENDED", label: "Suspended" },
];

export default function AdminVendorsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "vendors", search, status, page],
    queryFn: () =>
      get<PaginatedResponse<Vendor>>("/admin/vendors", {
        page,
        limit: 20,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
      }),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) =>
      post(`/admin/vendors/${id}/verify`, { notes: "Approved by admin" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] }),
  });

  const vendors = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-text-900">
        Vendor Management
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <CustomSelect
          value={status}
          onChange={(val: string) => {
            setStatus(val);
            setPage(1);
          }}
          options={statusFilters.map(f => ({ value: f.key, label: f.label }))}
          wrapperClassName="w-48"
          className="border-accent-200 focus:ring-2 focus:ring-primary-500 py-2 px-3 h-9"
        />
      </div>

      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted-50 border border-muted-200 rounded-lg">
          <span className="text-sm font-medium text-muted-700">
            {selectedRows.size} selected
          </span>
          <button
            type="button"
            className="px-3 py-1 text-xs font-medium bg-muted-600 text-white rounded-md"
          >
            Verify Selected
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : vendors.length === 0 ? (
        <EmptyState title="No vendors found" description="No vendors match your filters." />
      ) : (
        <DataTable
          columns={[
            {
              header: "Store",
              accessor: (row: Vendor) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted-200 overflow-hidden">
                    {row.storeLogo ? (
                      <img src={row.storeLogo} alt={row.storeName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-500 text-xs font-bold">
                        {row.storeName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-900">
                      {row.storeName}
                    </p>
                    <p className="text-xs text-muted-500">
                      {row.user?.fullName} | {row.user?.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Craft Types",
              accessor: (row: Vendor) => (
                <div className="flex flex-wrap gap-1">
                  {row.craftType?.slice(0, 2).map((ct: string) => (
                    <Badge key={ct} variant="outline" size="sm">
                      {CRAFT_TYPES.find((c) => c.value === ct)?.label || ct}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              header: "Status",
              accessor: (row: Vendor) => (
                <Badge
                  variant={
                    row.status === "VERIFIED"
                      ? "muted"
                      : row.status === "PENDING"
                        ? "amber"
                        : "red"
                  }
                  size="sm"
                >
                  {VENDOR_STATUS_MAP[row.status]?.label || row.status}
                </Badge>
              ),
            },
            {
              header: "Products",
              accessor: (row: Vendor) => row.totalProducts || 0,
            },
            {
              header: "Rating",
              accessor: (row: Vendor) => (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-accent-600">
                    {(row.rating || 0).toFixed(1)}
                  </span>
                </div>
              ),
            },
            {
              header: "Joined",
              accessor: (row: Vendor) => formatDate(row.createdAt),
            },
            {
              header: "Actions",
              accessor: (row: Vendor) => (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/vendors/${row.id}`}
                    className="px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded"
                  >
                    View
                  </Link>
                  {row.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => verifyMutation.mutate(row.id)}
                      className="px-2 py-1 text-xs font-medium text-muted-600 hover:bg-muted-50 rounded"
                    >
                      Verify
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          data={vendors as any}
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
