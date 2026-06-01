import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import * as couponService from "../services/coupon.service.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/validate",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await couponService.validateCoupon(
        req.body.code,
        req.body.cartTotal || 0,
        req.user?.id || ""
      );
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/apply",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await couponService.applyCoupon(req.body.code, req.body.orderId, req.user!.id);
      successResponse(res, { message: "Coupon applied successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
