import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as referralService from "../services/referral.service.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/code",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = await referralService.getReferralCode(req.user!.id);
      successResponse(res, code);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/history",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await referralService.getReferralHistory(req.user!.id);
      successResponse(res, history);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/earnings",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const earnings = await referralService.getReferralEarnings(req.user!.id);
      successResponse(res, earnings);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/process",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await referralService.processReferral(req.user!.id, req.body.referralCode);
      successResponse(res, { message: "Referral processed" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
