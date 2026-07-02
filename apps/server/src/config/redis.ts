import { logger } from "../middleware/errorHandler.middleware.js";

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const mockClient = {
  get: async () => null,
  set: async () => "OK",
  setEx: async () => "OK",
  del: async () => 1,
  ping: async () => "PONG"
};

export function getRedisClient(): any {
  return mockClient;
}

export async function connectRedis(): Promise<any> {
  logger.info("Mock Redis connected");
  return mockClient;
}

export async function disconnectRedis(): Promise<void> {
  logger.info("Mock Redis disconnected");
}

export type Redis = any;
