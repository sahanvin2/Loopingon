"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatVariant = "default" | "rose" | "blush" | "muted" | "amber";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: StatVariant;
  className?: string;
}

const variantStyles: Record<StatVariant, { iconBg: string; iconColor: string; border: string }> = {
  default: {
    iconBg: "bg-muted-100",
    iconColor: "text-muted-600",
    border: "border-blush-200",
  },
  rose: {
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-200",
  },
  blush: {
    iconBg: "bg-blush-100",
    iconColor: "text-blush-600",
    border: "border-blush-200",
  },
  amber: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  muted: {
    iconBg: "bg-muted-100",
    iconColor: "text-muted-600",
    border: "border-muted-200",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-lg shadow-sm border p-5",
        "transition-shadow hover:shadow-soft",
        styles.border,
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-500 font-medium">{title}</p>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.iconBg)}>
          <Icon className={cn("w-5 h-5", styles.iconColor)} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-charcoal-900">{value}</span>

        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend.isPositive ? "text-muted-600" : "text-red-600",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
