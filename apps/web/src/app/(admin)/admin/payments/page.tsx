"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Download } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import { PAYMENT_STATUS_MAP } from "@/lib/constants";
import type { PaymentTransaction, PaginatedResponse } from "@/types";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments", search, page],
    queryFn: () =>
      get<PaginatedResponse<PaymentTransaction>>("/admin/payments", {
        page,
        limit: 20,
        search: search || undefined,
      }),
  });

  const payments = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">Payments</h1>
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
            <input type="text" placeholder="Search transaction..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
          </div>
          <button className="px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : payments.length === 0 ? (
        <EmptyState title="No payments found" />
      ) : (
        <DataTable
          columns={[
            { header: "Transaction ID", accessor: (row: any) => <span className="font-mono text-xs">{row.gatewayTransactionId || row.id}</span> },
            { header: "Order #", accessor: (row: any) => row.orderId || "—" },
            { header: "User", accessor: (row: any) => row.userId || "—" },
            { header: "Amount", accessor: (row: any) => formatPrice(Number(row.amount)) },
            { header: "Gateway", accessor: (row: any) => row.gatewayName || "—" },
            {
              header: "Status",
              accessor: (row: any) => (
                <Badge variant={row.status === "COMPLETED" ? "teal" : row.status === "FAILED" ? "red" : "amber"} size="sm">
                  {PAYMENT_STATUS_MAP[row.status]?.label || row.status}
                </Badge>
              ),
            },
            { header: "Date", accessor: (row: any) => formatDate(row.createdAt) },
          ]}
          data={payments as any}
          getRowId={(row) => (row as any).id}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </motion.div>
  );
}
