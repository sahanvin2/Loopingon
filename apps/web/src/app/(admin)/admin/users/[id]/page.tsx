"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Ban, CheckCircle } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, patch, post } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/utils";
import type { User, ApiResponse } from "@/types";
import { CustomSelect } from "@/components/shared/custom-select";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => get<ApiResponse<User>>(`/admin/users/${id}`),
  });

  const user = data?.data;

  // Set initial selected role when data loads
  React.useEffect(() => {
    if (user && selectedRole === null) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const roleMutation = useMutation({
    mutationFn: (role: string) =>
      patch(`/admin/users/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update role");
    },
  });

  const banMutation = useMutation({
    mutationFn: () => post(`/admin/users/${id}/ban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(user?.isActive ? "User banned" : "User unbanned");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update user");
    },
  });

  const handleSaveRole = () => {
    if (selectedRole && selectedRole !== user?.role) {
      roleMutation.mutate(selectedRole);
    } else {
      toast.success("No changes to save");
    }
  };

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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-900">
              {user.fullName}
            </h1>
            <p className="text-xs text-muted-500 mb-2">
              {user.email}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={user.isActive ? "muted" : "red"} size="sm">
                {user.isActive ? "Active" : "Banned"}
              </Badge>
              <CustomSelect
                value={selectedRole || user.role}
                onChange={(val: string) => setSelectedRole(val)}
                options={[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "VENDOR", label: "Vendor" },
                  { value: "ADMIN", label: "Admin" },
                  { value: "SUPER_ADMIN", label: "Super Admin" },
                  { value: "SUPPORT", label: "Support" },
                ]}
                className="border-accent-200 py-1 px-2 text-xs h-7"
              />
              {selectedRole !== user.role && (
                <button
                  type="button"
                  onClick={handleSaveRole}
                  disabled={roleMutation.isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 disabled:opacity-50"
                >
                  <Save className="w-3 h-3" />
                  {roleMutation.isPending ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => banMutation.mutate()}
          disabled={banMutation.isPending}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-6 disabled:opacity-50",
            user.isActive
              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
          )}
        >
          {banMutation.isPending ? (
            "Processing..."
          ) : user.isActive ? (
            <>
              <Ban className="w-4 h-4" /> Ban User
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Unban User
            </>
          )}
        </button>

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
            <dt className="text-muted-500">Role</dt>
            <dd className="font-medium text-text-900">{user.role}</dd>
          </div>
          <div>
            <dt className="text-muted-500">Vendor Status</dt>
            <dd className="font-medium text-text-900">
              {user.vendor ? user.vendor.status : "Not a vendor"}
            </dd>
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
              Rs. {formatPrice(Number(user.customerProfile?.totalSpent || 0))}
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
