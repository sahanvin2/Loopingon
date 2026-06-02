"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Home,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post, patch, del } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import { addressSchema, type AddressInput } from "@/lib/validators";
import type { Address, ApiResponse } from "@/types";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => get<ApiResponse<Address[]>>("/users/addresses"),
  });

  const addMutation = useMutation({
    mutationFn: (input: AddressInput) => post<ApiResponse<Address>>("/users/addresses", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsModalOpen(false);
      setEditingAddress(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddressInput }) =>
      patch<ApiResponse<Address>>(`/users/addresses/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsModalOpen(false);
      setEditingAddress(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/users/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setDeletingId(null);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    values: editingAddress
      ? {
          label: editingAddress.label || undefined,
          fullName: editingAddress.fullName,
          phone: editingAddress.phone,
          addressLine1: editingAddress.addressLine1,
          addressLine2: editingAddress.addressLine2 || undefined,
          city: editingAddress.city,
          district: editingAddress.district,
          country: editingAddress.country,
          isDefault: editingAddress.isDefault,
        }
      : undefined,
  });

  const addresses = data?.data || [];

  const onSubmit = (input: AddressInput) => {
    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingAddress(null);
    reset({ country: "LK" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    reset({ country: "LK" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">My Addresses</h1>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : isError ? (
        <EmptyState
          title="Error loading addresses"
          description="Something went wrong. Please try again later."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                className="bg-white rounded-lg border border-blush-200 p-5 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {addr.label === "Home" ? (
                      <Home className="w-4 h-4 text-muted-600" />
                    ) : addr.label === "Office" ? (
                      <Briefcase className="w-4 h-4 text-muted-600" />
                    ) : (
                      <MapPin className="w-4 h-4 text-muted-600" />
                    )}
                    <span className="text-sm font-medium text-charcoal-900">
                      {addr.label || "Address"}
                    </span>
                    {addr.isDefault && (
                      <Badge variant="muted" size="sm">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(addr)}
                      className="p-1.5 rounded-md text-muted-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Edit address"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(addr.id)}
                      className="p-1.5 rounded-md text-muted-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-charcoal-700">
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.district}
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-500">
                    <Phone className="w-3.5 h-3.5" />
                    {addr.phone}
                  </p>
                </div>
              </motion.div>
            ))}

            <button
              type="button"
              onClick={openAdd}
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-blush-300 rounded-lg hover:border-rose-300 hover:bg-rose-50/30 transition-all min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center text-muted-500">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-600">
                Add New Address
              </span>
            </button>
          </div>

          {addresses.length === 0 && (
            <EmptyState
              icon={<MapPin className="w-12 h-12" />}
              title="No addresses saved"
              description="Add a shipping address to make checkout faster."
              action={{ label: "Add Address", onClick: openAdd }}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Label
                  </label>
                  <input
                    {...register("label")}
                    placeholder="e.g., Home, Office"
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register("fullName")}
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Phone *
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="+94XXXXXXXXX"
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    {...register("addressLine1")}
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-red-600 mt-1">{errors.addressLine1.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    {...register("addressLine2")}
                    className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register("city")}
                      className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">
                      District *
                    </label>
                    <input
                      {...register("district")}
                      className="w-full px-3 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.district && (
                      <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    {...register("isDefault")}
                    type="checkbox"
                    className="w-4 h-4 rounded border-blush-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-charcoal-700">Set as default address</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-blush-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : editingAddress ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-charcoal-900/50"
              onClick={() => setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                Delete Address?
              </h3>
              <p className="text-sm text-muted-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 border border-blush-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deletingId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
