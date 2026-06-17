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

export interface LoyaltyBalance {
  totalSpent: number;
  tier: { name: string; label: string; reward: number; color: string; icon: string };
  progress: number;
  nextTier: { name: string; label: string; minSpent: number; reward: number } | null;
  remaining: number;
  rewardBalance: number;
  claimed: boolean;
}

export function useLoyaltyBalance(isAuthenticated: boolean = true) {
  return useQuery({
    queryKey: ["loyalty", "balance"],
    queryFn: () => get<ApiResponse<LoyaltyBalance>>("/loyalty/balance"),
    staleTime: 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  });
}
