"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatVariant = "default" | "terracotta" | "gold" | "teal" | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
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
    iconBg: "bg-warm-gray-100",
    iconColor: "text-warm-gray-600",
    border: "border-cream-200",
  },
  terracotta: {
    iconBg: "bg-terracotta-100",
    iconColor: "text-terracotta-600",
    border: "border-terracotta-200",
  },
  gold: {
    iconBg: "bg-gold-100",
    iconColor: "text-gold-600",
    border: "border-gold-200",
  },
  amber: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  teal: {
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    border: "border-teal-200",
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
        <p className="text-sm text-warm-gray-500 font-medium">{title}</p>
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
              trend.isPositive ? "text-teal-600" : "text-red-600",
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
