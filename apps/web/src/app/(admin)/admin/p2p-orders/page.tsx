"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, Package, AlertCircle, Send, Ban,
  Timer, ChevronRight, Eye, Shield,
} from "lucide-react";
import {
  useP2PAdminOrders, useConfirmPayment, useDeliverItem,
  P2P_STATUS_CONFIG, type P2POrder,
} from "@/hooks/use-p2p-orders";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Btn({ children, className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "destructive"; size?: "sm" | "lg" | "md" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "text-xs px-3 py-1.5 gap-1" : size === "lg" ? "text-base px-8 py-4 gap-2" : "text-sm px-4 py-2.5 gap-1.5",
        variant === "outline" ? "border border-surface-300 text-text-700 hover:bg-surface-100 bg-surface-50" :
        variant === "ghost" ? "text-text-600 hover:bg-surface-100" :
        variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700" :
        "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-600/25",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const TABS = [
  { key: "", label: "All" },
  { key: "PENDING_PAYMENT", label: "Awaiting Payment" },
  { key: "PAYMENT_SUBMITTED", label: "To Confirm" },
  { key: "PAYMENT_CONFIRMED", label: "To Deliver" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "COMPLETED", label: "Completed" },
  { key: "DISPUTED", label: "Disputes" },
];

export default function AdminP2PPage() {
  const [activeTab, setActiveTab] = useState("PAYMENT_SUBMITTED");
  const [page, setPage] = useState(1);
  const [deliverModal, setDeliverModal] = useState<string | null>(null);
  const [deliverPayload, setDeliverPayload] = useState("");

  const router = useRouter();
  const { data, isLoading, isError } = useP2PAdminOrders({
    status: activeTab || undefined,
    page,
    limit: 20,
  });

  const confirmPayment = useConfirmPayment();
  const deliverItem = useDeliverItem();

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-900 font-sans">P2P Orders</h1>
          <p className="text-text-500 text-sm mt-1">Manage manual payment orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.key
                ? "bg-primary-600 text-white"
                : "bg-surface-200 text-text-600 hover:bg-surface-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : isError ? (
        <EmptyState title="Error loading orders" description="Please try again later." icon={<AlertCircle className="w-8 h-8" />} />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" description={`No orders with status: ${activeTab || "All"}`} icon={<Package className="w-8 h-8" />} />
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order: P2POrder) => {
              const config = P2P_STATUS_CONFIG[order.status] || P2P_STATUS_CONFIG.PENDING_PAYMENT;
              const isNearExpiry = order.expiresAt && order.status === "PENDING_PAYMENT" &&
                new Date(order.expiresAt).getTime() - Date.now() < 10 * 60 * 1000;

              return (
                <div key={order.id} className="bg-surface-100 rounded-xl p-5 shadow-soft-sm border border-surface-200">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => router.push(`/admin/p2p-orders/${order.id}`)}
                          className="text-sm font-medium text-text-900 hover:text-primary-600 truncate"
                        >
                          {order.orderNumber}
                        </button>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", config.bg, config.color)}>
                          {config.label}
                        </span>
                        {isNearExpiry && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600">
                            <Timer className="w-3 h-3 inline mr-1" /> Near Expiry
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-500">
                        Customer: {order.customer?.fullName || order.customerId} |
                        Vendor: {order.vendor?.storeName || order.vendorId}
                      </p>
                      <p className="text-xs text-text-500">
                        Order: {order.items?.[0]?.productTitle || "Digital item"} |
                        Ref: {order.referenceCode || "N/A"} |
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-900">Rs. {formatPrice(Number(order.totalAmount))}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {order.status === "PAYMENT_SUBMITTED" && (
                      <Btn
                        size="sm"
                        onClick={() => confirmPayment.mutate(order.id)}
                        disabled={confirmPayment.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Confirm Payment
                      </Btn>
                    )}
                    {order.status === "PAYMENT_CONFIRMED" && (
                      <>
                        {deliverModal === order.id ? (
                          <div className="w-full space-y-2">
                            <textarea
                              className="w-full border border-surface-300 rounded-lg p-2 text-sm min-h-[60px]"
                              placeholder="Enter credentials, license key, or digital content..."
                              value={deliverPayload}
                              onChange={(e) => setDeliverPayload(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Btn size="sm" onClick={() => {
                                deliverItem.mutate({ orderId: order.id, deliveredPayload: deliverPayload });
                                setDeliverModal(null);
                                setDeliverPayload("");
                              }} disabled={!deliverPayload.trim() || deliverItem.isPending}>
                                <Send className="w-3 h-3 mr-1" /> Deliver
                              </Btn>
                              <Btn size="sm" variant="outline" onClick={() => { setDeliverModal(null); setDeliverPayload(""); }}>
                                Cancel
                              </Btn>
                            </div>
                          </div>
                        ) : (
                          <Btn size="sm" onClick={() => setDeliverModal(order.id)}>
                            <Send className="w-3 h-3 mr-1" /> Deliver Item
                          </Btn>
                        )}
                      </>
                    )}
                    <Btn
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/p2p-orders/${order.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" /> View Details
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>

          {meta && meta.totalPages > 1 && (
            <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </motion.div>
  );
}
