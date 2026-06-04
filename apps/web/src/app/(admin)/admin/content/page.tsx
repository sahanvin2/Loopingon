"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch } from "@/lib/api-client";
import { RichEditor } from "@/components/forms/rich-editor";
import { formatDate } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const [editingPage, setEditingPage] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "content-pages"],
    queryFn: () => get<ApiResponse<any[]>>("/admin/content-pages"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editingPage
        ? patch(`/admin/content-pages/${editingPage.id}`, data)
        : post("/admin/content-pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content-pages"] });
      setEditingPage(null);
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm({
    values: editingPage
      ? {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content,
          isPublished: editingPage.isPublished,
          metaTitle: editingPage.metaTitle || "",
          metaDescription: editingPage.metaDescription || "",
        }
      : undefined,
  });

  const onSubmit = (data: any) => saveMutation.mutate(data);

  const pages = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-text-900">Content Pages</h1>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : pages.length === 0 ? (
        <EmptyState title="No content pages" />
      ) : (
        <div className="space-y-3">
          {pages.map((page: any) => (
            <div key={page.id} className="bg-white rounded-lg border border-accent-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-text-900">{page.title}</p>
                <p className="text-xs text-muted-500">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={page.isPublished ? "muted" : "gray"} size="sm">
                  {page.isPublished ? "Published" : "Draft"}
                </Badge>
                <button
                  type="button"
                  onClick={() => setEditingPage(page)}
                  className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editingPage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-900/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Page: {editingPage.title}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input {...register("title")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input {...register("slug")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <RichEditor value={watch("content")} onChange={(val: string) => setValue("content", val)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <input {...register("metaTitle")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea {...register("metaDescription")} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register("isPublished")} className="w-4 h-4 rounded" />
                  <span className="text-sm">Published</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingPage(null)} className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save Changes"}
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
