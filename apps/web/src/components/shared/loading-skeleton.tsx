"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant =
  | "card"
  | "product-card"
  | "list"
  | "detail"
  | "table-row"
  | "text"
  | "circle";

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted-200 rounded-md",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-lg bg-white border border-accent-300 overflow-hidden shadow-sm">
      <SkeletonPulse className="aspect-[4/5] w-full rounded-none" />
      <div className="p-3 space-y-3">
        <SkeletonPulse className="h-3 w-1/3" />
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-2/3" />
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-5 w-16" />
          <SkeletonPulse className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-accent-300 rounded-lg bg-white">
      <SkeletonPulse className="w-16 h-16 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-1/4" />
        <SkeletonPulse className="h-5 w-3/4" />
        <SkeletonPulse className="h-4 w-1/2" />
      </div>
      <SkeletonPulse className="h-9 w-24 rounded-lg shrink-0" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SkeletonPulse className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <SkeletonPulse className="h-5 w-1/4" />
          <SkeletonPulse className="h-8 w-3/4" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-5 w-5 rounded" />
            ))}
          </div>
          <SkeletonPulse className="h-10 w-1/3" />
          <SkeletonPulse className="h-20 w-full" />
          <SkeletonPulse className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-accent-200">
      <SkeletonPulse className="h-4 w-8" />
      <SkeletonPulse className="h-10 w-10 rounded-md shrink-0" />
      <SkeletonPulse className="h-4 flex-1" />
      <SkeletonPulse className="h-4 w-20" />
      <SkeletonPulse className="h-6 w-20 rounded-full" />
      <SkeletonPulse className="h-4 w-16" />
    </div>
  );
}

const variantMap: Record<SkeletonVariant, () => React.ReactElement> = {
  card: () => (
    <div className="rounded-lg bg-white border border-accent-300 p-6 shadow-sm space-y-4">
      <SkeletonText lines={3} />
    </div>
  ),
  "product-card": ProductCardSkeleton,
  list: ListSkeleton,
  detail: DetailSkeleton,
  "table-row": TableRowSkeleton,
  text: () => <SkeletonText lines={3} />,
  circle: () => <SkeletonPulse className="rounded-full w-12 h-12" />,
};

export function LoadingSkeleton({
  variant = "text",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const render = variantMap[variant];

  if (variant === "table-row" || variant === "list") {
    return (
      <div className={cn("space-y-3", className)} role="status" aria-label="Loading">
        {Array.from({ length: count }).map((_, i) => (
          <React.Fragment key={i}>{render()}</React.Fragment>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "product-card" || variant === "card"
          ? cn(
              "grid gap-6",
              "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            )
          : "space-y-6",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{render()}</React.Fragment>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
