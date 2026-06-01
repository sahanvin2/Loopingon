import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as notificationService from "../services/notification.service.js";
import { successResponse, paginatedResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const type = req.query.type as string | undefined;
      const result = await notificationService.getNotifications(req.user!.id, page, limit, type);
      paginatedResponse(res, result.data, {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.hasNext,
        hasPreviousPage: result.pagination.hasPrevious,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/read-all",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await notificationService.markAllRead(req.user!.id);
      successResponse(res, { message: "All notifications marked as read" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:notificationId/read",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await notificationService.markRead(req.params.notificationId, req.user!.id);
      successResponse(res, { message: "Notification marked as read" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/settings",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await notificationService.updateSettings(req.user!.id, req.body);
      successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
