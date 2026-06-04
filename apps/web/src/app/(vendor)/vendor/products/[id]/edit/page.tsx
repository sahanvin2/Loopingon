"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Eye, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { get, patch, del } from "@/lib/api-client";
import { productFormSchema, type ProductFormInput } from "@/lib/validators";
import { CRAFT_TYPES } from "@/lib/constants";
import { FileUpload } from "@/components/forms/file-upload";
import { RichEditor } from "@/components/forms/rich-editor";
import { TagInput } from "@/components/forms/tag-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/shared/badge";
import { PRODUCT_STATUS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";

export default function VendorEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor", "product", id],
    queryFn: () => get<ApiResponse<Product>>(`/vendor/products/${id}`),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormInput) =>
      patch(`/vendor/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
      router.push("/vendor/products");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => del(`/vendor/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
      router.push("/vendor/products");
    },
  });

  const product = data?.data;
  const formStatus =
    product?.status === "DRAFT" || product?.status === "PENDING_REVIEW"
      ? product.status
      : "PENDING_REVIEW";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    values: product
      ? {
          title: product.title,
          description: product.description,
          status: formStatus,
          shortDescription: product.shortDescription || undefined,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          costPrice: product.costPrice ? Number(product.costPrice) : undefined,
          quantity: product.quantity,
          sku: product.sku || undefined,
          categories: product.categories?.map((c: any) => c.categoryId) || [],
          craftType: product.craftType || "",
          materials: product.materials || [],
          weight: product.weight || undefined,
          processingTime: product.processingTime || undefined,
          shippingPrice: product.shippingPrice ? Number(product.shippingPrice) : undefined,
          shippingPriceInternational: product.shippingPriceInternational ? Number(product.shippingPriceInternational) : undefined,
          freeShippingDomestic: product.freeShippingDomestic,
          isHandmade: product.isHandmade,
          isCustomizable: product.isCustomizable,
          isEcoFriendly: product.isEcoFriendly,
          isFairTrade: product.isFairTrade,
          madeToOrder: product.madeToOrder,
          maxOrderQuantity: product.maxOrderQuantity || undefined,
          metaTitle: product.metaTitle || undefined,
          metaDescription: product.metaDescription || undefined,
        }
      : undefined,
  });

  const onSubmit = (data: ProductFormInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-600">Product not found</p>
        <Link href="/vendor/products" className="text-primary-600 font-medium mt-2 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/vendor/products" className="p-2 rounded-lg hover:bg-surface-50">
          <ArrowLeft className="w-5 h-5 text-muted-600" />
        </Link>
        <h1 className="text-2xl font-bold text-text-900">Edit Product</h1>
        <Badge
          variant={
            product.status === "PUBLISHED" ? "muted" : product.status === "DRAFT" ? "gray" : "amber"
          }
        >
          {PRODUCT_STATUS_MAP[product.status]?.label || product.status}
        </Badge>
      </div>

      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur border border-accent-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 inline mr-1" />}
            Delete
          </button>
        </div>
        <button
          type="submit"
          form="edit-product-form"
          disabled={isSubmitting || updateMutation.isPending}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting || updateMutation.isPending ? "Saving..." : "Update Product"}
        </button>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Title *</label>
            <input {...register("title")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Description *</label>
            <RichEditor value={watch("description")} onChange={(val: string) => setValue("description", val)} />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Short Description</label>
            <textarea {...register("shortDescription")} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Craft Type *</label>
              <select {...register("craftType")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm">
                <option value="">Select craft type</option>
                {CRAFT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Materials</label>
            <TagInput />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Media</h2>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Product Images</label>
            <FileUpload maxFiles={10} accept="image/*" />
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.images.map((img) => (
                  <div key={img.id} className="relative rounded-md overflow-hidden border border-accent-200">
                    <img src={img.thumbnail || img.url} alt={img.alt || product.title} className="w-full aspect-square object-cover" />
                    {img.isPrimary && (
                      <span className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (LKR) *</label>
              <input type="number" step="0.01" {...register("price")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare-at Price</label>
              <input type="number" step="0.01" {...register("compareAtPrice")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity *</label>
              <input type="number" {...register("quantity")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
              {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input {...register("sku")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">SEO</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input {...register("metaTitle")} maxLength={70} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea {...register("metaDescription")} maxLength={160} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
          </div>
        </div>
      </form>
    </motion.div>
  );
}
