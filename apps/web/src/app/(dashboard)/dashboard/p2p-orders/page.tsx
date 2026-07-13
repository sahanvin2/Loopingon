"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Package, AlertCircle } from "lucide-react";
import { useP2POrders, P2P_STATUS_CONFIG, type P2POrder } from "@/hooks/use-p2p-orders";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import Link from "next/link";

const TABS = [
  { key: "", label: "All" },
  { key: "PENDING_PAYMENT", label: "Pending" },
  { key: "PAYMENT_SUBMITTED", label: "Processing" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "COMPLETED", label: "Completed" },
];

export default function P2POrdersPage() {
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useP2POrders({
    status: activeTab || undefined,
    page,
    limit: 10,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-900 font-sans">P2P Orders</h1>
        <p className="text-text-500 text-sm mt-1">Track your digital purchases and payments</p>
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
        <EmptyState title="No P2P orders found" description="Your digital purchases will appear here." icon={<Package className="w-8 h-8" />} />
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order: P2POrder) => {
              const config = P2P_STATUS_CONFIG[order.status] || P2P_STATUS_CONFIG.PENDING_PAYMENT;
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/p2p-orders/${order.id}`}
                  className="block bg-surface-100 rounded-xl p-4 shadow-soft-sm border border-surface-200 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text-900 truncate">{order.orderNumber}</p>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", config.bg, config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-500">
                        {order.items?.[0]?.productTitle || "Digital item"} • {order.items?.length || 0} item(s)
                      </p>
                      {order.expiresAt && order.status === "PENDING_PAYMENT" && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                          <Clock className="w-3 h-3" />
                          Expires {formatDateTime(order.expiresAt)}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-text-900">Rs. {formatPrice(Number(order.totalAmount))}</p>
                      <ChevronRight className="w-4 h-4 text-text-400 ml-auto mt-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </motion.div>
  );
}
