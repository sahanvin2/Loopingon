"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
  maxItems?: number;
}

export function ActivityFeed({
  items,
  className,
  maxItems,
}: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className={cn("space-y-0", className)}>
      {displayItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-3 relative pb-4 last:pb-0"
        >
          {index < displayItems.length - 1 && (
            <div className="absolute left-[19px] top-10 w-px h-[calc(100%+0.25rem)] bg-cream-200" />
          )}

          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10",
              item.iconBg || "bg-warm-gray-100",
            )}
          >
            <item.icon className={cn("w-4 h-4", item.iconColor || "text-warm-gray-600")} />
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm text-charcoal-700">
              <span className="font-medium">{item.title}</span>
              {" "}{item.description}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-warm-gray-500">
                {formatRelativeTime(item.timestamp)}
              </span>
              {item.action && (
                <button
                  type="button"
                  onClick={item.action.onClick}
                  className="text-xs font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors"
                >
                  {item.action.label}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {displayItems.length === 0 && (
        <p className="text-sm text-warm-gray-500 text-center py-8">
          No recent activity
        </p>
      )}
    </div>
  );
}
