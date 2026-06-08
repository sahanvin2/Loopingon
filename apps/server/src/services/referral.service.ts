import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { generateReferralCode } from "../utils/otp.js";

export async function getReferralCode(userId: string) {
  let referralCode = await prisma.referralCode.findUnique({ where: { userId } });

  if (!referralCode) {
    let code = generateReferralCode();
    let existing = await prisma.referralCode.findUnique({ where: { code } });
    while (existing) {
      code = generateReferralCode();
      existing = await prisma.referralCode.findUnique({ where: { code } });
    }

    referralCode = await prisma.referralCode.create({
      data: {
        userId,
        code,
      },
    });
  }

  return {
    ...referralCode,
    referralLink: `${process.env.FRONTEND_URL}/signup?ref=${referralCode.code}`,
  };
}

export async function getReferralHistory(userId: string) {
  const referralCode = await prisma.referralCode.findUnique({ where: { userId } });
  if (!referralCode) return { referrals: [], totalReferrals: 0, totalEarnings: 0 };

  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    include: {
      referredUser: { select: { id: true, fullName: true, avatar: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    referrals,
    totalReferrals: referralCode.totalReferrals,
    totalEarnings: referralCode.totalEarnings,
  };
}

export async function getReferralEarnings(userId: string) {
  const referralCode = await prisma.referralCode.findUnique({ where: { userId } });
  if (!referralCode) return { totalEarnings: 0 };

  return {
    totalEarnings: referralCode.totalEarnings,
    totalReferrals: referralCode.totalReferrals,
  };
}

export async function applyReferral(
  userId: string,
  data: { acceptedTerms: boolean; bankDetails: { bankName: string; accountHolderName: string; accountNumber: string; branch: string } },
) {
  let referralCode = await prisma.referralCode.findUnique({ where: { userId } });

  if (!referralCode) {
    let code = generateReferralCode();
    let existing = await prisma.referralCode.findUnique({ where: { code } });
    while (existing) {
      code = generateReferralCode();
      existing = await prisma.referralCode.findUnique({ where: { code } });
    }

    referralCode = await prisma.referralCode.create({
      data: {
        userId,
        code,
        status: "active",
        joinedAt: new Date(),
        acceptedTermsAt: new Date(),
        bankDetails: data.bankDetails as any,
      },
    });
  } else {
    referralCode = await prisma.referralCode.update({
      where: { userId },
      data: {
        status: "active",
        joinedAt: referralCode.joinedAt || new Date(),
        acceptedTermsAt: referralCode.acceptedTermsAt || new Date(),
        bankDetails: data.bankDetails as any,
      },
    });
  }

  return {
    code: referralCode.code,
    status: referralCode.status,
    referralLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/sign-up?ref=${referralCode.code}`,
  };
}

export async function processReferral(newUserId: string, referralCode: string) {
  const existingReferral = await prisma.referral.findUnique({ where: { referredUserId: newUserId } });
  if (existingReferral) return;

  const code = await prisma.referralCode.findUnique({ where: { code: referralCode } });
  if (!code) throw new AppError("Invalid referral code", 404, "INVALID_REFERRAL_CODE");

  await prisma.referral.create({
    data: {
      referrerId: code.userId,
      referredUserId: newUserId,
      referralCodeStr: referralCode,
      status: "pending",
    },
  });

  await prisma.referralCode.update({
    where: { id: code.id },
    data: { totalReferrals: { increment: 1 } },
  });
}
