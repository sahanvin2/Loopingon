"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

interface EligibleDiscount {
  discount: number;
  tier: string | null;
}

export function useLoyaltyDiscount() {
  return useQuery({
    queryKey: ["loyalty", "discount"],
    queryFn: () => get<ApiResponse<EligibleDiscount>>("/loyalty/discount"),
    staleTime: 60 * 1000,
    retry: false,
  });
}
