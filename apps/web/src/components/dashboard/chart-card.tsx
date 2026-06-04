"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  actions,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-accent-200 shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-accent-100">
        <div>
          <h3 className="text-sm font-semibold text-text-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
