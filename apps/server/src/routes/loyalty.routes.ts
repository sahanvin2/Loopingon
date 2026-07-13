import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as loyaltyService from "../services/loyalty.service.js";
import { successResponse, paginatedResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balance = await loyaltyService.getBalance(req.user!.id);
      successResponse(res, balance);
    } catch (err) {
      next(err);
    }
  },
);

// Alias for frontend compatibility
router.get(
  "/balance",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balance = await loyaltyService.getBalance(req.user!.id);
      successResponse(res, balance);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/transactions",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await loyaltyService.getHistory(req.user!.id, page, limit);
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
  },
);

router.post(
  "/claim",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await loyaltyService.claimReward(req.user!.id);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/discount",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const discount = await loyaltyService.getEligibleDiscount(req.user!.id);
      successResponse(res, discount);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
