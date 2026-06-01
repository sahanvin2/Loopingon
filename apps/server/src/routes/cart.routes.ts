import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { cartItemSchema, updateCartItemSchema } from "../validators/user.validator.js";
import * as cartService from "../services/cart.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await cartService.getCart(req.user!.id);
      successResponse(res, cart);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/items",
  authenticate,
  validate(cartItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await cartService.addToCart(
        req.user!.id,
        req.body.productId,
        req.body.variantId || undefined,
        req.body.quantity
      );
      createdResponse(res, item);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/items/:itemId",
  authenticate,
  validate(updateCartItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await cartService.updateCartItem(
        req.params.itemId,
        req.user!.id,
        req.body.quantity
      );
      if (item === null) {
        noContentResponse(res);
      } else {
        successResponse(res, item);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/items/:itemId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cartService.removeCartItem(req.params.itemId, req.user!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cartService.clearCart(req.user!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/merge",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await cartService.mergeGuestCart(req.user!.id, req.body.items || []);
      successResponse(res, cart);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
