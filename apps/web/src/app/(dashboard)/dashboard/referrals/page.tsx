"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  DollarSign,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  UserPlus,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { get } from "@/lib/api-client";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import type { Referral, ReferralCode, ApiResponse, PaginatedResponse } from "@/types";

export default function ReferralsPage() {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: codeData } = useQuery({
    queryKey: ["referral-code"],
    queryFn: () => get<ApiResponse<ReferralCode>>("/referrals/code"),
  });

  const { data: summaryData } = useQuery({
    queryKey: ["referral-summary"],
    queryFn: () =>
      get<ApiResponse<{
        totalReferrals: number;
        successful: number;
        pending: number;
        totalEarnings: string;
      }>>("/referrals/summary"),
  });

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["referrals", "history"],
    queryFn: () =>
      get<PaginatedResponse<Referral>>("/referrals", { limit: 50 }),
  });

  const referralCode = codeData?.data;
  const summary = summaryData?.data;
  const referrals = historyData?.data || [];

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/sign-up?ref=${referralCode?.code || ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-text-900">Referrals</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Referrals"
          value={summary?.totalReferrals ?? 0}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Successful"
          value={summary?.successful ?? 0}
          icon={UserPlus}
          variant="muted"
        />
        <StatCard
          title="Pending"
          value={summary?.pending ?? 0}
          icon={Clock}
          variant="blush"
        />
        <StatCard
          title="Total Earnings"
          value={formatPrice(Number(summary?.totalEarnings || 0))}
          icon={DollarSign}
          variant="rose"
        />
      </div>

      {referralCode && (
        <div className="bg-gradient-to-r from-accent-400 to-accent-500 rounded-xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
          <div className="flex items-center gap-3">
            <code className="px-4 py-2 bg-white/20 rounded-lg text-2xl font-mono font-bold tracking-wider">
              {referralCode.code}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(referralCode.code)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              aria-label="Copy referral code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-accent-100 mt-2 break-all">
            {shareUrl}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=Join%20Loopingon,%20Sri%20Lanka's%20handcrafted%20marketplace!%20Use%20my%20code%20${referralCode.code}%20to%20get%20started.%20${shareUrl}`,
                  "_blank",
                );
              }}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                  "_blank",
                );
              }}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => handleCopy(shareUrl)}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h2 className="text-lg font-semibold text-text-900 mb-4">
          Referral History
        </h2>
        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={3} />
        ) : referrals.length === 0 ? (
          <EmptyState
            title="No referrals yet"
            description="Share your referral code to start earning rewards!"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-500 uppercase">
                    Reward
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {referrals.map((ref) => (
                  <tr key={ref.id}>
                    <td className="px-4 py-3 text-sm text-text-700">
                      {ref.referredUserId || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-500">
                      {formatDate(ref.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ref.status === "COMPLETED" ? "muted" : "amber"
                        }
                        size="sm"
                      >
                        {ref.status === "COMPLETED" ? "Completed" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-text-900">
                      {ref.rewardAmount
                        ? formatPrice(Number(ref.rewardAmount))
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setHowItWorksOpen(!howItWorksOpen)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <h2 className="text-lg font-semibold text-text-900">
            How It Works
          </h2>
          {howItWorksOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-500" />
          )}
        </button>
        {howItWorksOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="px-5 pb-5 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium text-text-900">Share Your Code</h4>
                <p className="text-sm text-muted-600">
                  Share your unique referral code with friends via WhatsApp,
                  Facebook, or by copying the link directly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium text-text-900">
                  Friends Sign Up & Shop
                </h4>
                <p className="text-sm text-muted-600">
                  When they sign up using your code and make their first purchase,
                  you both earn rewards.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium text-text-900">Earn Rewards</h4>
                <p className="text-sm text-muted-600">
                  You earn loyalty points or cash rewards for every successful
                  referral. The more you share, the more you earn!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
