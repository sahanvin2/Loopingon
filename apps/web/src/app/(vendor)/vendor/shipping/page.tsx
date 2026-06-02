"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Save, Truck } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

export default function VendorShippingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "shipping"],
    queryFn: () =>
      get<ApiResponse<{
        processingTime: number;
        domesticRate: string;
        freeShippingEnabled: boolean;
        freeShippingMinOrder: string;
        internationalEnabled: boolean;
        internationalRate: string;
      }>>("/vendor/shipping-settings"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => patch("/vendor/shipping-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "shipping"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    values: data?.data
      ? {
          processingTime: data.data.processingTime,
          domesticRate: data.data.domesticRate,
          freeShippingEnabled: data.data.freeShippingEnabled,
          freeShippingMinOrder: data.data.freeShippingMinOrder,
          internationalEnabled: data.data.internationalEnabled,
          internationalRate: data.data.internationalRate,
        }
      : undefined,
  });

  const onSubmit = (formData: any) => {
    saveMutation.mutate({
      ...formData,
      domesticRate: String(formData.domesticRate),
      internationalRate: String(formData.internationalRate),
      freeShippingMinOrder: String(formData.freeShippingMinOrder || ""),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-charcoal-900">Shipping Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Processing Time
          </h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Default processing time (days)
            </label>
            <input
              type="number"
              min={0}
              max={30}
              {...register("processingTime", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Domestic Shipping
          </h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Rate (LKR)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("domesticRate")}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">Free Shipping</span>
            <input
              type="checkbox"
              {...register("freeShippingEnabled")}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Minimum order for free shipping
            </label>
            <input
              type="number"
              step="0.01"
              {...register("freeShippingMinOrder")}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            International Shipping
          </h2>
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">Enabled</span>
            <input
              type="checkbox"
              {...register("internationalEnabled")}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Rate (USD)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("internationalRate")}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
}
