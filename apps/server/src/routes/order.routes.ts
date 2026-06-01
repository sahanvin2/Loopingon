import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { createOrderSchema, cancelOrderSchema } from "../validators/order.validator.js";
import * as orderService from "../services/order.service.js";
import { successResponse, createdResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.createOrder(req.user!.id, req.body);
      createdResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:orderId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.getOrder(req.params.orderId);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:orderId/cancel",
  authenticate,
  validate(cancelOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.cancelOrder(req.params.orderId, req.user!.id, req.body.reason);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:orderId/return",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.returnOrder(req.params.orderId, req.user!.id, req.body.reason);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:orderId/dispute",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prisma } = await import("../config/database.js");
      const dispute = await prisma.orderDispute.create({
        data: {
          orderId: req.params.orderId,
          reason: req.body.reason,
          description: req.body.description,
          status: "PENDING",
        },
      });
      createdResponse(res, dispute);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:orderId/tracking",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.getOrder(req.params.orderId);
      successResponse(res, {
        status: order.status,
        shipments: order.shipments,
        statusHistory: order.statusHistory,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
