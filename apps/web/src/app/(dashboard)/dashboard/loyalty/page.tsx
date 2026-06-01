"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, Gem, TrendingUp, Gift } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get, post } from "@/lib/api-client";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { LoyaltyAccount, LoyaltyTransaction, ApiResponse, PaginatedResponse } from "@/types";

const tierInfo: Record<string, { next: string; min: number; color: string; icon: string }> = {
  Bronze: { next: "Silver", min: 500, color: "bg-amber-100 text-amber-700", icon: "🥉" },
  Silver: { next: "Gold", min: 2000, color: "bg-charcoal-100 text-charcoal-700", icon: "🥈" },
  Gold: { next: "Platinum", min: 5000, color: "bg-gold-100 text-gold-700", icon: "🥇" },
  Platinum: { next: "", min: 10000, color: "bg-purple-100 text-purple-700", icon: "💎" },
};

const earnRules = [
  "1 point for every Rs. 100 spent on purchases",
  "50 bonus points for writing a verified product review",
  "100 bonus points for each successful referral",
  "Double points during special promotion periods",
  "100 bonus points on your birthday month",
];

const redeemOptions = [
  { points: 500, label: "5% Discount Coupon", description: "Get 5% off your next order" },
  { points: 1000, label: "10% Discount Coupon", description: "Get 10% off your next order" },
  { points: 300, label: "Free Shipping", description: "Free shipping on any order" },
  { points: 2000, label: "Rs. 500 Gift Card", description: "Rs. 500 off any purchase" },
];

export default function LoyaltyPage() {
  const queryClient = useQueryClient();

  const { data: accountData, isLoading } = useQuery({
    queryKey: ["loyalty"],
    queryFn: () => get<ApiResponse<LoyaltyAccount>>("/loyalty"),
  });

  const { data: historyData } = useQuery({
    queryKey: ["loyalty", "transactions"],
    queryFn: () =>
      get<PaginatedResponse<LoyaltyTransaction>>("/loyalty/transactions", {
        limit: 50,
      }),
  });

  const redeemMutation = useMutation({
    mutationFn: (points: number) =>
      post("/loyalty/redeem", { points }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });

  const account = accountData?.data;
  const transactions = historyData?.data || [];
  const tier = account?.tier || "Bronze";
  const tierData = tierInfo[tier] || tierInfo.Bronze;
  const currentPoints = account?.availablePoints || 0;

  const pointsToNext = tierData.next
    ? Math.max(0, tierData.min - (account?.lifetimePoints || 0))
    : 0;
  const tierProgress = tierData.next
    ? Math.min(100, ((account?.lifetimePoints || 0) / tierData.min) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-charcoal-900">Loyalty Points</h1>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : !account ? (
        <EmptyState
          title="No loyalty account"
          description="Start earning points with your first purchase!"
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-cream-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-warm-gray-500">Available Points</p>
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-gold-500" />
                  <span className="text-3xl font-bold text-charcoal-900">
                    {currentPoints.toLocaleString()}
                  </span>
                </div>
              </div>
              <Badge
                variant={tier === "Gold" || tier === "Platinum" ? "gold" : "gray"}
                size="md"
                className={cn("text-lg px-4 py-2", tierData.color)}
              >
                {tierData.icon} {tier}
              </Badge>
            </div>

            {tierData.next && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-warm-gray-500">
                    Progress to {tierData.next}
                  </span>
                  <span className="text-xs font-medium text-warm-gray-600">
                    {pointsToNext.toLocaleString()} points needed
                  </span>
                </div>
                <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-terracotta-500 rounded-full transition-all"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-cream-200 p-6">
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
                Points History
              </h2>
              {transactions.length === 0 ? (
                <p className="text-sm text-warm-gray-500 text-center py-8">
                  No points transactions yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-200 text-left">
                        <th className="px-3 py-3 text-xs font-semibold text-warm-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold text-warm-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold text-warm-gray-500 uppercase text-right">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-3 py-3 text-xs text-warm-gray-500 whitespace-nowrap">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="px-3 py-3 text-sm text-charcoal-700">
                            {tx.description}
                          </td>
                          <td className="px-3 py-3 text-sm font-medium text-right whitespace-nowrap">
                            <span
                              className={cn(
                                tx.type === "EARN" || tx.points > 0
                                  ? "text-teal-600"
                                  : "text-red-600",
                              )}
                            >
                              {tx.points > 0 ? "+" : ""}
                              {tx.points}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-cream-200 p-6">
                <h2 className="text-lg font-semibold text-charcoal-900 mb-3">
                  How to Earn Points
                </h2>
                <ul className="space-y-2">
                  {earnRules.map((rule, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-charcoal-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-cream-200 p-6">
                <h2 className="text-lg font-semibold text-charcoal-900 mb-4">
                  Redeem Points
                </h2>
                <div className="space-y-3">
                  {redeemOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-cream-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">
                          {opt.label}
                        </p>
                        <p className="text-xs text-warm-gray-500">
                          {opt.description}
                        </p>
                        <Badge variant="gold" size="sm" className="mt-1">
                          {opt.points.toLocaleString()} pts
                        </Badge>
                      </div>
                      <button
                        type="button"
                        onClick={() => redeemMutation.mutate(opt.points)}
                        disabled={
                          currentPoints < opt.points || redeemMutation.isPending
                        }
                        className="px-4 py-2 bg-terracotta-600 text-white rounded-lg text-sm font-medium hover:bg-terracotta-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {redeemMutation.isPending
                          ? "Redeeming..."
                          : "Redeem"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
