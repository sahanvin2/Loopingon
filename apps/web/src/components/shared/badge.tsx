"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "rose"
  | "blush"
  | "muted"
  | "green"
  | "red"
  | "amber"
  | "gray"
  | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  rose: "bg-rose-100 text-rose-700",
  blush: "bg-blush-100 text-blush-700",
  muted: "bg-muted-100 text-muted-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  gray: "bg-charcoal-100 text-charcoal-700",
  outline: "border border-muted-300 text-muted-700 bg-transparent",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  variant = "rose",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
