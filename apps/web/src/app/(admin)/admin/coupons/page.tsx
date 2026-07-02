"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { Coupon, PaginatedResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => get<PaginatedResponse<Coupon>>("/admin/coupons", { limit: 50 }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editingCoupon
        ? patch(`/admin/coupons/${editingCoupon.id}`, data)
        : post("/admin/coupons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      setShowModal(false);
      setEditingCoupon(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/admin/coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    values: editingCoupon
      ? {
          code: editingCoupon.code,
          description: editingCoupon.description || "",
          discountType: editingCoupon.discountType,
          discountValue: Number(editingCoupon.discountValue),
          minOrderAmount: editingCoupon.minOrderAmount || "",
          usageLimit: editingCoupon.usageLimit || "",
          expiresAt: editingCoupon.expiresAt?.split("T")[0] || "",
          isActive: editingCoupon.isActive,
        }
      : undefined,
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate({
      ...data,
      discountValue: String(data.discountValue),
    });
  };

  const coupons = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Coupons</h1>
        <button
          type="button"
          onClick={() => { setEditingCoupon(null); reset({}); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : coupons.length === 0 ? (
        <EmptyState title="No coupons" description="Create your first coupon" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Value</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-500 uppercase">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-text-900">{c.code}</td>
                  <td className="px-4 py-3">{c.discountType}</td>
                  <td className="px-4 py-3 text-right">{c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : Number(c.discountValue).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{c.usageCount}/{c.usageLimit || "∞"}</td>
                  <td className="px-4 py-3 text-xs">{formatDate(c.expiresAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isActive ? "muted" : "gray"} size="sm">{c.isActive ? "Active" : "Expired"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => { setEditingCoupon(c); setShowModal(true); }} className="p-1 text-muted-500 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => deleteMutation.mutate(c.id)} className="p-1 text-muted-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <h2 className="text-lg font-semibold mb-4">{editingCoupon ? "Edit" : "Create"} Coupon</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Code *</label>
                  <input {...register("code", { required: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Description</label>
                  <input {...register("description")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">Type</label>
                    <CustomSelect
                      {...register("discountType")}
                      options={[
                        { value: "PERCENTAGE", label: "Percentage" },
                        { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                        { value: "FREE_SHIPPING", label: "Free Shipping" },
                      ]}
                      className="border-accent-200 py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">Value</label>
                    <input type="number" step="0.01" {...register("discountValue")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">Min Order</label>
                    <input {...register("minOrderAmount")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-1">Usage Limit</label>
                    <input type="number" {...register("usageLimit")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Expiry Date</label>
                  <input type="date" {...register("expiresAt")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
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
