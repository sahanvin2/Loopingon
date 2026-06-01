import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as reviewService from "../services/review.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await reviewService.createReview(
        req.user!.id,
        req.body.productId,
        req.body.orderId,
        req.body.rating,
        req.body.title,
        req.body.content,
        req.body.images
      );
      createdResponse(res, review);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:reviewId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await reviewService.updateReview(req.params.reviewId, req.user!.id, req.body);
      successResponse(res, review);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:reviewId",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reviewService.deleteReview(req.params.reviewId, req.user!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:reviewId/helpful",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reviewService.markHelpful(req.params.reviewId, req.user!.id);
      successResponse(res, { message: "Marked as helpful" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:reviewId/report",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reviewService.reportReview(req.params.reviewId, req.user!.id, req.body.reason);
      successResponse(res, { message: "Review reported" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
