import { Request, Response, NextFunction } from "express";
import { logAction } from "../services/audit.service.js";
import { User } from "@prisma/client";

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only log state-changing requests
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return next();
  }

  // Hook into response finish event to ensure the action succeeded before logging
  res.on("finish", () => {
    // Only log successful actions
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const user = req.user as any;
      let action = method;
      let entity = "UNKNOWN";

      // Best-effort extraction of entity from URL path
      // e.g. /api/v1/admin/vendors/:id -> ["admin", "vendors", ":id"]
      const parts = req.originalUrl.split("?")[0].split("/").filter(Boolean);
      const adminIndex = parts.indexOf("admin");

      if (adminIndex !== -1 && parts.length > adminIndex + 1) {
        entity = parts[adminIndex + 1].toUpperCase();
        if (parts.length > adminIndex + 2) {
          action = `${method}_${parts[adminIndex + 2].toUpperCase()}`;
        }
      }

      logAction({
        userId: user?.id,
        action,
        entity,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "Unknown",
        metadata: {
          method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          // We avoid logging the whole req.body as it might contain sensitive data like passwords
        },
      }).catch((err) => {
        console.error("Failed to log audit action:", err);
      });
    }
  });

  next();
}
