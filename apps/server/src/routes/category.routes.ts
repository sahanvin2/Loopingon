import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { successResponse, paginatedResponse } from "../utils/response.js";
import * as categoryService from "../services/category.service.js";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getCategories();
      successResponse(res, categories);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/featured",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getFeaturedCategories();
      successResponse(res, categories);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/tree",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = await categoryService.getCategoryTree();
      successResponse(res, tree);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      successResponse(res, category);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:slug/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        craftType: req.query.craftType as string | undefined,
      };
      const result = await categoryService.getCategoryProducts(req.params.slug, page, limit, filters);
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

export default router;
