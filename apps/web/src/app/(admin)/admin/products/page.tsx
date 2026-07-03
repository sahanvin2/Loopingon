"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Check, X, Loader2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Reorder } from "framer-motion";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/shared/badge";
import { get, del, patch, post, uploadMultipleFiles } from "@/lib/api-client";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Product, PaginatedResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";
import { RichEditor } from "@/components/forms/rich-editor";
import { FileUpload } from "@/components/forms/file-upload";
import { v4 as uuidv4 } from "uuid";

const PRODUCT_STATUS_MAP: Record<string, { label: string; variant: string }> = {
  PUBLISHED: { label: "Published", variant: "green" },
  PENDING_REVIEW: { label: "Pending", variant: "amber" },
  REJECTED: { label: "Rejected", variant: "red" },
  DRAFT: { label: "Draft", variant: "gray" },
  OUT_OF_STOCK: { label: "Out of Stock", variant: "gray" },
};

const statusFilters = [
  { key: "", label: "All Products" },
  { key: "PUBLISHED", label: "In Stock" },
  { key: "OUT_OF_STOCK", label: "Out of Stock" },
  { key: "PENDING_REVIEW", label: "Pending Review" },
  { key: "REJECTED", label: "Rejected" },
];

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({ 
    title: "", 
    price: "", 
    compareAtPrice: "", 
    quantity: "", 
    description: "",
    images: [] as any[]
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products", page, status, search],
    queryFn: () => get<PaginatedResponse<Product>>("/admin/products", { page, limit: 20, status: status || undefined, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/admin/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("Product deleted"); },
    onError: () => toast.error("Failed to delete product"),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => post("/admin/products/bulk-delete", { ids }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); setSelectedRows(new Set()); toast.success("Products deleted"); },
    onError: () => toast.error("Failed to delete products"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => post(`/admin/products/${id}/approve`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("Approved"); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return patch(`/admin/products/${id}`, data);
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); 
      setEditingProduct(null); 
      toast.success("Product updated successfully!"); 
    },
    onError: () => toast.error("Failed to update product"),
  });

  const products = data?.data || [];
  const meta = data?.meta;

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      quantity: product.quantity?.toString() || "0",
      description: product.description || "",
      images: product.images ? [...product.images] : []
    });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    setIsUploading(true);

    try {
      // 1. Separate new files from existing images
      const filesToUpload = editForm.images.filter(img => img.file).map(img => img.file);
      
      let uploadedUrls: any[] = [];
      if (filesToUpload.length > 0) {
        const res = await uploadMultipleFiles<any>("/media/multiple", filesToUpload, "files", { folder: "products" });
        uploadedUrls = Array.isArray(res) ? res : res.data || [];
      }

      // 2. Map back to the correct order, assigning URLs to the new files
      let uploadIndex = 0;
      const finalImages = editForm.images.map((img, index) => {
        let url = img.url;
        let thumbnail = img.thumbnail;
        
        if (img.file) {
          const uploaded = uploadedUrls[uploadIndex];
          url = uploaded?.url || url;
          thumbnail = uploaded?.thumbnail || uploaded?.url || url;
          uploadIndex++;
        }
        
        return {
          id: img.id || uuidv4(),
          url,
          thumbnail,
          isPrimary: index === 0, // First item in reordered list is primary
          alt: img.alt || editForm.title
        };
      });

      // 3. Patch the product
      updateMutation.mutate({
        id: editingProduct.id,
        data: {
          title: editForm.title,
          price: editForm.price,
          compareAtPrice: editForm.compareAtPrice || null,
          quantity: parseInt(editForm.quantity),
          description: editForm.description,
          images: finalImages
        },
      });
    } catch (err) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setEditForm(prev => {
      const imgToRemove = prev.images.find(img => img.id === imageId);
      if (imgToRemove?.previewUrl) {
        URL.revokeObjectURL(imgToRemove.previewUrl);
      }
      return {
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      };
    });
  };

  const handleNewUpload = (files: File[]) => {
    const newImgs = files.map(file => ({
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file), // Temp preview
      previewUrl: URL.createObjectURL(file), // Stored so we can revoke it
      isPrimary: false
    }));
    setEditForm(prev => ({ ...prev, images: [...prev.images, ...newImgs] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-900">Products</h1>
          <p className="text-muted-600 mt-1">Manage all products — edit, approve, or delete</p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or SKU..."
              className="w-64 pl-9 pr-3 py-2 rounded-lg border border-accent-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-400 hover:text-text-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
          <CustomSelect
            value={status}
            onChange={(val: string) => { setStatus(val); setPage(1); }}
            options={statusFilters.map(f => ({ value: f.key, label: f.label }))}
            wrapperClassName="w-48"
            className="border-accent-200 bg-white py-2 px-3 h-9"
          />
        </div>
      </div>

      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted-50 border border-muted-200 rounded-lg">
          <span className="text-sm font-medium text-muted-700">{selectedRows.size} selected</span>
          <button onClick={() => bulkDeleteMutation.mutate(Array.from(selectedRows))}
            className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={bulkDeleteMutation.isPending}>
            {bulkDeleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Bulk Delete"}
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" />
      ) : (
        <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent-100 text-left">
                <th className="p-4 w-10"><input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(products.map(p => p.id)) : new Set())} /></th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">Product</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">SKU</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">Price</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">Stock</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase">Date</th>
                <th className="p-4 text-xs font-semibold text-muted-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-b border-accent-50 hover:bg-surface-50">
                  <td className="p-4">
                    <input type="checkbox" checked={selectedRows.has(product.id)}
                      onChange={(e) => { const s = new Set(selectedRows); e.target.checked ? s.add(product.id) : s.delete(product.id); setSelectedRows(s); }} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-50 border">
                        {product.images?.[0]?.url ? <img src={product.images[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-100" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs text-muted-500">{product.vendor?.storeName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-muted-600">{product.sku || "-"}</td>
                  <td className="p-4 text-sm font-medium">{formatPrice(Number(product.price))}</td>
                  <td className="p-4 text-sm">{product.quantity ?? 0}</td>
                  <td className="p-4">
                    <Badge variant={(PRODUCT_STATUS_MAP[product.status]?.variant || "gray") as any} size="sm">
                      {PRODUCT_STATUS_MAP[product.status]?.label || product.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-500">{formatDate(product.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {product.status === "PENDING_REVIEW" && (
                        <button onClick={() => approveMutation.mutate(product.id)} className="p-1.5 rounded-md hover:bg-green-50 text-green-600" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => { if (confirm(`Delete "${product.title}"?`)) deleteMutation.mutate(product.id); }} className="p-1.5 rounded-md hover:bg-red-50 text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setEditingProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-900">Edit Product</h2>
                <p className="text-xs text-muted-500 font-mono mt-1">ID: {editingProduct.id}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-muted-500 hover:text-text-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Title</label>
                <input value={editForm.title} onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-accent-200 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Price (Rs.)</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-accent-200 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-1">Compare At Price</label>
                  <input type="number" value={editForm.compareAtPrice} onChange={(e) => setEditForm(p => ({ ...p, compareAtPrice: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-accent-200 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Stock Quantity</label>
                <input type="number" value={editForm.quantity} onChange={(e) => setEditForm(p => ({ ...p, quantity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-accent-200 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-700">Product Images</label>
                  <span className="text-xs text-muted-500">Drag to reorder. First image is primary.</span>
                </div>
                
                {editForm.images.length > 0 && (
                  <Reorder.Group 
                    axis="x" 
                    values={editForm.images} 
                    onReorder={(newOrder) => setEditForm(p => ({ ...p, images: newOrder }))}
                    className="flex flex-wrap gap-3 mb-4"
                  >
                    {editForm.images.map((img: any, index: number) => (
                      <Reorder.Item 
                        key={img.id} 
                        value={img}
                        className="relative group rounded-lg overflow-hidden border border-accent-200 w-24 h-24 sm:w-28 sm:h-28 cursor-grab active:cursor-grabbing bg-surface-50"
                      >
                        <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <div className="p-1.5 bg-white/20 text-white rounded-md cursor-grab active:cursor-grabbing hover:bg-white/40">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeExistingImage(img.id)}
                            className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm font-medium">
                            Primary
                          </span>
                        )}
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
                
                <FileUpload 
                  maxFiles={10 - editForm.images.length} 
                  accept="image/*" 
                  onUpload={handleNewUpload}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-700 mb-1">Description (Supports Rich Text, PDF Links & Embeds)</label>
                <RichEditor 
                  value={editForm.description} 
                  onChange={(val: string) => setEditForm(p => ({ ...p, description: val }))} 
                />
              </div>

            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-accent-100">
              <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 border border-accent-200 text-text-600 font-medium rounded-xl hover:bg-surface-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={updateMutation.isPending || isUploading}
                className="px-8 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
                {(updateMutation.isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
