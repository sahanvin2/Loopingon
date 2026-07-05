import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { updateProfileSchema, addressSchema, updateAddressSchema } from "../validators/user.validator.js";
import * as userService from "../services/user.service.js";
import { successResponse, paginatedResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user!.id);
      successResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body);
      successResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/account",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.deleteAccount(req.user!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/addresses",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await userService.getAddresses(req.user!.id);
      successResponse(res, addresses);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/addresses",
  authenticate,
  validate(addressSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await userService.createAddress(req.user!.id, req.body);
      createdResponse(res, address);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/addresses/:id",
  authenticate,
  validate(updateAddressSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await userService.updateAddress(req.params.id, req.user!.id, req.body);
      successResponse(res, address);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/addresses/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.deleteAddress(req.params.id, req.user!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/addresses/:id/default",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await userService.setDefaultAddress(req.params.id, req.user!.id);
      successResponse(res, address);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/orders",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const status = req.query.status as string | undefined;
      const result = await userService.getUserOrders(req.user!.id, page, limit, status);
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
  "/orders/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await userService.getOrderDetail(req.params.id, req.user!.id);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/orders/:id/cancel",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await userService.cancelOrder(req.params.id, req.user!.id);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/orders/:id/return",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reason = req.body.reason || "Customer requested return";
      const order = await userService.returnOrder(req.params.id, req.user!.id, reason);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/upload-avatar",
  authenticate,
  uploadSingle("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.uploadAvatar(req.user!.id, req.file!);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
