import Redis from "ioredis";
import { logger } from "../middleware/errorHandler.middleware.js";

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        if (times > 10) {
          logger.error("Redis max retry attempts reached");
          return null;
        }
        return delay;
      },
      lazyConnect: false,
      enableOfflineQueue: true,
    });

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });
  }
  return redisClient;
}

export async function connectRedis(): Promise<Redis> {
  const client = getRedisClient();
  if (client.status !== "ready") {
    return new Promise((resolve, reject) => {
      client.once("ready", () => resolve(client));
      client.once("error", (err) => reject(err));
    });
  }
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export { type Redis };
