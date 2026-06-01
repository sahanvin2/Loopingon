import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { getRedisClient } from "../config/redis.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/db",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      successResponse(res, { database: "connected", status: "healthy" });
    } catch (err) {
      res.status(503).json({
        success: false,
        error: {
          code: "DB_DISCONNECTED",
          message: "Database connection failed",
        },
      });
    }
  }
);

router.get(
  "/redis",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedisClient();
      await redis.ping();
      successResponse(res, { redis: "connected", status: "healthy" });
    } catch (err) {
      res.status(503).json({
        success: false,
        error: {
          code: "REDIS_DISCONNECTED",
          message: "Redis connection failed",
        },
      });
    }
  }
);

router.get(
  "/memory",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const memUsage = process.memoryUsage();
      successResponse(res, {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        unit: "MB",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
