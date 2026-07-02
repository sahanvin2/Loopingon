"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { FileUpload } from "@/components/forms/file-upload";
import { RichEditor } from "@/components/forms/rich-editor";
import { get, post, patch, del } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { COMPETITION_STATUS_MAP, CRAFT_TYPES } from "@/lib/constants";
import type { Competition, PaginatedResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";

export default function AdminCompetitionsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Competition | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "competitions"],
    queryFn: () => get<PaginatedResponse<Competition>>("/admin/competitions", { limit: 50 }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editing ? patch(`/admin/competitions/${editing.id}`, data) : post("/admin/competitions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competitions"] });
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/admin/competitions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "competitions"] }),
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
    values: editing ? {
      title: editing.title,
      description: editing.description,
      craftType: editing.craftType || "",
      prizeDescription: editing.prizeDescription,
      prizeValue: editing.prizeValue || "",
      startDate: editing.startDate?.split("T")[0],
      endDate: editing.endDate?.split("T")[0],
      maxEntries: editing.maxEntries,
      status: editing.status,
    } : undefined,
  });

  const onSubmit = (data: any) => saveMutation.mutate(data);

  const competitions = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Competitions</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); reset({}); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Create Competition
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : competitions.length === 0 ? (
        <EmptyState title="No competitions" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Dates</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Entries</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Prize</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {competitions.map((comp) => (
                <tr key={comp.id}>
                  <td className="px-4 py-3 font-medium text-text-900">{comp.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={comp.status === "ACTIVE" ? "muted" : comp.status === "UPCOMING" ? "amber" : "gray"} size="sm">
                      {COMPETITION_STATUS_MAP[comp.status]?.label || comp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">{formatDate(comp.startDate)} - {formatDate(comp.endDate)}</td>
                  <td className="px-4 py-3 text-right">{comp.entries?.length || 0}</td>
                  <td className="px-4 py-3 text-xs">{comp.prizeDescription}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => { setEditing(comp); setShowModal(true); }} className="p-1 text-muted-500 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => deleteMutation.mutate(comp.id)} className="p-1 text-muted-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? "Edit" : "Create"} Competition</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Title *</label>
                  <input {...register("title", { required: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Description</label>
                  <textarea {...register("description")} rows={3} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Craft Type</label>
                  <CustomSelect
                    {...register("craftType")}
                    options={[{ value: "", label: "All" }, ...CRAFT_TYPES as unknown as {value: string, label: string}[]]}
                    className="border-accent-200 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Prize Description</label>
                  <input {...register("prizeDescription")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">Start Date</label>
                    <input type="date" {...register("startDate")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">End Date</label>
                    <input type="date" {...register("endDate")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Max Entries</label>
                  <input type="number" {...register("maxEntries", { valueAsNumber: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Status</label>
                  <CustomSelect
                    {...register("status")}
                    options={[
                      { value: "UPCOMING", label: "Upcoming" },
                      { value: "ACTIVE", label: "Active" },
                      { value: "JUDGING", label: "Judging" },
                      { value: "COMPLETED", label: "Completed" },
                    ]}
                    className="border-accent-200 py-2 px-3"
                  />
                </div>
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
