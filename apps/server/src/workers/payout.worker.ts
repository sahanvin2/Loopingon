import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { payHereConfig } from "../config/payment.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "payout";

const MAX_RETRY_ATTEMPTS = 3;

interface PayoutJobData {
  vendorId: string;
  payoutScheduleId?: string;
  attempt: number;
}

let payoutQueue: Queue<PayoutJobData> | null = null;

export function getPayoutQueue(): Queue<PayoutJobData> {
  if (!payoutQueue) {
    payoutQueue = new Queue<PayoutJobData>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: MAX_RETRY_ATTEMPTS,
        backoff: { type: "exponential", delay: 60000 },
        removeOnComplete: { age: 86400 * 7 },
        removeOnFail: { age: 86400 * 30 },
      },
    });
  }
  return payoutQueue;
}

const payoutWorker = new Worker<PayoutJobData>(
  QUEUE_NAME,
  async (job: Job<PayoutJobData>) => {
    const { vendorId, payoutScheduleId, attempt } = job.data;
    logger.info(`Processing payout job ${job.id} vendor=${vendorId} attempt=${attempt || 1}`);

    const currentAttempt = attempt || job.attemptsStarted;

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId, deletedAt: null },
      include: {
        bankDetails: { where: { isPrimary: true, deletedAt: null }, take: 1 },
      },
    });

    if (!vendor) {
      throw new Error(`Vendor ${vendorId} not found`);
    }

    if (vendor.status !== "VERIFIED") {
      throw new Error(`Vendor ${vendor.storeName} is not verified`);
    }

    const bankDetail = vendor.bankDetails[0];
    if (!bankDetail) {
      throw new Error(`No primary bank details found for vendor ${vendor.storeName}`);
    }

    let payoutSchedule = payoutScheduleId
      ? await prisma.payoutSchedule.findUnique({ where: { id: payoutScheduleId } })
      : null;

    if (!payoutSchedule) {
      const now = new Date();
      const isFirstHalf = now.getDate() < 15;
      const periodStart = new Date(now.getFullYear(), now.getMonth(), isFirstHalf ? 1 : 15);
      const periodEnd = isFirstHalf
        ? new Date(now.getFullYear(), now.getMonth(), 14, 23, 59, 59)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const lastPayout = await prisma.payoutSchedule.findFirst({
        where: { vendorId, status: "COMPLETED" },
        orderBy: { periodEnd: "desc" },
      });

      const effectiveStart = lastPayout ? lastPayout.periodEnd : periodStart;

      const orders = await prisma.order.findMany({
        where: {
          vendorId,
          status: { in: ["DELIVERED", "COMPLETED"] },
          vendorPayoutStatus: null,
          deliveredAt: { gte: effectiveStart, lte: periodEnd },
        },
        include: { paymentTransactions: { take: 1, orderBy: { createdAt: "desc" } } },
      });

      if (orders.length === 0) {
        logger.info(`No orders to payout for vendor ${vendor.storeName}`);
        return;
      }

      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const totalCommission = orders.reduce((sum, o) => sum + Number(o.commissionAmount), 0);
      const refundAmount = orders
        .filter((o) => o.paymentStatus === "REFUNDED" || o.paymentStatus === "PARTIALLY_REFUNDED")
        .reduce((sum, o) => {
          const refund = o.paymentTransactions[0]?.refundAmount;
          return sum + (refund ? Number(refund) : 0);
        }, 0);

      const payoutAmount = totalRevenue - totalCommission - refundAmount;

      if (payoutAmount <= 0) {
        logger.info(`Payout amount is zero or negative for vendor ${vendor.storeName}`);
        return;
      }

      payoutSchedule = await prisma.payoutSchedule.create({
        data: {
          vendorId,
          periodStart: effectiveStart,
          periodEnd,
          totalOrders: orders.length,
          totalRevenue,
          totalCommission,
          payoutAmount,
          status: "PENDING",
          bankDetailUsed: bankDetail.id,
        },
      });

      await Promise.all(
        orders.map((order) =>
          prisma.order.update({
            where: { id: order.id },
            data: { vendorPayoutStatus: "PENDING" },
          })
        )
      );
    }

    try {
      const transferResult = await processBankTransfer(bankDetail, payoutSchedule);
      logger.info(`Bank transfer initiated for vendor ${vendor.storeName} amount=${payoutSchedule.payoutAmount}`);

      await prisma.$transaction([
        prisma.payoutSchedule.update({
          where: { id: payoutSchedule.id },
          data: {
            status: "PROCESSING",
            transactionId: transferResult.transactionId,
            notes: `Bank transfer initiated. Reference: ${transferResult.transactionId}`,
          },
        }),
        prisma.vendor.update({
          where: { id: vendorId },
          data: {
            pendingPayoutAmount: { decrement: Number(payoutSchedule.payoutAmount) },
            totalPayoutAmount: { increment: Number(payoutSchedule.payoutAmount) },
            lastPayoutDate: new Date(),
          },
        }),
      ]);

      setTimeout(async () => {
        try {
          await prisma.$transaction([
            prisma.payoutSchedule.update({
              where: { id: payoutSchedule!.id },
              data: {
                status: "COMPLETED",
                processedAt: new Date(),
                notes: `${payoutSchedule!.notes}\nPayout completed at ${new Date().toISOString()}`,
              },
            }),
            ...(
              await prisma.order.findMany({
                where: { vendorId, vendorPayoutStatus: "PENDING" },
              })
            ).map((order) =>
              prisma.order.update({
                where: { id: order.id },
                data: { vendorPayoutStatus: "COMPLETED" },
              })
            ),
          ]);

          logger.info(`Payout completed for vendor ${vendor.storeName}`);
        } catch (err: any) {
          logger.error(`Failed to finalize payout for vendor ${vendorId}: ${err.message}`);
        }
      }, 3000);
    } catch (error: any) {
      logger.error(`Bank transfer failed for vendor ${vendor.storeName}: ${error.message}`);

      if (currentAttempt >= MAX_RETRY_ATTEMPTS) {
        await prisma.payoutSchedule.update({
          where: { id: payoutSchedule.id },
          data: {
            status: "FAILED",
            notes: `Failed after ${currentAttempt} attempts: ${error.message}`,
          },
        });

        await prisma.order.updateMany({
          where: { vendorId, vendorPayoutStatus: "PENDING" },
          data: { vendorPayoutStatus: undefined },
        });

        logger.error(`Payout permanently failed for vendor ${vendor.storeName}`);
      }

      throw error;
    }

    logger.info(`Completed payout job ${job.id} for vendor ${vendor.storeName}`);
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 5,
    limiter: { max: 10, duration: 1000 },
  }
);

