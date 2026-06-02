"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Save, Store } from "lucide-react";
import { get, patch } from "@/lib/api-client";
import { FileUpload } from "@/components/forms/file-upload";
import { RichEditor } from "@/components/forms/rich-editor";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { StorefrontSettings, ApiResponse } from "@/types";

export default function VendorStorefrontPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "storefront"],
    queryFn: () => get<ApiResponse<StorefrontSettings>>("/vendor/storefront"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<StorefrontSettings>) =>
      patch("/vendor/storefront", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "storefront"] });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      themeColor: data?.data?.themeColor || "#b0566e",
      aboutSection: data?.data?.aboutSection || "",
      storySection: data?.data?.storySection || "",
    },
    values: data?.data ? {
      themeColor: data.data.themeColor || "#b0566e",
      aboutSection: data.data.aboutSection || "",
      storySection: data.data.storySection || "",
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
      <h1 className="text-2xl font-bold text-charcoal-900">Storefront</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Theme</h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("themeColor")}
                className="w-10 h-10 rounded border border-blush-200 cursor-pointer"
              />
              <span className="text-sm text-muted-600 font-mono">
                {watch("themeColor")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Store Banner
          </h2>
          <p className="text-xs text-muted-500">
            Recommended: 1920 x 400px
          </p>
          <FileUpload maxFiles={1} accept="image/*" />
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Store Logo
          </h2>
          <FileUpload maxFiles={1} accept="image/*" />
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            About Section
          </h2>
          <RichEditor
            value={watch("aboutSection")}
            onChange={(val) => setValue("aboutSection", val)}
          />
        </div>

        <div className="bg-white rounded-xl border border-blush-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">
            Story Section
          </h2>
          <RichEditor
            value={watch("storySection")}
            onChange={(val) => setValue("storySection", val)}
          />
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
