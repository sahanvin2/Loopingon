import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as paymentService from "../services/payment.service.js";
import { successResponse, createdResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/initiate",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.initiatePayment(
        req.body.orderId,
        req.user!.id,
        req.body.gateway,
        req.body.method
      );
      createdResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/payhere/notify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await paymentService.handlePayHereNotify(req.body);
      successResponse(res, { success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/payable/notify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await paymentService.handlePayableNotify(req.body);
      successResponse(res, { success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await paymentService.getPaymentStatus(req.query.paymentId as string);
      successResponse(res, payment);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:paymentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await paymentService.getPaymentStatus(req.params.paymentId);
      successResponse(res, payment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
