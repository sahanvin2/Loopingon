"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import type { PayoutSchedule, PaginatedResponse } from "@/types";

export default function AdminPayoutsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payouts"],
    queryFn: () => get<PaginatedResponse<PayoutSchedule>>("/admin/payouts", { limit: 50 }),
  });

  const processAllMutation = useMutation({
    mutationFn: () => patch("/admin/payouts/process-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] }),
  });

  const payouts = data?.data || [];

  const pendingTotal = payouts
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.payoutAmount), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-text-900">Payout Management</h1>

      <div className="bg-muted-50 border border-muted-200 rounded-lg p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-700">Total Pending Payouts</p>
          <p className="text-3xl font-bold text-muted-800">{formatPrice(pendingTotal)}</p>
        </div>
        <button type="button" onClick={() => processAllMutation.mutate()} disabled={processAllMutation.isPending} className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {processAllMutation.isPending ? "Processing..." : "Process All Payouts"}
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : payouts.length === 0 ? (
        <EmptyState title="No payouts found" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Comm.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Payout</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-xs">{formatDate(p.periodStart)} - {formatDate(p.periodEnd)}</td>
                  <td className="px-4 py-3">{p.vendor?.storeName || "—"}</td>
                  <td className="px-4 py-3 text-right">{p.totalOrders}</td>
                  <td className="px-4 py-3 text-right">{formatPrice(Number(p.totalRevenue))}</td>
                  <td className="px-4 py-3 text-right text-red-600">-{formatPrice(Number(p.totalCommission))}</td>
                  <td className="px-4 py-3 text-right font-medium text-muted-600">{formatPrice(Number(p.payoutAmount))}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "COMPLETED" ? "muted" : p.status === "FAILED" ? "red" : "amber"} size="sm">{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "PENDING" && (
                      <button type="button" className="text-xs font-medium text-primary-600 hover:text-primary-700">Process</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
