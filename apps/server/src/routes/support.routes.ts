import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as supportService from "../services/support.service.js";
import { successResponse, paginatedResponse, createdResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/tickets",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await supportService.createTicket(
        req.user!.id,
        req.body.subject,
        req.body.category,
        req.body.description,
        req.body.orderId
      );
      createdResponse(res, ticket);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/tickets",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await supportService.getTickets(req.user!.id, page, limit);
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

router.get(
  "/tickets/:ticketId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await supportService.getTicketDetail(req.params.ticketId, req.user!.id);
      successResponse(res, ticket);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/tickets/:ticketId/replies",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reply = await supportService.addReply(
        req.params.ticketId,
        req.user!.id,
        req.body.content,
        req.body.attachments
      );
      createdResponse(res, reply);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
