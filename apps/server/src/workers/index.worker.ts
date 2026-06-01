import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../config/database.js";
import { connectRedis, disconnectRedis } from "../config/redis.js";
import { logger } from "../middleware/errorHandler.middleware.js";

import { emailWorker, addVerificationEmailJob, addPasswordResetEmailJob, addOrderConfirmationJob, addShippingUpdateJob, addWelcomeEmailJob } from "./email.worker.js";
import { notificationWorker, addNotificationJob } from "./notification.worker.js";
import { imageWorker, addImageJob } from "./image.worker.js";
import { payoutWorker, schedulePayouts, schedulePayoutForVendor } from "./payout.worker.js";
import { analyticsWorker, runDailyAggregation } from "./analytics.worker.js";
import { sitemapWorker, regenerateSitemap } from "./sitemap.worker.js";

const WORKERS = {
  email: emailWorker,
  notification: notificationWorker,
  image: imageWorker,
  payout: payoutWorker,
  analytics: analyticsWorker,
  sitemap: sitemapWorker,
} as const;

let isShuttingDown = false;

async function startWorkers() {
  logger.info("Starting all workers...");

  await prisma.$connect();
  logger.info("Prisma connected");

  await connectRedis();
  logger.info("Redis connected");

  await Promise.all([
    emailWorker.waitUntilReady(),
    notificationWorker.waitUntilReady(),
    imageWorker.waitUntilReady(),
    payoutWorker.waitUntilReady(),
    analyticsWorker.waitUntilReady(),
    sitemapWorker.waitUntilReady(),
  ]);

  logger.info("All workers are ready");

  logger.info("Worker details:");
  logger.info(`  Email Worker       - concurrency: ${emailWorker.opts.concurrency || 5}`);
  logger.info(`  Notification Worker - concurrency: ${notificationWorker.opts.concurrency || 10}`);
  logger.info(`  Image Worker       - concurrency: ${imageWorker.opts.concurrency || 4}`);
  logger.info(`  Payout Worker      - concurrency: ${payoutWorker.opts.concurrency || 5}`);
  logger.info(`  Analytics Worker   - concurrency: ${analyticsWorker.opts.concurrency || 1}`);
  logger.info(`  Sitemap Worker     - concurrency: ${sitemapWorker.opts.concurrency || 1}`);
}

function setupScheduledJobs() {
  const payoutInterval = setInterval(async () => {
    const now = new Date();
    const day = now.getDate();

    if (day === 1 || day === 15) {
      logger.info(`Running scheduled payouts for ${now.toISOString().split("T")[0]}`);
      try {
        await schedulePayouts();
      } catch (error: any) {
        logger.error(`Scheduled payout failed: ${error.message}`);
      }
    }
  }, 60 * 60 * 1000);

  runPayoutCheck();

  const analyticsInterval = setInterval(async () => {
    const today = new Date().toISOString().split("T")[0];
    logger.info(`Running daily analytics aggregation for ${today}`);
    try {
      await runDailyAggregation(today);
    } catch (error: any) {
      logger.error(`Daily analytics aggregation failed: ${error.message}`);
    }
  }, 24 * 60 * 60 * 1000);

  const sitemapInterval = setInterval(async () => {
    logger.info("Running scheduled sitemap regeneration");
    try {
      await regenerateSitemap();
    } catch (error: any) {
      logger.error(`Sitemap regeneration failed: ${error.message}`);
    }
  }, 24 * 60 * 60 * 1000);

  return { payoutInterval, analyticsInterval, sitemapInterval };
}

async function runPayoutCheck() {
  const now = new Date();
  const day = now.getDate();
  if (day === 1 || day === 15) {
    logger.info(`Initial payout check on startup: ${now.toISOString().split("T")[0]}`);
    try {
      await schedulePayouts();
    } catch (error: any) {
      logger.error(`Initial payout check failed: ${error.message}`);
    }
  }
}

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${signal} received. Shutting down workers gracefully...`);

  const timeout = setTimeout(() => {
    logger.error("Forced shutdown after 30s timeout");
    process.exit(1);
  }, 30000);

  try {
    const closePromises = Object.entries(WORKERS).map(async ([name, worker]) => {
      try {
        await worker.close();
        logger.info(`${name} worker closed`);
      } catch (error: any) {
        logger.error(`Error closing ${name} worker: ${error.message}`);
      }
    });

    await Promise.allSettled(closePromises);

    await prisma.$disconnect();
    logger.info("Prisma disconnected");

    await disconnectRedis();
    logger.info("Redis disconnected");

    clearTimeout(timeout);
    logger.info("All workers shut down gracefully");
    process.exit(0);
  } catch (error: any) {
    logger.error(`Error during shutdown: ${error.message}`);
    clearTimeout(timeout);
    process.exit(1);
  }
}

startWorkers()
  .then(() => {
    setupScheduledJobs();

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    logger.info("Loopingon worker system is running");
  })
  .catch((err) => {
    logger.error("Failed to start workers:", err);
    process.exit(1);
  });

export {
  addVerificationEmailJob,
  addPasswordResetEmailJob,
  addOrderConfirmationJob,
  addShippingUpdateJob,
  addWelcomeEmailJob,
  addNotificationJob,
  addImageJob,
  schedulePayouts,
  schedulePayoutForVendor,
  runDailyAggregation,
  regenerateSitemap,
};
