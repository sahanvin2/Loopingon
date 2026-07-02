import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../config/redis.js";

function createRedisStore() {
  // Use in-memory store when Redis is disabled
  return undefined;
}

export const generalLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] as string || "unknown";
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
      },
    });
  },
});

export const authLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] as string || "unknown";
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "AUTH_RATE_LIMIT",
        message: "Too many authentication attempts. Please try again after 15 minutes.",
      },
    });
  },
});

export const searchLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] as string || "unknown";
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many search requests. Please try again later.",
      },
    });
  },
});

export const apiLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] as string || "unknown";
  },
});
