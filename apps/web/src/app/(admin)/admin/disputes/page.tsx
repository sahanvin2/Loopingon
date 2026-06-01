"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { OrderDispute, PaginatedResponse } from "@/types";

export default function AdminDisputesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "disputes", statusFilter],
    queryFn: () =>
      get<PaginatedResponse<OrderDispute>>("/admin/disputes", {
        limit: 50,
        status: statusFilter,
      }),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      patch(`/admin/disputes/${id}/resolve`, { resolution }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] }),
  });

  const disputes = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal-900">Disputes</h1>

      <div className="flex gap-1 bg-white rounded-lg border border-cream-200 p-1 w-fit">
        {["PENDING", "UNDER_REVIEW", "RESOLVED"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === status ? "bg-terracotta-600 text-white" : "text-warm-gray-600 hover:text-charcoal-700"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : disputes.length === 0 ? (
        <EmptyState title="No disputes found" />
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-white rounded-lg border border-cream-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-900">
                  {dispute.reason}
                </p>
                <p className="text-xs text-warm-gray-500 mt-1">
                  Order #{dispute.orderId} - {formatDate(dispute.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    dispute.status === "RESOLVED" ? "teal" : dispute.status === "UNDER_REVIEW" ? "amber" : "red"
                  }
                  size="sm"
                >
                  {dispute.status}
                </Badge>
                <button
                  type="button"
                  onClick={() => {
                    const resolution = prompt("Resolution notes:");
                    if (resolution) resolveMutation.mutate({ id: dispute.id, resolution });
                  }}
                  className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
