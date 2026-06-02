"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Package,
  Tag,
  Settings,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { get, patch } from "@/lib/api-client";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Notification, PaginatedResponse, ApiResponse } from "@/types";

const tabs = [
  { key: "all", label: "All" },
  { key: "orders", label: "Orders" },
  { key: "promotions", label: "Promotions" },
  { key: "system", label: "System" },
];

const notificationIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ORDER: Package,
  PROMOTIONAL: Tag,
  SYSTEM: Settings,
};

const iconColors: Record<string, { bg: string; color: string }> = {
  ORDER: { bg: "bg-muted-100", color: "text-muted-600" },
  PROMOTIONAL: { bg: "bg-blush-100", color: "text-blush-600" },
  SYSTEM: { bg: "bg-muted-100", color: "text-muted-600" },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", activeTab, page],
    queryFn: () =>
      get<PaginatedResponse<Notification>>("/notifications", {
        page,
        limit: 20,
        type: activeTab !== "all" ? activeTab : undefined,
      }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => patch("/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal-900">Notifications</h1>
        <button
          type="button"
          onClick={() => markAllReadMutation.mutate()}
          disabled={markAllReadMutation.isPending}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      <div className="flex gap-1 bg-white rounded-lg border border-blush-200 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.key
                ? "bg-rose-600 text-white"
                : "text-muted-600 hover:text-charcoal-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="list" count={8} />
      ) : isError ? (
        <EmptyState
          title="Error loading notifications"
          description="Something went wrong. Please try again later."
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const typeCategory = notif.type?.includes("ORDER")
              ? "ORDER"
              : notif.type?.includes("PROMOTION")
                ? "PROMOTIONAL"
                : "SYSTEM";
            const Icon = notificationIconMap[typeCategory] || Bell;
            const { bg, color } = iconColors[typeCategory] || iconColors.SYSTEM;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "bg-white rounded-lg border p-4 flex items-start gap-3 transition-colors",
                  notif.isRead ? "border-blush-200" : "bg-cream-50 border-blush-300",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    bg,
                  )}
                >
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-charcoal-900">
                      {notif.title}
                    </p>
                    <span className="text-xs text-muted-500 whitespace-nowrap">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-600 mt-0.5">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => markReadMutation.mutate(notif.id)}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </motion.div>
  );
}
