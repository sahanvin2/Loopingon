"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Server, Database, Activity, FileSpreadsheet } from "lucide-react";
import { get, post } from "@/lib/api-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { ApiResponse } from "@/types";

export default function AdminSystemPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "system-health"],
    queryFn: () =>
      get<ApiResponse<{
        uptime: number;
        nodeVersion: string;
        memoryUsage: string;
        dbStatus: string;
        dbSize: string;
        tableCounts: Record<string, number>;
        redisStatus: string;
        queueStatus: Record<string, { pending: number; failed: number }>;
        version: string;
      }>>("/admin/system/health"),
  });

  const clearCacheMutation = useMutation({
    mutationFn: (type: string) => post(`/admin/system/cache/clear`, { type }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "system-health"] }),
  });

  const health = data?.data;

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-text-900">System Health</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-muted-600" />
            <h2 className="font-semibold text-text-900">Server</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-500">Uptime</dt>
              <dd className="font-medium">{health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-500">Node.js</dt>
              <dd className="font-medium">{health?.nodeVersion || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-500">Memory</dt>
              <dd className="font-medium">{health?.memoryUsage || "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-accent-600" />
            <h2 className="font-semibold text-text-900">Database</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-500">Status</dt>
              <dd className="font-medium text-muted-600">{health?.dbStatus || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-500">Size</dt>
              <dd className="font-medium">{health?.dbSize || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-500">Redis</dt>
              <dd className="font-medium text-muted-600">{health?.redisStatus || "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-text-900">Queues</h2>
          </div>
          {health?.queueStatus && Object.entries(health.queueStatus).map(([name, status]) => (
            <div key={name} className="flex justify-between text-sm mb-1">
              <span className="text-muted-500">{name}</span>
              <span>
                <span className="text-amber-600">{status.pending} pending</span>
                {status.failed > 0 && <span className="text-red-600 ml-2">{status.failed} failed</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">Master Data Export</h2>
        <p className="text-sm text-text-500 mb-4">Download a complete Excel report containing all users, orders, and products in the system.</p>
        <button
          type="button"
          onClick={async () => {
            try {
              const sessionStr = localStorage.getItem("auth-storage");
              const token = sessionStr ? JSON.parse(sessionStr)?.state?.token : null;
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/export/master`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              if (!res.ok) throw new Error("Failed to export");
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "kandyam-master-export.xlsx";
              a.click();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error(err);
              alert("Failed to generate report");
            }
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Generate Master Excel Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">Cache Management</h2>
        <div className="flex flex-wrap gap-3">
          {["Redis Cache", "API Cache", "CDN Cache", "Template Cache"].map((cache) => (
            <button
              key={cache}
              type="button"
              onClick={() => clearCacheMutation.mutate(cache)}
              disabled={clearCacheMutation.isPending}
              className="px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear {cache}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-2">Version</h2>
        <p className="text-sm font-mono text-text-700">{health?.version || "—"}</p>
      </div>
    </motion.div>
  );
}
