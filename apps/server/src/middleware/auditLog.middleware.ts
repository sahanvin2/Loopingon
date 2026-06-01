import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../config/database.js";
import { logger } from "./errorHandler.middleware.js";

interface AuditLogOptions {
  entity: string;
  entityId?: (req: Request) => string;
  action: string;
  oldValue?: (req: Request) => Record<string, unknown>;
  newValue?: (req: Request) => Record<string, unknown>;
  description?: (req: Request) => string;
}

export function auditLog(options: AuditLogOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown) {
      const statusCode = res.statusCode;

      setImmediate(async () => {
        try {
          const auditData: Record<string, unknown> = {
            action: options.action,
            entity: options.entity,
            entityId: options.entityId ? options.entityId(req) : req.params.id || null,
            userId: req.user?.id || null,
            ipAddress: req.ip || req.headers["x-forwarded-for"] as string || null,
            userAgent: req.headers["user-agent"] || null,
            metadata: {
              method: req.method,
              url: req.originalUrl,
              statusCode,
            },
          };

          if (options.oldValue) {
            auditData.oldValue = options.oldValue(req);
          }

          if (options.newValue) {
            auditData.newValue = options.newValue(req);
          } else if (req.method !== "GET" && req.method !== "DELETE") {
            auditData.newValue = req.body;
          }

          if (options.description) {
            auditData.description = options.description(req);
          }

          await prisma.auditLog.create({
            data: {
              action: auditData.action as string,
              entity: auditData.entity as string,
              entityId: auditData.entityId as string | null,
              userId: auditData.userId as string | null,
              ipAddress: auditData.ipAddress as string | null,
              userAgent: auditData.userAgent as string | null,
              metadata: auditData.metadata as any,
              oldValue: (auditData.oldValue as any) || undefined,
              newValue: (auditData.newValue as any) || undefined,
            },
          });
        } catch (error) {
          logger.error("Failed to create audit log:", error);
        }
      });

      return originalJson(body);
    };

    next();
  };
}

export async function createAuditLogEntry(
  data: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    description?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        userId: data.userId || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        oldValue: data.oldValue as any || undefined,
        newValue: data.newValue as any || undefined,
        metadata: data.metadata as any || undefined,
      },
    });
  } catch (error) {
    logger.error("Failed to create audit log entry:", error);
  }
}
