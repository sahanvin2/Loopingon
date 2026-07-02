import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { successResponse, paginatedResponse } from "../utils/response.js";
import * as productService from "../services/product.service.js";

const router = Router();

router.get(
  "/",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        category: req.query.category as string | undefined,
        craftType: req.query.craftType as string | undefined,
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        location: req.query.location as string | undefined,
        materials: req.query.materials ? (req.query.materials as string).split(",") : undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        vendorId: req.query.vendorId as string | undefined,
        isFeatured: req.query.isFeatured === "true" || undefined,
        isHandmade: req.query.isHandmade === "true" || undefined,
        isEcoFriendly: req.query.isEcoFriendly === "true" || undefined,
        onSale: req.query.onSale === "true" || undefined,
      };
      const result = await productService.getProducts(page, limit, filters);
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
  "/featured",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await productService.getFeaturedProducts(limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/trending",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await productService.getTrendingProducts(limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/recently-viewed",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookieId = req.query.cookieId as string;
      if (!cookieId) {
        return successResponse(res, []);
      }
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await productService.getRecentlyViewedProducts(cookieId, limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/new-arrivals",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await productService.getNewArrivals(limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/deals",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const products = await productService.getDeals(limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/recommended",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const userId = req.user?.id;
      const products = await productService.getRecommendedProducts(userId, limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:slug/reviews",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const sort = req.query.sort as string | undefined;
      const result = await productService.getProductReviews(req.params.slug, page, limit, sort);
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
  "/:productId/related",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const products = await productService.getRelatedProducts(req.params.productId, limit);
      successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