payoutWorker.on("failed", (job, err) => {
  logger.error(`Payout job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

payoutWorker.on("completed", (job) => {
  logger.info(`Payout job ${job.id} completed`);
});

async function processBankTransfer(
  bankDetail: {
    bankName: string;
    branchName: string;
    accountHolderName: string;
    accountNumber: string;
  },
  payoutSchedule: { id: string; payoutAmount: any }
): Promise<{ transactionId: string }> {
  if (payHereConfig.merchantId && payHereConfig.merchantSecret) {
    try {
      const crypto = await import("crypto");
      const timestamp = Date.now().toString();
      const hash = crypto
        .createHash("md5")
        .update(`${payHereConfig.merchantId}${bankDetail.accountNumber}${payoutSchedule.payoutAmount}LKR${timestamp}${payHereConfig.merchantSecret}`)
        .digest("hex")
        .toUpperCase();

      const response = await fetch(`${payHereConfig.baseUrl}/merchant/v1/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: payHereConfig.merchantId,
          payout_id: payoutSchedule.id,
          amount: Number(payoutSchedule.payoutAmount).toFixed(2),
          currency: "LKR",
          bank_code: bankDetail.bankName,
          branch_code: bankDetail.branchName,
          account_number: bankDetail.accountNumber,
          account_name: bankDetail.accountHolderName,
          hash,
          timestamp,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayHere payout API error: ${response.status} - ${errorText}`);
      }

      const result: any = await response.json();
      return { transactionId: result.payment_id || result.data?.payment_id || `PAYOUT_${Date.now()}` };
    } catch (error: any) {
      logger.error(`PayHere payout failed: ${error.message}`);
      throw error;
    }
  }

  return { transactionId: `MANUAL_PAYOUT_${payoutSchedule.id}_${Date.now()}` };
}

export async function schedulePayouts() {
  const vendors = await prisma.vendor.findMany({
    where: {
      status: "VERIFIED",
      deletedAt: null,
      pendingPayoutAmount: { gt: 0 },
    },
  });

  logger.info(`Scheduling payouts for ${vendors.length} vendors`);

  const jobs: Promise<any>[] = [];

  for (const vendor of vendors) {
    try {
      const job = await getPayoutQueue().add(`vendor-${vendor.id}`, {
        vendorId: vendor.id,
        attempt: 1,
      });
      jobs.push(job as any);
      logger.info(`Payout job scheduled for vendor ${vendor.storeName} (${vendor.id})`);
    } catch (error: any) {
      logger.error(`Failed to schedule payout for vendor ${vendor.id}: ${error.message}`);
    }
  }

  return jobs;
}

export async function schedulePayoutForVendor(vendorId: string) {
  return getPayoutQueue().add(`vendor-${vendorId}-manual`, {
    vendorId,
    attempt: 1,
  });
}

export { payoutWorker };
