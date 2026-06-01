import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../config/jwt.js";
import { prisma } from "../config/database.js";
import { AppError } from "./errorHandler.middleware.js";
import { getRedisClient } from "../config/redis.js";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  isActive: boolean;
  isVerified: boolean;
  avatar?: string | null;
  vendor?: {
    id: string;
    storeName: string;
    storeSlug: string;
    status: string;
    isVerified: boolean;
  } | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      currentToken?: TokenPayload;
    }
  }
}

async function findActiveUser(userId: string): Promise<AuthenticatedUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      role: true,
      fullName: true,
      isActive: true,
      avatar: true,
      vendor: {
        select: {
          id: true,
          storeName: true,
          storeSlug: true,
          status: true,
        },
      },
    },
  });

  if (!user || !user.isActive) return null;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    isActive: user.isActive,
    isVerified: user.emailVerified,
    avatar: user.avatar,
    vendor: user.vendor ? {
      id: user.vendor.id,
      storeName: user.vendor.storeName,
      storeSlug: user.vendor.storeSlug,
      status: user.vendor.status,
      isVerified: user.vendor.status === "VERIFIED",
    } : null,
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError("Authentication required. Please sign in.", 401, "UNAUTHORIZED");
    }

    const decoded = verifyAccessToken(token);

    const redis = getRedisClient();
    const isBlacklisted = await redis.get(`blacklist:${decoded.sub}:${token}`);
    if (isBlacklisted) {
      throw new AppError("Token has been revoked.", 401, "TOKEN_REVOKED");
    }

    const user = await findActiveUser(decoded.sub);
    if (!user) {
      throw new AppError("Account not found or deactivated.", 401, "USER_NOT_FOUND");
    }

    req.user = user;
    req.currentToken = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any)?.name === "TokenExpiredError") {
      return next(new AppError("Token has expired. Please sign in again.", 401, "TOKEN_EXPIRED"));
    }
    if ((error as any)?.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please sign in again.", 401, "INVALID_TOKEN"));
    }
    return next(new AppError("Authentication failed.", 401, "AUTH_FAILED"));
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);

    const redis = getRedisClient();
    const isBlacklisted = await redis.get(`blacklist:${decoded.sub}:${token}`);
    if (isBlacklisted) {
      return next();
    }

    const user = await findActiveUser(decoded.sub);
    if (user) {
      req.user = user;
      req.currentToken = decoded;
    }

    next();
  } catch {
    next();
  }
}

export async function requireVerified(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }
  if (!req.user.isVerified) {
    throw new AppError("Email verification required.", 403, "EMAIL_NOT_VERIFIED");
  }
  next();
}
