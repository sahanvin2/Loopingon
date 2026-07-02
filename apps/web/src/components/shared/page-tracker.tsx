"use client";

import { Suspense } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

function PageTrackerInner() {
  useAnalytics();
  return null;
}

export function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerInner />
    </Suspense>
  );
}
