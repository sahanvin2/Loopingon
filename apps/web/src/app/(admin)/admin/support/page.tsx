"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { SupportTicket, PaginatedResponse } from "@/types";

const statusFilters = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export default function AdminSupportPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("OPEN");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "support", statusFilter],
    queryFn: () =>
      get<PaginatedResponse<SupportTicket>>("/admin/support/tickets", {
        limit: 50,
        status: statusFilter,
      }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ ticketId }: { ticketId: string }) =>
      patch(`/admin/support/tickets/${ticketId}/assign`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "support"] }),
  });

  const tickets = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal-900">Support Tickets</h1>

      <div className="flex gap-1 bg-white rounded-lg border border-cream-200 p-1 w-fit">
        {statusFilters.map((status) => (
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
      ) : tickets.length === 0 ? (
        <EmptyState title="No support tickets" />
      ) : (
        <div className="bg-white rounded-lg border border-cream-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Ticket #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 font-mono text-xs">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3">{ticket.user?.fullName || "—"}</td>
                  <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                  <td className="px-4 py-3">{ticket.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ticket.priority === "urgent" ? "red" : ticket.priority === "high" ? "amber" : "gray"} size="sm">
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ticket.status === "RESOLVED" ? "teal" : ticket.status === "IN_PROGRESS" ? "gold" : "amber"} size="sm">
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">{formatDate(ticket.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => assignMutation.mutate({ ticketId: ticket.id })} className="px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded">
                        Assign
                      </button>
                      <button type="button" className="px-2 py-1 text-xs font-medium text-terracotta-600 hover:bg-terracotta-50 rounded">
                        View
                      </button>
                    </div>
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
