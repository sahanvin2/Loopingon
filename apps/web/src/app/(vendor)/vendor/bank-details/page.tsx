"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, CreditCard, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { VendorBankDetail, ApiResponse } from "@/types";

export default function VendorBankDetailsPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "bank-details"],
    queryFn: () => get<ApiResponse<VendorBankDetail[]>>("/vendor/bank-details"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const existing = bankDetails?.[0];
      if (existing) return patch(`/vendor/bank-details/${existing.id}`, data);
      return post("/vendor/bank-details", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "bank-details"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/vendor/bank-details/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "bank-details"] });
      setDeletingId(null);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    values: data?.data?.[0]
      ? {
          bankName: data.data[0].bankName,
          branchName: data.data[0].branchName || "",
          accountHolderName: data.data[0].accountHolderName,
          accountNumber: data.data[0].accountNumber,
          accountType: data.data[0].accountType,
          isPrimary: data.data[0].isPrimary,
        }
      : undefined,
  });

  const bankDetails = data?.data || [];
  const bank = bankDetails[0];

  const onSubmit = (formData: any) => {
    saveMutation.mutate(formData);
  };

  const maskAccount = (num: string) => {
    if (!num) return "";
    const last4 = num.slice(-4);
    return "••••" + last4;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-text-900">Bank Details</h1>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={2} />
      ) : bank && !isEditing ? (
        <div className="bg-white rounded-xl border border-accent-200 p-6 max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-900">
              Bank Account
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-md text-muted-500 hover:text-primary-600 hover:bg-primary-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(bank.id)}
                className="p-2 rounded-md text-muted-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-500">Bank</span>
              <span className="font-medium text-text-900">{bank.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-500">Branch</span>
              <span className="font-medium text-text-900">
                {bank.branchName || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-500">Account Holder</span>
              <span className="font-medium text-text-900">
                {bank.accountHolderName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-500">Account Number</span>
              <span className="font-mono text-text-900">
                {maskAccount(bank.accountNumber)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-500">Account Type</span>
              <span className="font-medium text-text-900">
                {bank.accountType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-500">Verification</span>
              <Badge
                variant={bank.verifiedAt ? "muted" : "amber"}
                size="sm"
              >
                {bank.verifiedAt ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-500 mt-4 p-3 bg-surface-50 rounded-lg">
            Bank details are verified by our team. Changes may require
            re-verification.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-accent-200 p-6 space-y-4 max-w-lg"
        >
          <h2 className="text-lg font-semibold text-text-900">
            {bank ? "Edit" : "Add"} Bank Account
          </h2>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">
              Bank Name *
            </label>
            <input
              {...register("bankName", { required: true })}
              className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">
              Branch
            </label>
            <input
              {...register("branchName")}
              className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">
              Account Holder Name *
            </label>
            <input
              {...register("accountHolderName", { required: true })}
              className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">
              Account Number *
            </label>
            <input
              {...register("accountNumber", { required: true })}
              className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-700 mb-1">
              Account Type
            </label>
            <select
              {...register("accountType")}
              className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isPrimary")}
              className="w-4 h-4 rounded text-primary-600"
            />
            <span className="text-sm text-text-700">Set as primary</span>
          </label>
          <div className="flex gap-3 pt-2">
            {bank && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
          <p className="text-xs text-muted-500 p-3 bg-surface-50 rounded-lg">
            Bank details are verified by our team. Changes may require
            re-verification.
          </p>
        </form>
      )}

      {bankDetails.length === 0 && !isEditing && (
        <EmptyState
          icon={<CreditCard className="w-12 h-12" />}
          title="No bank details"
          description="Add your bank account to receive payouts."
          action={{ label: "Add Bank Account", onClick: () => setIsEditing(true) }}
        />
      )}

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-text-900/50"
              onClick={() => setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-900 mb-2">
                Remove Bank Account?
              </h3>
              <p className="text-sm text-muted-600 mb-6">
                You won&apos;t receive payouts without a bank account on file.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 border border-accent-200 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deletingId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Removing..." : "Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
