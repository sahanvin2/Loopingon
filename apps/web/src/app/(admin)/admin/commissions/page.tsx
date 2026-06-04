"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Percent } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

export default function AdminCommissionsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "commissions"],
    queryFn: () => get<ApiResponse<any[]>>("/admin/commissions"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editing ? patch(`/admin/commissions/${editing.id}`, data) : post("/admin/commissions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "commissions"] });
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/admin/commissions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "commissions"] }),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    values: editing
      ? {
          name: editing.name,
          rate: editing.rate,
          minOrderAmount: editing.minOrderAmount || "",
          maxOrderAmount: editing.maxOrderAmount || "",
          isActive: editing.isActive,
        }
      : undefined,
  });

  const onSubmit = (data: any) => saveMutation.mutate({ ...data, rate: Number(data.rate) });

  const rules = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Commissions</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); reset({ rate: 20 }); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      <div className="bg-white rounded-lg border border-accent-200 p-4 flex items-center gap-3">
        <Percent className="w-5 h-5 text-primary-600" />
        <span className="text-sm text-text-700">Default Platform Commission: <strong>20%</strong></span>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : rules.length === 0 ? (
        <EmptyState title="No commission rules" description="Default 20% applies" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Min Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Max Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {rules.map((rule: any) => (
                <tr key={rule.id}>
                  <td className="px-4 py-3 font-medium">{rule.name}</td>
                  <td className="px-4 py-3 text-right">{rule.rate}%</td>
                  <td className="px-4 py-3">{rule.minOrderAmount || "—"}</td>
                  <td className="px-4 py-3">{rule.maxOrderAmount || "—"}</td>
                  <td className="px-4 py-3"><Badge variant={rule.isActive ? "muted" : "gray"} size="sm">{rule.isActive ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => { setEditing(rule); setShowModal(true); }} className="p-1 text-muted-500 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => deleteMutation.mutate(rule.id)} className="p-1 text-muted-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-900/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? "Edit" : "Add"} Commission Rule</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input {...register("name", { required: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rate (%) *</label>
                  <input type="number" step="0.1" {...register("rate", { required: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Order</label>
                    <input type="number" {...register("minOrderAmount")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Order</label>
                    <input type="number" {...register("maxOrderAmount")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded" />
                  <span className="text-sm">Active</span>
                </label>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
