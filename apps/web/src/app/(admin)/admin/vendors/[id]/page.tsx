"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { VENDOR_STATUS_MAP, CRAFT_TYPES } from "@/lib/constants";
import type { Vendor, ApiResponse } from "@/types";

export default function AdminVendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "vendor", id],
    queryFn: () => get<ApiResponse<Vendor>>(`/admin/vendors/${id}`),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      patch(`/admin/vendors/${id}/status`, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "vendor", id] });
      setShowApproveModal(false);
      setShowRejectModal(false);
      setReason("");
    },
  });

  const vendor = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <EmptyState
        title="Vendor not found"
        description="This vendor doesn't exist."
        action={{ label: "Back to Vendors", href: "/admin/vendors" }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <Link
        href="/admin/vendors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-gray-600 hover:text-charcoal-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vendors
      </Link>

      <div className="bg-white rounded-xl border border-cream-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-warm-gray-200 overflow-hidden">
              {vendor.storeLogo ? (
                <img src={vendor.storeLogo} alt={vendor.storeName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-warm-gray-500 font-bold">
                  {vendor.storeName?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-charcoal-900">
                {vendor.storeName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    vendor.status === "VERIFIED"
                      ? "teal"
                      : vendor.status === "PENDING"
                        ? "amber"
                        : "red"
                  }
                >
                  {VENDOR_STATUS_MAP[vendor.status]?.label}
                </Badge>
                <span className="text-sm text-warm-gray-500">
                  Since {formatDate(vendor.storeSince)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {vendor.status === "PENDING" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
              </>
            )}
            {vendor.status === "VERIFIED" && (
              <button
                type="button"
                onClick={() => statusMutation.mutate({ status: "SUSPENDED" })}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
              >
                Suspend
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-3">
              Vendor Info
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Owner</dt>
                <dd className="font-medium text-charcoal-900">
                  {vendor.user?.fullName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Email</dt>
                <dd className="font-medium text-charcoal-900">
                  {vendor.user?.email}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Phone</dt>
                <dd className="font-medium text-charcoal-900">
                  {vendor.user?.phone || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Craft Types</dt>
                <dd className="font-medium text-charcoal-900 text-right">
                  {vendor.craftType?.map((ct: string) => (
                    <Badge key={ct} variant="outline" size="sm" className="ml-1">
                      {CRAFT_TYPES.find((c) => c.value === ct)?.label || ct}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-3">
              Stats
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Products</dt>
                <dd className="font-medium text-charcoal-900">
                  {vendor.totalProducts}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Orders</dt>
                <dd className="font-medium text-charcoal-900">
                  {vendor.totalOrders}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Revenue</dt>
                <dd className="font-medium text-charcoal-900">
                  {formatPrice(Number(vendor.totalRevenue))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-gray-500">Rating</dt>
                <dd className="font-medium text-gold-600">
                  {vendor.rating.toFixed(1)} / 5
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
              Approve Vendor?
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Approval notes (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2.5 border border-cream-200 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  statusMutation.mutate({ status: "VERIFIED", notes: reason })
                }
                disabled={statusMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
              Reject Vendor?
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection (required)"
              rows={3}
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2.5 border border-cream-200 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  statusMutation.mutate({ status: "REJECTED", notes: reason })
                }
                disabled={!reason || statusMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
