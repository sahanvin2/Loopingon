"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Save, Eye, EyeOff } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => get<ApiResponse<any>>("/admin/settings"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => patch("/admin/settings", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: data?.data
      ? {
          platformName: data.data.platformName,
          defaultCommissionRate: data.data.defaultCommissionRate,
          payoutSchedule: data.data.payoutSchedule,
          supportedCurrencies: data.data.supportedCurrencies,
        }
      : undefined,
  });

  const onSubmit = (data: any) => saveMutation.mutate(data);

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal-900">System Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">General</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Platform Name</label>
            <input {...register("platformName")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default Commission Rate (%)</label>
            <input type="number" step="0.1" {...register("defaultCommissionRate")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payout Schedule</label>
            <select {...register("payoutSchedule")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm">
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Email (SMTP)</h2>
          <div>
            <label className="block text-sm font-medium mb-1">SMTP Host</label>
            <input className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <input type="number" className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Payment Gateway (PayHere)</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Merchant ID</label>
            <input type="password" className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Merchant Secret</label>
            <input type="password" className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm font-mono" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-600 text-white rounded-lg font-medium hover:bg-terracotta-700 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </motion.div>
  );
}
