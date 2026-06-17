"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLoyaltyBalance } from "@/hooks/use-loyalty";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export function LoyaltyProgressBar() {
  const { isAuthenticated } = useAuthStore();
  const { data: balanceResponse, isLoading } = useLoyaltyBalance(isAuthenticated);

  if (!isAuthenticated || isLoading || !balanceResponse?.data) return null;

  const { tier, progress, nextTier, remaining } = balanceResponse.data;

  // If there is no next tier (elite level), just show the current tier
  if (!nextTier) {
    return (
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tier.icon}</span>
          <div>
            <p className="text-sm font-bold text-purple-900">You are an {tier.label} Member!</p>
            <p className="text-xs text-purple-700">You have reached the highest loyalty tier.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface-50 border border-accent-200 rounded-xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" title={tier.label}>{tier.icon}</span>
          <span className="text-sm font-bold text-text-900">{tier.label} Tier</span>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <span className="text-sm font-medium text-text-900">{nextTier.label}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-accent-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-500 to-indigo-500"
        />
      </div>

      <p className="text-xs text-muted-600 font-medium">
        Spend <span className="font-bold text-primary-700">{formatPrice(remaining)}</span> more to unlock <span className="font-bold text-text-900">{nextTier.label}</span> and earn a {formatPrice(nextTier.reward)} reward!
      </p>
    </div>
  );
}
