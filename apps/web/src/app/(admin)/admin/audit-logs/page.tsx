"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Download } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";
import type { PaginatedResponse } from "@/types";

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit-logs", search, page],
    queryFn: () =>
      get<PaginatedResponse<{
        id: string;
        timestamp: string;
        user: string;
        action: string;
        entity: string;
        entityId: string;
        details: Record<string, unknown>;
        ipAddress: string;
        device?: string;
        country?: string;
        city?: string;
      }>>("/admin/audit-logs", {
        page,
        limit: 30,
        search: search || undefined,
      }),
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Audit Logs</h1>
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : logs.length === 0 ? (
        <EmptyState title="No audit logs found" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Entity ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">IP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                  <td className="px-4 py-3">{log.user || "—"}</td>
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3">{log.entity}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.entityId}</td>
                  <td className="px-4 py-3 text-xs max-w-xs">
                    <button
                      type="button"
                      className="text-primary-600 hover:underline"
                      onClick={() => {
                        const details = JSON.stringify(log.details, null, 2);
                        alert(details);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-xs">{log.device || "Unknown"}</td>
                  <td className="px-4 py-3 text-xs">{log.country ? `${log.city || ""}, ${log.country}`.replace(/^, /, "") : "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </motion.div>
  );
}
