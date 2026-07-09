"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Eye, Trash2, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { post } from "@/lib/api-client";
import { productFormSchema, type ProductFormInput } from "@/lib/validators";
import { CRAFT_TYPES } from "@/lib/constants";
import { FileUpload } from "@/components/forms/file-upload";
import { RichEditor } from "@/components/forms/rich-editor";
import { TagInput } from "@/components/forms/tag-input";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/shared/custom-select";

export default function VendorNewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [images, setImages] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      status: "DRAFT",
      categories: [],
      materials: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormInput) => {
      const res = await post<{ data: { id: string } }>("/vendor/dashboard/products", data);
      const productId = res.data.id;
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        await post(`/vendor/dashboard/products/${productId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "products"] });
      toast.success("Product created successfully!");
      router.push(`/vendor/products`);
    },
    onError: () => {
      toast.error("Failed to create product");
    }
  });

  const onSubmit = (data: ProductFormInput) => {
    createMutation.mutate(data);
  };

  const handleSaveDraft = () => {
    const data = watch();
    createMutation.mutate({ ...data, status: "DRAFT" } as ProductFormInput);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 10)); // max 10 images
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/vendor/products" className="p-2 rounded-lg hover:bg-surface-50">
          <ArrowLeft className="w-5 h-5 text-muted-600" />
        </Link>
        <h1 className="text-2xl font-bold text-text-900">Add New Product</h1>
      </div>

      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur border border-accent-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={handleSaveDraft} disabled={createMutation.isPending} className="px-4 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium hover:bg-surface-50 disabled:opacity-50">
            <Save className="w-4 h-4 inline mr-1" />
            Save as Draft
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <Link href="/vendor/products" className="px-6 py-2 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50">
            Cancel
          </Link>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting || createMutation.isPending}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting || createMutation.isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Title *</label>
            <input {...register("title")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="e.g. Hand-painted Clay Pot" />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Description *</label>
            <RichEditor value={watch("description")} onChange={(val: string) => setValue("description", val)} />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Short Description</label>
            <textarea {...register("shortDescription")} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Category *</label>
              <CustomSelect
                multiple
                {...register("categories")}
                options={[
                  { value: "pottery", label: "Pottery & Ceramics" },
                  { value: "wood_carving", label: "Wood Carving" },
                  { value: "textiles", label: "Textiles" },
                ]}
                placeholder="Select categories"
                className="border-accent-200 focus:ring-2 focus:ring-primary-500"
              />
              {errors.categories && <p className="text-xs text-red-600 mt-1">{errors.categories.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Craft Type *</label>
              <CustomSelect
                {...register("craftType")}
                options={CRAFT_TYPES as unknown as {value: string, label: string}[]}
                placeholder="Select craft type"
                className="border-accent-200 focus:ring-2 focus:ring-primary-500"
              />
              {errors.craftType && <p className="text-xs text-red-600 mt-1">{errors.craftType.message}</p>}
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
            <label className="block text-sm font-medium text-text-700 mb-4">Product Images (Max 10)</label>
            <div
              className="border-2 border-dashed border-accent-300 rounded-xl p-8 text-center hover:bg-surface-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-900">Click to upload images</p>
              <p className="text-xs text-muted-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
              <label className="block text-sm font-medium text-text-700 mb-1">Price (LKR) *</label>
              <input type="number" step="0.01" {...register("price")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Compare-at Price</label>
              <input type="number" step="0.01" {...register("compareAtPrice")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Cost Price (internal)</label>
              <input type="number" step="0.01" {...register("costPrice")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">SKU</label>
              <input {...register("sku")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Quantity *</label>
              <input type="number" {...register("quantity")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
              {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Max Order Quantity</label>
              <input type="number" {...register("maxOrderQuantity")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Shipping</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Weight (g)</label>
              <input type="number" {...register("weight")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Processing Time (days)</label>
              <input type="number" {...register("processingTime")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Domestic Shipping (LKR)</label>
              <input type="number" step="0.01" {...register("shippingPrice")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-700 mb-1">Intl Shipping (LKR)</label>
              <input type="number" step="0.01" {...register("shippingPriceInternational")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("freeShippingDomestic")} className="w-4 h-4 rounded" />
            <span className="text-sm">Free Shipping (Domestic)</span>
          </label>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">Attributes</h2>
          <div className="space-y-3">
            {(["isHandmade", "isCustomizable", "isEcoFriendly", "isFairTrade", "madeToOrder"] as const).map((attr) => (
              <label key={attr} className="flex items-center justify-between">
                <span className="text-sm text-text-700">{attr.replace(/^is/, "").replace(/([A-Z])/g, " $1").trim()}</span>
                <input type="checkbox" {...register(attr)} className="w-4 h-4 rounded text-primary-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-accent-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-900">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Meta Title</label>
            <input {...register("metaTitle")} maxLength={70} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-muted-500 mt-1">{watch("metaTitle")?.length || 0}/70</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">Meta Description</label>
            <textarea {...register("metaDescription")} maxLength={160} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-muted-500 mt-1">{watch("metaDescription")?.length || 0}/160</p>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
