"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Download, Clock, DollarSign, CreditCard } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import type { PayoutSchedule, PaginatedResponse, ApiResponse } from "@/types";

const payoutStatusColors: Record<string, { variant: "muted" | "blush" | "amber" | "red"; label: string }> = {
  COMPLETED: { variant: "muted", label: "Completed" },
  PENDING: { variant: "amber", label: "Pending" },
  PROCESSING: { variant: "blush", label: "Processing" },
  FAILED: { variant: "red", label: "Failed" },
};

export default function VendorPaymentsPage() {
  const { data: summaryData } = useQuery({
    queryKey: ["vendor", "payout-summary"],
    queryFn: () =>
      get<ApiResponse<{
        pendingPayout: string;
        nextPayoutDate: string;
        totalPayout: string;
      }>>("/vendor/payouts/summary"),
  });

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["vendor", "payouts"],
    queryFn: () =>
      get<PaginatedResponse<PayoutSchedule>>("/vendor/payouts", { limit: 50 }),
  });

  const summary = summaryData?.data;
  const payouts = historyData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-text-900">
        Payments & Payouts
      </h1>

      <div className="bg-gradient-to-r from-muted-500 to-muted-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-100">Pending Payout</p>
            <p className="text-3xl font-bold mt-1">
              {formatPrice(Number(summary?.pendingPayout || 0))}
            </p>
          </div>
          {summary?.nextPayoutDate && (
            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                Next Payout
              </div>
              <p className="font-semibold mt-1">
                {formatDate(summary.nextPayoutDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Payout History
        </h2>

        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={5} />
        ) : payouts.length === 0 ? (
          <EmptyState
            title="No payouts yet"
            description="Your first payout will appear here after you make sales."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Period
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">
                    Payout
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {payouts.map((payout) => {
                  const statusInfo = payoutStatusColors[payout.status] || payoutStatusColors.PENDING;
                  return (
                    <tr key={payout.id}>
                      <td className="px-4 py-3 text-xs text-text-700">
                        {formatDate(payout.periodStart)} - {formatDate(payout.periodEnd)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-700 text-right">
                        {payout.totalOrders}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-700 text-right">
                        {formatPrice(Number(payout.totalRevenue))}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 text-right">
                        -{formatPrice(Number(payout.totalCommission))}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-muted-600 text-right">
                        {formatPrice(Number(payout.payoutAmount))}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-500">
                        {payout.processedAt
                          ? formatDate(payout.processedAt)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="p-1.5 text-muted-500 hover:text-primary-600 rounded"
                          aria-label="Download report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
