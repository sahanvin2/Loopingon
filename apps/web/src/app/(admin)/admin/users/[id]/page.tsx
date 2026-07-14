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
import { CustomSelect } from "@/components/shared/custom-select";
import { toast } from "react-hot-toast";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      toast.success("Role updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update role");
    },
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
              <CustomSelect
                value={user.role}
                onChange={(val: string) => roleMutation.mutate(val)}
                options={[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "VENDOR", label: "Vendor" },
                  { value: "ADMIN", label: "Admin" },
                ]}
                className="border-accent-200 py-1 px-2 text-xs h-7"
              />
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
