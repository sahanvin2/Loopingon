import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { prisma } from "./config/database.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { logger } from "./middleware/errorHandler.middleware.js";
import { setupCartCron } from "./workers/cart.worker.js";

const PORT = parseInt(process.env.PORT || "4000", 10);
const HOST = process.env.HOST || "0.0.0.0";

async function main() {
  await prisma.$connect();
  logger.info("Prisma connected");

  await connectRedis();
  logger.info("Redis connected");

  try {
    await setupCartCron();
  } catch (err) {
    logger.error("Failed to setup cart cron job", err);
  }

  const app = createApp();

  const server = app.listen(PORT, HOST, () => {
    logger.info(`Kandyam server running on http://${HOST}:${PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await prisma.$disconnect();
        logger.info("Prisma disconnected");
      } catch (err) {
        logger.error("Error disconnecting Prisma", err);
      }
      try {
        await disconnectRedis();
        logger.info("Redis disconnected");
      } catch (err) {
        logger.error("Error disconnecting Redis", err);
      }
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after 15s timeout");
      process.exit(1);
    }, 15000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
