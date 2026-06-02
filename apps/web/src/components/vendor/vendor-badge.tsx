"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function VendorBadge({ className, size = "sm" }: VendorBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full",
        "bg-muted-100 text-muted-700 font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className,
      )}
      title="Verified Artisan"
    >
      <Check className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      Verified Artisan
    </span>
  );
}
