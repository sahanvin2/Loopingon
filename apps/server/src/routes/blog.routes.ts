import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import * as blogService from "../services/blog.service.js";
import { successResponse, paginatedResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const category = req.query.category as string | undefined;
      const result = await blogService.getBlogPosts(page, limit, category);
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
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await blogService.getBlogPostBySlug(req.params.slug);
      successResponse(res, post);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
