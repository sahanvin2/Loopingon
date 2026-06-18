"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, TrendingUp, Gift, ChevronRight, Shield, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post } from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import type { ApiResponse } from "@/types";

interface LoyaltyBalance {
  totalSpent: number;
  tier: { name: string; label: string; reward: number; color: string; icon: string };
  progress: number;
  nextTier: { name: string; label: string; reward: number; minSpent: number } | null;
  remaining: number;
  rewardBalance: number;
  claimed: boolean;
  claimedTier: string | null;
}

const TIER_COLORS: Record<string, string> = {
  gray: "from-gray-300 to-gray-400 text-gray-800",
  amber: "from-amber-400 to-orange-500 text-amber-900",
  slate: "from-slate-300 to-slate-500 text-slate-900",
  yellow: "from-yellow-400 to-amber-500 text-yellow-900",
  purple: "from-purple-400 to-indigo-500 text-purple-900",
};

const TIER_BG: Record<string, string> = {
  gray: "bg-gray-50 border-gray-200",
  amber: "bg-amber-50 border-amber-200",
  slate: "bg-slate-50 border-slate-200",
  yellow: "bg-yellow-50 border-yellow-200",
  purple: "bg-purple-50 border-purple-200",
};

const ALL_TIERS = [
  { name: "none", label: "Free", minSpent: 0, reward: 0, icon: "⬜", color: "gray" },
  { name: "bronze", label: "Bronze", minSpent: 10000, reward: 2000, icon: "🥉", color: "amber" },
  { name: "silver", label: "Silver", minSpent: 25000, reward: 5000, icon: "🥈", color: "slate" },
  { name: "gold", label: "Gold", minSpent: 50000, reward: 10000, icon: "🥇", color: "yellow" },
  { name: "elite", label: "Elite", minSpent: 200000, reward: 50000, icon: "👑", color: "purple" },
];

export default function LoyaltyPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["loyalty"],
    queryFn: () => get<ApiResponse<LoyaltyBalance>>("/loyalty"),
  });

  const claimMutation = useMutation({
    mutationFn: () => post("/loyalty/claim"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });

  const balance = data?.data;
  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (!balance) return <p className="text-muted-500">No loyalty account</p>;

  const tier = balance.tier;
  const tierColor = TIER_COLORS[tier.color] || TIER_COLORS.gray;
  const tierBg = TIER_BG[tier.color] || TIER_BG.gray;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-text-900">Loyalty Program</h1>

      {/* Hero Tier Card */}
      <div className={cn("bg-white rounded-2xl border shadow-soft-lg overflow-hidden", tierBg.split(" ")[1])}>
        <div className={cn("bg-gradient-to-r p-6 sm:p-8 text-white", tierColor.replace("text-", ""))}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-80 uppercase tracking-wide">Your Tier</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl">{tier.icon}</span>
                <h2 className="text-3xl sm:text-4xl font-bold">{tier.label}</h2>
              </div>
            </div>
            {!balance.claimed && tier.name !== "none" && (
              <button
                type="button"
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-md flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                {claimMutation.isPending ? "Claiming..." : `Claim Rs. ${tier.reward.toLocaleString()} Off`}
              </button>
            )}
            {balance.claimed && (
              <div className="px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" /> Reward Claimed
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {balance.nextTier && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/70 mb-1.5">
                <span>{formatPrice(balance.totalSpent)} spent</span>
                <span>{formatPrice(balance.nextTier.minSpent)} for {balance.nextTier.label}</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${balance.progress}%` }}
                />
              </div>
              <p className="text-xs text-white/70 mt-1.5">
                {balance.remaining > 0
                  ? `${formatPrice(balance.remaining)} more to reach ${balance.nextTier.label}`
                  : "Maximum tier reached!"}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white/80">
          <div className="p-4 text-center">
            <p className="text-xs text-muted-500 uppercase mb-1">Total Spent</p>
            <p className="text-lg font-bold text-text-900">{formatPrice(balance.totalSpent)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-500 uppercase mb-1">Reward Value</p>
            <p className="text-lg font-bold text-green-600">{formatPrice(tier.reward)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-500 uppercase mb-1">Status</p>
            <p className="text-lg font-bold text-text-900">
              {balance.claimed ? `Claimed ${balance.claimedTier}` : "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="bg-white rounded-2xl border border-accent-200 p-6">
        <h2 className="text-xl font-bold text-text-900 mb-6">All Tiers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_TIERS.map((t) => (
            <div
              key={t.name}
              className={cn(
                "p-4 rounded-xl border text-center transition-all",
                tier.name === t.name
                  ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200"
                  : "border-accent-200 bg-surface-50",
              )}
            >
              <span className="text-2xl">{t.icon}</span>
              <h3 className="font-bold text-text-900 mt-1 text-sm">{t.label}</h3>
              <p className="text-xs text-muted-500 mt-1">
                {t.minSpent > 0 ? `Spend ${formatPrice(t.minSpent)}+` : "Free"}
              </p>
              {t.reward > 0 && (
                <p className="text-xs font-semibold text-green-600 mt-1">
                  Get {formatPrice(t.reward)} off
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-2xl border border-accent-200 p-6">
        <h2 className="text-xl font-bold text-text-900 mb-4">Program Rules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-900">Automatic Progression</p>
              <p className="text-xs text-muted-600">Your tier upgrades automatically as you spend more on Kandyam.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
            <Gift className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-900">Claim Your Reward</p>
              <p className="text-xs text-muted-600">Once you reach a tier, claim your cash reward for selected products.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
            <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-900">Post-Claim Reset</p>
              <p className="text-xs text-muted-600">After claiming, you start fresh. Shop again to earn your next tier.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
            <Crown className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-900">Elite Benefits</p>
              <p className="text-xs text-muted-600">Elite members get Rs. 50,000 off — usable on any product on the platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold Tier Minimum Purchase */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Gold Tier Redemption Rule</p>
          <p>Gold tier's Rs. 10,000 reward can only be applied to purchases of Rs. 90,000 or more. This ensures the reward is meaningful for both you and our sellers.</p>
        </div>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-muted-500 space-y-1">
        <p>
          Loyalty rewards are applicable on selected products only. Look for the green loyalty badge on product pages.
        </p>
        <p>
          After claiming a reward, your progress resets. New purchases will re-qualify you for tiers.
        </p>
      </div>
    </motion.div>
  );
}
