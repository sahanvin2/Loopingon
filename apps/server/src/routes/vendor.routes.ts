import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { requireRole, requireVendor, requireVendorProductOwnership } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { uploadSingle, uploadMultiple } from "../middleware/upload.middleware.js";
import { uploadMultiple as uploadMultipleToStorage } from "../services/media.service.js";
import * as vendorService from "../services/vendor.service.js";
import { successResponse, paginatedResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/apply",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await vendorService.applyVendor(req.user!.id, req.body);
      createdResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/application-status",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await vendorService.getApplicationStatus(req.user!.id);
      successResponse(res, status);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:vendorId/documents",
  authenticate,
  requireVendor,
  uploadMultiple("documents", 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = (req.files as Express.Multer.File[] || []).map((f) => ({
        docType: req.body.docType || "general",
        docUrl: `/uploads/vendor-docs/${f.filename}`,
        docName: f.originalname,
      }));
      const docs = await vendorService.uploadDocuments(req.params.vendorId, files);
      createdResponse(res, docs);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/storefront/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const store = await vendorService.getStorefrontBySlug(req.params.slug);
      successResponse(res, store);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        craftType: req.query.craftType as string | undefined,
        location: req.query.location as string | undefined,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
      };
      const result = await vendorService.getVendors(page, limit, filters);
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
  "/:vendorId/reviews",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await vendorService.getVendorReviews(req.params.vendorId, page, limit);
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
  "/dashboard",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = await vendorService.getDashboardOverview(req.user!.vendor!.id);
      successResponse(res, overview);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/dashboard/analytics",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query.period as "7d" | "30d" | "90d" | "1y") || "30d";
      const analytics = await vendorService.getDashboardAnalytics(req.user!.vendor!.id, period);
      successResponse(res, analytics);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/dashboard/products",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        categoryId: req.query.categoryId as string | undefined,
      };
      const result = await vendorService.getVendorProducts(req.user!.vendor!.id, page, limit, filters);
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

router.post(
  "/dashboard/products",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await vendorService.createProduct(req.user!.vendor!.id, req.body);
      createdResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/products/:productId",
  authenticate,
  requireVendor,
  requireVendorProductOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await vendorService.updateProduct(req.params.productId, req.user!.vendor!.id, req.body);
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/dashboard/products/:productId",
  authenticate,
  requireVendor,
  requireVendorProductOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await vendorService.deleteProduct(req.params.productId, req.user!.vendor!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/dashboard/products/:productId/images",
  authenticate,
  requireVendor,
  requireVendorProductOwnership,
  uploadMultiple("images", 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadedFiles = req.files as Express.Multer.File[] || [];
      if (uploadedFiles.length === 0) {
        throw new Error("No files uploaded");
      }

      const uploadResults = await uploadMultipleToStorage(uploadedFiles, `products/${req.params.productId}`);
      const files = uploadResults.map((result) => ({
        url: result.original,
        thumbnail: result.thumb,
        medium: result.medium,
        large: result.large,
        alt: req.body.alt,
      }));
      const images = await vendorService.addProductImage(req.params.productId, req.user!.vendor!.id, files);
      createdResponse(res, images);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/products/:productId/images/reorder",
  authenticate,
  requireVendor,
  requireVendorProductOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageIds } = req.body;
      if (!Array.isArray(imageIds)) {
        res.status(400).json({ status: "error", message: "imageIds must be an array" });
        return;
      }
      await vendorService.reorderProductImages(req.params.productId, req.user!.vendor!.id, imageIds);
      successResponse(res, { success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/dashboard/products/images/:imageId",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await vendorService.deleteProductImage(req.params.imageId, req.user!.vendor!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/dashboard/products/:productId/videos",
  authenticate,
  requireVendor,
  requireVendorProductOwnership,
  uploadSingle("video"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const video = await vendorService.addProductVideo(req.params.productId, req.user!.vendor!.id, {
        url: `/uploads/videos/${(req.file as Express.Multer.File).filename}`,
        thumbnailUrl: req.body.thumbnailUrl || "",
        duration: req.body.duration ? parseInt(req.body.duration, 10) : undefined,
      });
      createdResponse(res, video);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/dashboard/orders",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
        search: req.query.search as string | undefined,
      };
      const result = await vendorService.getVendorOrders(req.user!.vendor!.id, page, limit, filters);
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
  "/dashboard/orders/:orderId",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await vendorService.getVendorOrderDetail(req.params.orderId, req.user!.vendor!.id);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/orders/:orderId/status",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await vendorService.updateOrderStatus(
        req.params.orderId,
        req.user!.vendor!.id,
        req.body.status,
        req.body.note,
        req.body.trackingInfo
      );
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/dashboard/payouts",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await vendorService.getVendorPayouts(req.user!.vendor!.id, page, limit);
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
  "/dashboard/payouts/:payoutId",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payout = await vendorService.getPayoutDetail(req.params.payoutId, req.user!.vendor!.id);
      successResponse(res, payout);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/dashboard/bank-details",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const detail = await vendorService.addBankDetail(req.user!.vendor!.id, req.body);
      createdResponse(res, detail);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/bank-details/:detailId",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const detail = await vendorService.updateBankDetail(req.params.detailId, req.user!.vendor!.id, req.body);
      successResponse(res, detail);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/dashboard/bank-details/:detailId",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await vendorService.deleteBankDetail(req.params.detailId, req.user!.vendor!.id);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/storefront-settings",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await vendorService.updateStorefrontSettings(req.user!.vendor!.id, req.body);
      successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/dashboard/settings",
  authenticate,
  requireVendor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await vendorService.updateVendorSettings(req.user!.vendor!.id, req.body);
      successResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
