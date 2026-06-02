"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import type { Vendor, ApiResponse } from "@/types";

export default function VendorSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "settings"],
    queryFn: () => get<ApiResponse<Vendor>>("/vendor/profile"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => patch("/vendor/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "settings"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    values: data?.data ? {
      storeName: data.data.storeName,
      storeDescription: data.data.storeDescription || "",
      facebookUrl: data.data.facebookUrl || "",
      instagramUrl: data.data.instagramUrl || "",
      youtubeUrl: data.data.youtubeUrl || "",
      tiktokUrl: data.data.tiktokUrl || "",
      websiteUrl: data.data.websiteUrl || "",
      vacationMode: data.data.vacationMode,
    } : undefined,
  });

  const onSubmit = (formData: any) => {
    saveMutation.mutate(formData);
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
      <h1 className="text-2xl font-bold text-charcoal-900">Store Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4 max-w-lg">
          <h2 className="text-lg font-semibold text-charcoal-900">
            General
          </h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Store Name *
            </label>
            <input
              {...register("storeName")}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Store Description
            </label>
            <textarea
              {...register("storeDescription")}
              rows={4}
              className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4 max-w-lg">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Social Media Links
          </h2>
          {[
            { key: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/..." },
            { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/..." },
            { key: "youtubeUrl", label: "YouTube", placeholder: "https://youtube.com/..." },
            { key: "tiktokUrl", label: "TikTok", placeholder: "https://tiktok.com/..." },
            { key: "websiteUrl", label: "Website", placeholder: "https://..." },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">
                {field.label}
              </label>
              <input
                {...register(field.key as any)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4 max-w-lg">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Vacation Mode
          </h2>
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">Enable vacation mode</span>
            <input
              type="checkbox"
              {...register("vacationMode")}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
          </label>
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4 max-w-lg">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Notification Preferences
          </h2>
          {[
            "Email for new orders",
            "WhatsApp for new orders",
            "Email for messages",
          ].map((label) => (
            <label key={label} className="flex items-center justify-between">
              <span className="text-sm text-charcoal-700">{label}</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
            </label>
          ))}
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
