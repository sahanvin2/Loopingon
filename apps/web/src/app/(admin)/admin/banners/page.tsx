"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: () => get<any>("/admin/banners", { limit: 50 }),
  });

  const banners = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Banner Management</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Create Banner
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : banners.length === 0 ? (
        <EmptyState title="No banners" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Dates</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {banners.map((banner: any) => (
                <tr key={banner.id}>
                  <td className="px-4 py-3">
                    {banner.imageUrl ? (
                      <div className="w-16 h-10 rounded overflow-hidden"><img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" /></div>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{banner.title}</td>
                  <td className="px-4 py-3">{banner.position}</td>
                  <td className="px-4 py-3"><Badge variant={banner.active ? "muted" : "gray"} size="sm">{banner.active ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-4 py-3 text-xs">{banner.startDate ? formatDate(banner.startDate) : "—"}</td>
                  <td className="px-4 py-3 text-right">{banner.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-muted-500 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1 text-muted-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
