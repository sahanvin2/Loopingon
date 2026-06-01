"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Edit3, Save } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import type { Product, PaginatedResponse } from "@/types";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<Record<string, number>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor", "inventory", search, showLowStock],
    queryFn: () =>
      get<PaginatedResponse<Product>>("/vendor/products", {
        limit: 100,
        search: search || undefined,
        lowStock: showLowStock || undefined,
      }),
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      patch(`/vendor/products/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "inventory"] });
      setEditingStock(null);
    },
  });

  const products = data?.data || [];

  const stockStatus = (qty: number) => {
    if (qty === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (qty < 5)
      return { label: "Low Stock", color: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", color: "bg-teal-100 text-teal-700" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-charcoal-900">
        Inventory Management
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal-700">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="w-4 h-4 rounded text-terracotta-600"
          />
          Show low stock only
        </label>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : isError ? (
        <EmptyState title="Error loading inventory" description="Something went wrong." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products"
          description="No products match your filters."
        />
      ) : (
        <div className="bg-white rounded-lg border border-cream-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-warm-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-500 uppercase">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map((product) => {
                  const status = stockStatus(product.quantity);
                  const isEditing = editingStock === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-cream-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md border border-cream-200 overflow-hidden bg-cream-50">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-cream-100" />
                            )}
                          </div>
                          <span className="text-sm text-charcoal-900 font-medium">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-warm-gray-500 font-mono">
                        {product.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={stockValues[product.id] ?? product.quantity}
                            onChange={(e) =>
                              setStockValues({
                                ...stockValues,
                                [product.id]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 px-2 py-1 border border-cream-200 rounded text-sm text-right"
                          />
                        ) : (
                          <span className="text-sm font-medium text-charcoal-900">
                            {product.quantity}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          size="sm"
                          className={status.color}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-warm-gray-500">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateStockMutation.mutate({
                                  id: product.id,
                                  quantity: stockValues[product.id] ?? product.quantity,
                                })
                              }
                              disabled={updateStockMutation.isPending}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStock(null)}
                              className="p-1.5 text-warm-gray-500 hover:bg-cream-100 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingStock(product.id)}
                            className="p-1.5 text-warm-gray-500 hover:text-terracotta-600 hover:bg-terracotta-50 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
