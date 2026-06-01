import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { searchLimiter } from "../middleware/rateLimiter.middleware.js";
import * as searchService from "../services/search.service.js";
import { successResponse, paginatedResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  searchLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = (req.query.q as string) || "";
      const filters = {
        category: req.query.category as string | undefined,
        craftType: req.query.craftType as string | undefined,
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        vendorId: req.query.vendorId as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };
      const result = await searchService.search(query, filters);
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
  "/suggestions",
  searchLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = (req.query.q as string) || "";
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const suggestions = await searchService.getSuggestions(query, limit);
      successResponse(res, suggestions);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/trending",
  searchLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const trending = await searchService.getTrendingSearches(limit);
      successResponse(res, trending);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
