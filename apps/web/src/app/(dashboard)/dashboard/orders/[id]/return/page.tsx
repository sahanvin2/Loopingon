"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";

import { get, patch } from "@/lib/api-client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { ApiResponse, Order } from "@/types";

export default function OrderReturnPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => get<ApiResponse<Order>>(`/users/orders/${id}`),
  });

  const returnMutation = useMutation({
    mutationFn: (returnReason: string) => patch(`/users/orders/${id}/return`, { reason: returnReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Return request submitted successfully");
      router.push(`/dashboard/orders/${id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit return request");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the return");
      return;
    }
    setIsSubmitting(true);
    returnMutation.mutate(reason);
  };

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find the order you're trying to return."
        action={{ label: "Back to My Orders", href: "/dashboard/orders" }}
      />
    );
  }

  if (order.status !== "DELIVERED" && order.status !== "COMPLETED") {
    return (
      <EmptyState
        icon={<AlertCircle className="w-12 h-12 text-amber-500" />}
        title="Return Not Available"
        description="This order is not eligible for return. Only delivered orders can be returned."
        action={{ label: "Back to Order Details", href: `/dashboard/orders/${id}` }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Link
        href={`/dashboard/orders/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-text-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Order Details
      </Link>

      <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
        <div className="bg-surface-50 border-b border-accent-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-accent-200">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-900">
              Request Order Return
            </h1>
            <p className="text-sm text-muted-500 mt-1">
              Order {order.orderNumber}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-text-700 mb-1">
                Why are you returning this order? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe why you want to return this item. Is it defective? Was it not as described? Let us know."
                className="w-full px-3 py-2 border border-accent-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm placeholder:text-muted-400"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Return Policy:</strong> You have 7 days from the delivery date to return an item. The item must be unused, in its original packaging, and with all tags attached. Returns are subject to approval by the vendor.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-accent-200">
            <Link
              href={`/dashboard/orders/${id}`}
              className="px-5 py-2.5 bg-white border border-accent-200 rounded-lg text-sm font-medium text-text-700 hover:bg-surface-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
