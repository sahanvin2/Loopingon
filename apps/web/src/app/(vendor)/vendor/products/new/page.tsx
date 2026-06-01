"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Eye, Trash2, ArrowLeft } from "lucide-react";
import { post } from "@/lib/api-client";
import { productFormSchema, type ProductFormInput } from "@/lib/validators";
import { CRAFT_TYPES } from "@/lib/constants";
import { FileUpload } from "@/components/forms/file-upload";
import { RichEditor } from "@/components/forms/rich-editor";
import { TagInput } from "@/components/forms/tag-input";
import { cn } from "@/lib/utils";

export default function VendorNewProductPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      isHandmade: true,
      isCustomizable: false,
      isEcoFriendly: false,
      isFairTrade: false,
      freeShippingDomestic: false,
      currency: "LKR",
      status: "DRAFT",
      categories: [],
      materials: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormInput) =>
      post("/vendor/products", { ...data, status: data.status || "DRAFT" }),
    onSuccess: () => {
      router.push("/vendor/products");
    },
  });

  const onSubmit = (data: ProductFormInput) => {
    createMutation.mutate(data);
  };

  const handleSaveDraft = () => {
    const data = watch();
    createMutation.mutate({ ...data, status: "DRAFT" } as ProductFormInput);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/vendor/products" className="p-2 rounded-lg hover:bg-cream-100">
          <ArrowLeft className="w-5 h-5 text-warm-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-charcoal-900">Add New Product</h1>
      </div>

      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur border border-cream-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={handleSaveDraft} disabled={createMutation.isPending} className="px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium hover:bg-cream-50 disabled:opacity-50">
            <Save className="w-4 h-4 inline mr-1" />
            Save as Draft
          </button>
          <button type="button" className="px-4 py-2 bg-white border border-cream-200 rounded-lg text-sm font-medium hover:bg-cream-50">
            <Eye className="w-4 h-4 inline mr-1" />
            Preview
          </button>
        </div>
        <button
          type="submit"
          form="product-form"
          disabled={isSubmitting || createMutation.isPending}
          className="px-6 py-2 bg-terracotta-600 text-white rounded-lg text-sm font-medium hover:bg-terracotta-700 disabled:opacity-50"
        >
          {isSubmitting || createMutation.isPending ? "Submitting..." : "Submit for Review"}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Title *</label>
            <input {...register("title")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" placeholder="e.g. Hand-painted Clay Pot" />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Description *</label>
            <RichEditor value={watch("description")} onChange={(val: string) => setValue("description", val)} />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Short Description</label>
            <textarea {...register("shortDescription")} rows={2} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Category *</label>
              <select multiple {...register("categories")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" size={1}>
                <option value="">Select category</option>
                <option value="pottery">Pottery & Ceramics</option>
                <option value="wood_carving">Wood Carving</option>
                <option value="textiles">Textiles</option>
              </select>
              {errors.categories && <p className="text-xs text-red-600 mt-1">{errors.categories.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Craft Type *</label>
              <select {...register("craftType")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500">
                <option value="">Select craft type</option>
                {CRAFT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
              {errors.craftType && <p className="text-xs text-red-600 mt-1">{errors.craftType.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Materials</label>
            <TagInput />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Media</h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Product Images (max 10)</label>
            <FileUpload maxFiles={10} accept="image/*" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Product Videos (max 3)</label>
            <FileUpload maxFiles={3} accept="video/*" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Price (LKR) *</label>
              <input type="number" step="0.01" {...register("price")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Compare-at Price</label>
              <input type="number" step="0.01" {...register("compareAtPrice")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Cost Price (internal)</label>
              <input type="number" step="0.01" {...register("costPrice")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">SKU</label>
              <input {...register("sku")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Quantity *</label>
              <input type="number" {...register("quantity")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
              {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Max Order Quantity</label>
              <input type="number" {...register("maxOrderQuantity")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Shipping</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Weight (g)</label>
              <input type="number" {...register("weight")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Processing Time (days)</label>
              <input type="number" {...register("processingTime")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Domestic Shipping (LKR)</label>
              <input type="number" step="0.01" {...register("shippingPrice")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Intl Shipping (LKR)</label>
              <input type="number" step="0.01" {...register("shippingPriceInternational")} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("freeShippingDomestic")} className="w-4 h-4 rounded" />
            <span className="text-sm">Free Shipping (Domestic)</span>
          </label>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Attributes</h2>
          <div className="space-y-3">
            {(["isHandmade", "isCustomizable", "isEcoFriendly", "isFairTrade", "madeToOrder"] as const).map((attr) => (
              <label key={attr} className="flex items-center justify-between">
                <span className="text-sm text-charcoal-700">{attr.replace(/^is/, "").replace(/([A-Z])/g, " $1").trim()}</span>
                <input type="checkbox" {...register(attr)} className="w-4 h-4 rounded text-terracotta-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-900">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Meta Title</label>
            <input {...register("metaTitle")} maxLength={70} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            <p className="text-xs text-warm-gray-500 mt-1">{watch("metaTitle")?.length || 0}/70</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Meta Description</label>
            <textarea {...register("metaDescription")} maxLength={160} rows={2} className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500" />
            <p className="text-xs text-warm-gray-500 mt-1">{watch("metaDescription")?.length || 0}/160</p>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
