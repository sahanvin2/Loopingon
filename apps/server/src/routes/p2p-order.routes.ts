import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { z } from "zod";
import * as p2pService from "../services/p2p-order.service.js";
import { successResponse, createdResponse } from "../utils/response.js";

const router = Router();

// All routes require auth
router.use(authenticate);

// Schemas
const createOrderSchema = z.object({
  vendorId: z.string().uuid().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  customerNotes: z.string().max(500).optional(),
});

const submitPaymentSchema = z.object({
  paymentProofUrl: z.string().url().optional(),
});

const deliverItemSchema = z.object({
  deliveredPayload: z.string().min(1).max(5000),
});

const disputeSchema = z.object({
  reason: z.string().min(10).max(1000),
});

const resolveDisputeSchema = z.object({
  resolution: z.enum(["revert", "complete", "cancel"]),
  note: z.string().max(500).optional(),
});

const extendTimerSchema = z.object({
  additionalMinutes: z.number().int().min(1).max(120),
});

// POST /api/v1/p2p/orders - Create order
router.post("/", validate(createOrderSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await p2pService.createOrder({
      customerId: userId,
      ...req.body,
    });
    createdResponse(res, result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/p2p/orders - List orders for current user
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    const { status, page, limit } = req.query;
    const result = await p2pService.getOrdersForUser(userId, role, {
      status: status as any,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });
    successResponse(res, result.orders, result.meta);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/p2p/orders/admin - Admin: list all orders
router.get("/admin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = (req as any).user;
    if (!["SUPER_ADMIN", "ADMIN", "SUPPORT"].includes(role)) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "Access denied" } });
      return;
    }
    const { status, vendorId, customerId, page, limit } = req.query;
    const result = await p2pService.getOrdersForAdmin({
      status: status as any,
      vendorId: vendorId as string,
      customerId: customerId as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });
    successResponse(res, result.orders, result.meta);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/p2p/bank-details - Get bank details for manual payment
router.get("/bank-details", (_req: Request, res: Response) => {
  successResponse(res, p2pService.getBankDetails());
});

// GET /api/v1/p2p/orders/:id - Get single order
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    const order = await p2pService.getOrder(req.params.id, userId, role);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/pay - Submit payment
router.post("/:id/pay", validate(submitPaymentSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = (req as any).user;
    const order = await p2pService.submitPayment(req.params.id, userId, req.body.paymentProofUrl);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/confirm - Admin/Seller confirms payment
router.post("/:id/confirm", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    const order = await p2pService.confirmPayment(req.params.id, userId, role);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/deliver - Deliver digital item
router.post("/:id/deliver", validate(deliverItemSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    const order = await p2pService.deliverItem(req.params.id, userId, role, req.body.deliveredPayload);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/complete - Buyer confirms receipt
router.post("/:id/complete", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = (req as any).user;
    const order = await p2pService.completeOrder(req.params.id, userId);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/dispute - Raise dispute
router.post("/:id/dispute", validate(disputeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    const order = await p2pService.disputeOrder(req.params.id, userId, role, req.body.reason);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/resolve - Admin resolves dispute
router.post("/:id/resolve", validate(resolveDisputeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (!["SUPER_ADMIN", "ADMIN", "SUPPORT"].includes(role)) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "Access denied" } });
      return;
    }
    const order = await p2pService.resolveDispute(req.params.id, userId, req.body.resolution, req.body.note);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/p2p/orders/:id/extend - Extend payment timer
router.post("/:id/extend", validate(extendTimerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, role } = (req as any).user;
    if (!["SUPER_ADMIN", "ADMIN", "SUPPORT", "VENDOR"].includes(role)) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "Access denied" } });
      return;
    }
    const order = await p2pService.extendTimer(req.params.id, userId, req.body.additionalMinutes);
    successResponse(res, order);
  } catch (err) {
    next(err);
  }
});

export default router;
