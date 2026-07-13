import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import toast from "react-hot-toast";

// Types
export type P2POrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_CONFIRMED"
  | "DELIVERED"
  | "COMPLETED"
  | "EXPIRED"
  | "DISPUTED"
  | "CANCELLED";

export interface P2POrderEvent {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  actor: string;
  actorId: string | null;
  note: string | null;
  createdAt: string;
}

export interface P2POrder {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  status: P2POrderStatus;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  referenceCode: string | null;
  paymentProofUrl: string | null;
  deliveredPayload: string | null;
  expiresAt: string | null;
  disputeReason: string | null;
  disputeResolvedAt: string | null;
  disputeResolution: string | null;
  paymentSubmittedAt: string | null;
  paymentTimeoutMinutes?: number;
  createdAt: string;
  items: P2POrderItem[];
  orderEvents: P2POrderEvent[];
  customer?: { id: string; email: string; fullName: string; avatar: string | null };
  vendor?: { id: string; storeName: string; storeSlug: string };
}

export interface P2POrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string | null;
  price: string;
  quantity: number;
  totalPrice: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  instructions: string;
}

// Status display mapping
export const P2P_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: "Awaiting Payment", color: "text-yellow-600", bg: "bg-yellow-100" },
  PAYMENT_SUBMITTED: { label: "Payment Submitted", color: "text-blue-600", bg: "bg-blue-100" },
  PAYMENT_CONFIRMED: { label: "Payment Confirmed", color: "text-indigo-600", bg: "bg-indigo-100" },
  DELIVERED: { label: "Delivered", color: "text-green-600", bg: "bg-green-100" },
  COMPLETED: { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-100" },
  EXPIRED: { label: "Expired", color: "text-gray-600", bg: "bg-gray-100" },
  DISPUTED: { label: "Disputed", color: "text-red-600", bg: "bg-red-100" },
  CANCELLED: { label: "Cancelled", color: "text-gray-600", bg: "bg-gray-100" },
};

export const P2P_STEPS = [
  "PENDING_PAYMENT",
  "PAYMENT_SUBMITTED",
  "PAYMENT_CONFIRMED",
  "DELIVERED",
  "COMPLETED",
] as const;

// Queries
export function useP2POrders(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["p2p-orders", params],
    queryFn: () => get<PaginatedResponse<P2POrder>>("/p2p", params),
  });
}

export function useP2PAdminOrders(params?: { status?: string; vendorId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["p2p-admin-orders", params],
    queryFn: () => get<PaginatedResponse<P2POrder>>("/p2p/admin", params),
  });
}

export function useP2POrder(id: string) {
  return useQuery({
    queryKey: ["p2p-order", id],
    queryFn: () => get<ApiResponse<P2POrder>>(`/p2p/${id}`),
  });
}

export function useBankDetails() {
  return useQuery({
    queryKey: ["p2p-bank-details"],
    queryFn: () => get<ApiResponse<BankDetails>>("/p2p/bank-details"),
    staleTime: Infinity,
  });
}

// Mutations
export function useCreateP2POrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { vendorId: string; items: Array<{ productId: string; quantity: number }>; customerNotes?: string }) =>
      post<ApiResponse<{ order: P2POrder; expiresAt: string; referenceCode: string }>>("/p2p", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
    },
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentProofUrl }: { orderId: string; paymentProofUrl?: string }) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/pay`, { paymentProofUrl }),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
      toast.success("Payment submitted! Waiting for seller confirmation.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit payment");
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/confirm`),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
      queryClient.invalidateQueries({ queryKey: ["p2p-admin-orders"] });
      toast.success("Payment confirmed!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to confirm payment");
    },
  });
}

export function useDeliverItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, deliveredPayload }: { orderId: string; deliveredPayload: string }) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/deliver`, { deliveredPayload }),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
      queryClient.invalidateQueries({ queryKey: ["p2p-admin-orders"] });
      toast.success("Item delivered!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to deliver item");
    },
  });
}

export function useCompleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/complete`),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
      toast.success("Order completed!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to complete order");
    },
  });
}

export function useDisputeOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/dispute`, { reason }),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["p2p-orders"] });
      toast.success("Dispute raised. Admin will review it.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to raise dispute");
    },
  });
}

export function useExtendTimer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, additionalMinutes }: { orderId: string; additionalMinutes: number }) =>
      post<ApiResponse<P2POrder>>(`/p2p/${orderId}/extend`, { additionalMinutes }),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["p2p-order", orderId] });
      toast.success("Timer extended!");
    },
  });
}
