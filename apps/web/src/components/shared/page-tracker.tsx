"use client";

import { Suspense } from "react";
import { usePageView } from "@/hooks/use-analytics";

function PageTrackerInner() {
  usePageView();
  return null;
}

export function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerInner />
    </Suspense>
  );
}
