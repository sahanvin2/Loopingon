"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import type { User, PaginatedResponse } from "@/types";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", search, page],
    queryFn: () =>
      get<PaginatedResponse<User>>("/admin/users", {
        page,
        limit: 20,
        search: search || undefined,
      }),
  });

  const banMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      patch(`/admin/users/${id}`, { isActive }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">
          User Management
        </h1>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No users match your filters." />
      ) : (
        <DataTable
          columns={[
            {
              header: "User",
              accessor: (row: User) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted-200 flex items-center justify-center text-sm font-bold text-muted-500">
                    {(row.fullName?.charAt(0) || "?").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">
                      {row.fullName}
                    </p>
                    <p className="text-xs text-muted-500">{row.email}</p>
                  </div>
                </div>
              ),
            },
            {
              header: "Phone",
              accessor: (row: User) => row.phone || "—",
            },
            {
              header: "Role",
              accessor: (row: User) => (
                <Badge
                  variant={row.role === "CUSTOMER" ? "muted" : "blush"}
                  size="sm"
                >
                  {row.role}
                </Badge>
              ),
            },
            {
              header: "Orders",
              accessor: (row: User) =>
                row.customerProfile?.totalOrders ?? 0,
            },
            {
              header: "Spent",
              accessor: (row: User) =>
                formatPrice(
                  Number(row.customerProfile?.totalSpent || 0),
                ),
            },
            {
              header: "Joined",
              accessor: (row: User) => formatDate(row.createdAt),
            },
            {
              header: "Status",
              accessor: (row: User) => (
                <Badge
                  variant={row.isActive ? "muted" : "red"}
                  size="sm"
                >
                  {row.isActive ? "Active" : "Banned"}
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessor: (row: User) => (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      banMutation.mutate({
                        id: row.id,
                        isActive: !row.isActive,
                      })
                    }
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded"
                  >
                    {row.isActive ? "Ban" : "Unban"}
                  </button>
                </div>
              ),
            },
          ]}
          data={users as any}
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
