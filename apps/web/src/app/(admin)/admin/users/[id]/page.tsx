"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import type { User, ApiResponse } from "@/types";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => get<ApiResponse<User>>(`/admin/users/${id}`),
  });

  const roleMutation = useMutation({
    mutationFn: (role: string) =>
      patch(`/admin/users/${id}`, { role }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] }),
  });

  const user = data?.data;

  if (isLoading) return <LoadingSkeleton variant="detail" />;
  if (!user)
    return (
      <EmptyState
        title="User not found"
        action={{ label: "Back", href: "/admin/users" }}
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-600 hover:text-text-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-muted-200 flex items-center justify-center text-2xl font-bold text-muted-500">
            {user.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-900">
              {user.fullName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.isActive ? "muted" : "red"} size="sm">
                {user.isActive ? "Active" : "Banned"}
              </Badge>
              <select
                value={user.role}
                onChange={(e) => roleMutation.mutate(e.target.value)}
                className="px-2 py-1 text-xs border border-accent-200 rounded-md"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="VENDOR">Vendor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-500">Email</dt>
            <dd className="font-medium text-text-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-500">Phone</dt>
            <dd className="font-medium text-text-900">{user.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-500">Orders</dt>
            <dd className="font-medium text-text-900">
              {user.customerProfile?.totalOrders || 0}
            </dd>
          </div>
          <div>
            <dt className="text-muted-500">Total Spent</dt>
            <dd className="font-medium text-text-900">
              {formatPrice(Number(user.customerProfile?.totalSpent || 0))}
            </dd>
          </div>
          <div>
            <dt className="text-muted-500">Joined</dt>
            <dd className="font-medium text-text-900">
              {formatDate(user.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
    </motion.div>
  );
}
