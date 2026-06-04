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
import { RichEditor } from "@/components/forms/rich-editor";
import { FileUpload } from "@/components/forms/file-upload";
import { TagInput } from "@/components/forms/tag-input";
import type { BlogPost, PaginatedResponse } from "@/types";

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: () => get<PaginatedResponse<BlogPost>>("/admin/blog", { limit: 50 }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editing
        ? patch(`/admin/blog/${editing.id}`, data)
        : post("/admin/blog", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
      setShowModal(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/admin/blog/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
    values: editing
      ? {
          title: editing.title,
          slug: editing.slug,
          excerpt: editing.excerpt || "",
          content: editing.content,
          category: editing.category || "",
          isPublished: editing.isPublished,
          metaTitle: editing.metaTitle || "",
          metaDescription: editing.metaDescription || "",
        }
      : undefined,
  });

  const onSubmit = (data: any) => saveMutation.mutate(data);

  const posts = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-900">Blog</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); reset({}); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Create Post
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : posts.length === 0 ? (
        <EmptyState title="No blog posts" />
      ) : (
        <div className="bg-white rounded-lg border border-accent-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-accent-200 bg-surface-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Published</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3 font-medium text-text-900">{post.title}</td>
                  <td className="px-4 py-3">{post.category || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.isPublished ? "muted" : "gray"} size="sm">
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">{post.publishedAt ? formatDate(post.publishedAt) : "—"}</td>
                  <td className="px-4 py-3 text-right">{post.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => { setEditing(post); setShowModal(true); }} className="p-1 text-muted-500 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => deleteMutation.mutate(post.id)} className="p-1 text-muted-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? "Edit" : "Create"} Post</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Title *</label>
                  <input {...register("title", { required: true })} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Slug</label>
                  <input {...register("slug")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Excerpt</label>
                  <textarea {...register("excerpt")} rows={2} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Content</label>
                  <RichEditor value={watch("content")} onChange={(val: string) => setValue("content", val)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Featured Image</label>
                  <FileUpload maxFiles={1} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Category</label>
                  <input {...register("category")} className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Tags</label>
                  <TagInput />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register("isPublished")} className="w-4 h-4 rounded" />
                  <span className="text-sm">Published</span>
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
