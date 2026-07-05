import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export interface LoyaltyTier {
  name: string;
  label: string;
  minSpent: number;
  reward: number;
  color: string;
  icon: string;
  minPurchaseForRedemption: number;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "none",   label: "No Tier",   minSpent: 0,      reward: 0,      color: "gray",   icon: "⬜", minPurchaseForRedemption: 0 },
  { name: "bronze", label: "Bronze",     minSpent: 10000,  reward: 800,    color: "amber",  icon: "🥉", minPurchaseForRedemption: 0 },
  { name: "silver", label: "Silver",     minSpent: 25000,  reward: 2000,   color: "slate",  icon: "🥈", minPurchaseForRedemption: 0 },
  { name: "gold",   label: "Gold",       minSpent: 50000,  reward: 4000,   color: "yellow", icon: "🥇", minPurchaseForRedemption: 0 },
  { name: "elite",  label: "Elite",      minSpent: 200000, reward: 20000,  color: "purple", icon: "👑", minPurchaseForRedemption: 0 },
];

function calculateTier(totalSpent: number): { tier: LoyaltyTier; progress: number; nextTier: LoyaltyTier | null; remaining: number } {
  let current: LoyaltyTier = LOYALTY_TIERS[0];
  let next: LoyaltyTier | null = null;

  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    if (totalSpent >= LOYALTY_TIERS[i].minSpent) {
      current = LOYALTY_TIERS[i];
      next = i < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[i + 1] : null;
      break;
    }
  }

  const progress = next
    ? Math.min(100, Math.round(((totalSpent - current.minSpent) / (next.minSpent - current.minSpent)) * 100))
    : 100;
  const remaining = next ? next.minSpent - totalSpent : 0;

  return { tier: current, progress, nextTier: next, remaining };
}

export async function getBalance(userId: string) {
  let account = await prisma.loyaltyAccount.findUnique({ where: { userId } });

  if (!account) {
    account = await prisma.loyaltyAccount.create({ data: { userId } });
  }

  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  const totalSpent = Number(profile?.totalSpent || 0);

  if (Number(account.totalSpent) !== totalSpent) {
    account = await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: { totalSpent },
    });
  }

  const { tier, progress, nextTier, remaining } = calculateTier(totalSpent);

  const claimedTierIndex = LOYALTY_TIERS.findIndex(t => t.name === account.claimedTier);
  const currentTierIndex = LOYALTY_TIERS.findIndex(t => t.name === tier.name);
  const isClaimed = claimedTierIndex >= currentTierIndex && currentTierIndex > 0;

  return {
    totalSpent,
    tier,
    progress,
    nextTier,
    remaining,
    rewardBalance: Number(account.rewardBalance),
    claimed: isClaimed,
    claimedTier: account.claimedTier,
  };
}

export async function getHistory(userId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });

  if (!account) return buildPaginationResult([], 0, p, l);

  const [transactions, total] = await Promise.all([
    prisma.loyaltyTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.loyaltyTransaction.count({ where: { accountId: account.id } }),
  ]);

  return buildPaginationResult(transactions, total, p, l);
}

export async function claimReward(userId: string) {
  const balance = await getBalance(userId);

  if (balance.claimed) {
    throw new AppError("You have already claimed your reward for this tier", 400, "ALREADY_CLAIMED");
  }

  if (balance.tier.name === "none") {
    throw new AppError("You do not qualify for any loyalty tier yet", 400, "NO_TIER");
  }

  const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
  if (!account) throw new AppError("Loyalty account not found", 404, "LOYALTY_NOT_FOUND");

  const awardedTier = [...LOYALTY_TIERS].reverse().find(t => Number(account.totalSpent) >= t.minSpent);
  if (!awardedTier) throw new AppError("Tier not found", 400, "TIER_NOT_FOUND");

  await prisma.$transaction([
    prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: {
        rewardBalance: awardedTier.reward,
        claimedAt: new Date(),
        claimedTier: awardedTier.name,
      },
    }),
    prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id,
        amount: awardedTier.reward,
        type: "tier_claim",
        tier: awardedTier.name,
        description: `Claimed ${awardedTier.label} tier reward: Rs. ${awardedTier.reward.toLocaleString()} off`,
        reference: `claim_${awardedTier.name}_${Date.now()}`,
      },
    }),
  ]);

  return {
    success: true,
    reward: awardedTier.reward,
    tier: awardedTier.name,
    minPurchaseRequired: awardedTier.minPurchaseForRedemption || null,
  };
}

export async function getEligibleDiscount(userId: string) {
  const balance = await getBalance(userId);
  if (balance.claimed || balance.tier.name === "none") return { discount: 0, tier: null };
  return { discount: balance.tier.reward, tier: balance.tier.name };
}
