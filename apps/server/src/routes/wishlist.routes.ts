import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as wishlistService from "../services/wishlist.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wishlist = await wishlistService.getWishlist(req.user!.id);
      successResponse(res, wishlist);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/items",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await wishlistService.addToWishlist(req.user!.id, req.body.productId);
      createdResponse(res, item);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/items/:productId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await wishlistService.removeFromWishlist(req.user!.id, req.params.productId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/share",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const share = await wishlistService.shareWishlist(req.user!.id);
      successResponse(res, share);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/shared/:shareId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wishlist = await wishlistService.getSharedWishlist(req.params.shareId);
      successResponse(res, wishlist);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
