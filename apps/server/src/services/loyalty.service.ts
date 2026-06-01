import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

const TIER_THRESHOLDS: Record<string, number> = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000,
  diamond: 25000,
};

const POINTS_PER_LKR = 1;

export async function getBalance(userId: string) {
  let account = await prisma.loyaltyAccount.findUnique({ where: { userId } });

  if (!account) {
    account = await prisma.loyaltyAccount.create({
      data: { userId },
    });
  }

  let tier = "bronze";
  if (account.lifetimePoints >= TIER_THRESHOLDS.diamond) tier = "diamond";
  else if (account.lifetimePoints >= TIER_THRESHOLDS.platinum) tier = "platinum";
  else if (account.lifetimePoints >= TIER_THRESHOLDS.gold) tier = "gold";
  else if (account.lifetimePoints >= TIER_THRESHOLDS.silver) tier = "silver";

  if (tier !== account.tier) {
    account = await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: { tier },
    });
  }

  return {
    totalPoints: account.totalPoints,
    availablePoints: account.availablePoints,
    lifetimePoints: account.lifetimePoints,
    tier: account.tier,
    nextTier: tier === "diamond" ? null : { name: getNextTier(tier), pointsNeeded: getNextTierPoints(tier, account.lifetimePoints) },
  };
}

export async function getHistory(userId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);

  const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
  if (!account) {
    return buildPaginationResult([], 0, p, l);
  }

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

export async function redeemPoints(userId: string, rewardId: string) {
  const account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
  if (!account) throw new AppError("Loyalty account not found", 404, "LOYALTY_ACCOUNT_NOT_FOUND");

  const REWARDS: Record<string, { name: string; points: number; value: number }> = {
    discount_50: { name: "Rs. 50 Discount", points: 500, value: 50 },
    discount_100: { name: "Rs. 100 Discount", points: 1000, value: 100 },
    discount_250: { name: "Rs. 250 Discount", points: 2500, value: 250 },
    discount_500: { name: "Rs. 500 Discount", points: 5000, value: 500 },
    free_shipping: { name: "Free Shipping", points: 200, value: 0 },
  };

  const reward = REWARDS[rewardId];
  if (!reward) throw new AppError("Reward not found", 404, "REWARD_NOT_FOUND");

  if (account.availablePoints < reward.points) {
    throw new AppError("Insufficient points", 400, "INSUFFICIENT_POINTS");
  }

  await prisma.loyaltyAccount.update({
    where: { id: account.id },
    data: { availablePoints: { decrement: reward.points } },
  });

  await prisma.loyaltyTransaction.create({
    data: {
      accountId: account.id,
      points: -reward.points,
      type: "redeem",
      description: `Redeemed ${reward.name}`,
      reference: `redeem_${rewardId}`,
    },
  });

  return {
    success: true,
    reward,
    remainingPoints: account.availablePoints - reward.points,
  };
}

export async function earnPoints(userId: string, points: number, description: string, reference?: string) {
  let account = await prisma.loyaltyAccount.findUnique({ where: { userId } });
  if (!account) {
    account = await prisma.loyaltyAccount.create({ data: { userId } });
  }

  await prisma.loyaltyAccount.update({
    where: { id: account.id },
    data: {
      totalPoints: { increment: points },
      availablePoints: { increment: points },
      lifetimePoints: { increment: points },
    },
  });

  await prisma.loyaltyTransaction.create({
    data: {
      accountId: account.id,
      points,
      type: "earn",
      description,
      reference,
    },
  });

  await getBalance(userId);
}

function getNextTier(currentTier: string): string {
  const tiers = ["bronze", "silver", "gold", "platinum", "diamond"];
  const index = tiers.indexOf(currentTier);
  return index < tiers.length - 1 ? tiers[index + 1] : "diamond";
}

function getNextTierPoints(currentTier: string, currentPoints: number): number {
  const nextTier = getNextTier(currentTier);
  const threshold = TIER_THRESHOLDS[nextTier] || 0;
  return Math.max(0, threshold - currentPoints);
}
