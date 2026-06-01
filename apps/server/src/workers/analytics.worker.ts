import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "analytics";

interface AnalyticsJobData {
  date: string;
  vendors?: string[];
}

let analyticsQueue: Queue<AnalyticsJobData> | null = null;

export function getAnalyticsQueue(): Queue<AnalyticsJobData> {
  if (!analyticsQueue) {
    analyticsQueue = new Queue<AnalyticsJobData>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "fixed", delay: 30000 },
        removeOnComplete: { age: 86400 * 7 },
        removeOnFail: { age: 86400 * 30 },
      },
    });
  }
  return analyticsQueue;
}

const analyticsWorker = new Worker<AnalyticsJobData>(
  QUEUE_NAME,
  async (job: Job<AnalyticsJobData>) => {
    const dateStr = job.data.date || new Date().toISOString().split("T")[0];
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    logger.info(`Running daily analytics aggregation for ${dateStr}`);

    const vendorIds = job.data.vendors;
    const vendorWhere: any = { status: "VERIFIED", deletedAt: null };
    if (vendorIds && vendorIds.length > 0) {
      vendorWhere.id = { in: vendorIds };
    }

    const vendors = await prisma.vendor.findMany({
      where: vendorWhere,
      select: { id: true, storeName: true, commissionRate: true },
    });

    logger.info(`Aggregating analytics for ${vendors.length} vendors`);

    const platformStats = await aggregatePlatformStats(targetDate, nextDate, dateStr);
    logger.info(`Platform stats: orders=${platformStats.totalOrders} revenue=${platformStats.totalRevenue}`);

    for (const vendor of vendors) {
      try {
        const stats = await aggregateVendorStats(vendor.id, vendor.commissionRate, targetDate, nextDate, dateStr);

        await prisma.vendorAnalytics.upsert({
          where: {
            vendorId_date: {
              vendorId: vendor.id,
              date: targetDate,
            },
          },
          create: {
            vendorId: vendor.id,
            date: targetDate,
            views: stats.views,
            uniqueVisitors: stats.uniqueVisitors,
            orders: stats.orders,
            revenue: stats.revenue,
            commission: stats.commission,
            conversionRate: stats.conversionRate,
            avgOrderValue: stats.avgOrderValue,
          },
          update: {
            views: stats.views,
            uniqueVisitors: stats.uniqueVisitors,
            orders: stats.orders,
            revenue: stats.revenue,
            commission: stats.commission,
            conversionRate: stats.conversionRate,
            avgOrderValue: stats.avgOrderValue,
          },
        });

        logger.info(`Aggregated analytics for vendor ${vendor.storeName}`);
      } catch (error: any) {
        logger.error(`Failed to aggregate analytics for vendor ${vendor.storeName}: ${error.message}`);
      }
    }

    await storePlatformDailyStats(targetDate, platformStats);

    logger.info(`Completed daily analytics aggregation for ${dateStr}`);
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 1,
  }
);

analyticsWorker.on("failed", (job, err) => {
  logger.error(`Analytics job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

analyticsWorker.on("completed", (job) => {
  logger.info(`Analytics job ${job.id} completed`);
});

async function aggregateVendorStats(
  vendorId: string,
  commissionRate: number,
  targetDate: Date,
  nextDate: Date,
  dateStr: string
) {
  const [
    orders,
    revenueAgg,
    viewsCount,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        vendorId,
        createdAt: { gte: targetDate, lt: nextDate },
        status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] },
      },
    }),

    prisma.order.aggregate({
      where: {
        vendorId,
        createdAt: { gte: targetDate, lt: nextDate },
        status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] },
      },
      _sum: { totalAmount: true, commissionAmount: true },
    }),

    prisma.vendorAnalytics.aggregate({
      where: {
        vendorId,
        date: targetDate,
      },
      _sum: { views: true, uniqueVisitors: true },
    }),
  ]);

  const revenue = Number(revenueAgg._sum.totalAmount || 0);
  const commission = Number(revenueAgg._sum.commissionAmount || 0) || revenue * (commissionRate / 100);

  const views = viewsCount._sum.views || 0;
  const uniqueVisitors = viewsCount._sum.uniqueVisitors || 0;

  const conversionRate = views > 0 ? (orders / views) * 100 : 0;
  const avgOrderValue = orders > 0 ? revenue / orders : 0;

  return {
    views,
    uniqueVisitors,
    orders,
    revenue,
    commission,
    conversionRate: Math.round(conversionRate * 100) / 100,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
  };
}

async function aggregatePlatformStats(targetDate: Date, nextDate: Date, dateStr: string) {
  const [
    orders,
    revenueAgg,
    newUsers,
    newVendors,
    totalCustomers,
    totalVendors,
    totalProducts,
    totalRevenueAgg,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: targetDate, lt: nextDate },
        status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] },
      },
    }),

    prisma.order.aggregate({
      where: {
        createdAt: { gte: targetDate, lt: nextDate },
        status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] },
      },
      _sum: { totalAmount: true, commissionAmount: true },
    }),

    prisma.user.count({
      where: {
        createdAt: { gte: targetDate, lt: nextDate },
        role: "CUSTOMER",
        deletedAt: null,
      },
    }),

    prisma.vendor.count({
      where: {
        createdAt: { gte: targetDate, lt: nextDate },
        status: "VERIFIED",
        deletedAt: null,
      },
    }),

    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.vendor.count({ where: { status: "VERIFIED", deletedAt: null } }),
    prisma.product.count({ where: { status: "PUBLISHED", deletedAt: null } }),

    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    date: dateStr,
    totalOrders: orders,
    totalRevenue: Number(revenueAgg._sum.totalAmount || 0),
    totalCommission: Number(revenueAgg._sum.commissionAmount || 0),
    newUsers,
    newVendors,
    totalCustomers,
    totalVendors,
    totalProducts,
    lifetimeRevenue: Number(totalRevenueAgg._sum.totalAmount || 0),
  };
}

async function storePlatformDailyStats(targetDate: Date, stats: any) {
  await prisma.$executeRawUnsafe(`
    INSERT INTO system_settings (id, key, value, description, updated_at)
    VALUES (gen_random_uuid(), 'platform_daily_stats_${stats.date}', $1::jsonb, 'Platform daily statistics for ${stats.date}', NOW())
    ON CONFLICT (key) DO UPDATE SET value = $1::jsonb, updated_at = NOW()
  `, JSON.stringify(stats));
}

export async function runDailyAggregation(date?: string, vendorIds?: string[]) {
  const jobData: AnalyticsJobData = {
    date: date || new Date().toISOString().split("T")[0],
    vendors: vendorIds,
  };

  return getAnalyticsQueue().add("daily-aggregation", jobData, {
    jobId: `analytics-${jobData.date}`,
  });
}

export { analyticsWorker };
