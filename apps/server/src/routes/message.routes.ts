import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as messageService from "../services/message.service.js";
import { successResponse, paginatedResponse, createdResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/threads",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await messageService.getThreads(req.user!.id, page, limit);
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
  "/threads",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const thread = await messageService.createThread(
        req.user!.id,
        req.body.participantId,
        req.body.subject,
        req.body.orderId
      );
      createdResponse(res, thread);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/threads/:threadId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await messageService.getThread(req.params.threadId, req.user!.id, page, limit);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/threads/:threadId/messages",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await messageService.sendMessage(
        req.params.threadId,
        req.user!.id,
        req.body.content,
        req.body.attachments
      );
      createdResponse(res, message);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/threads/:threadId/read",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await messageService.markThreadRead(req.params.threadId, req.user!.id);
      successResponse(res, { message: "Thread marked as read" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
