import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireVendor } from "../middleware/rbac.middleware.js";
import * as analyticsService from "../services/analytics.service.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/public",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await analyticsService.getPublicStats();
      successResponse(res, stats);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/vendor",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query.period as "7d" | "30d" | "90d" | "1y") || "30d";
      const analytics = await analyticsService.getVendorAnalytics(req.user!.vendor!.id, period);
      successResponse(res, analytics);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
