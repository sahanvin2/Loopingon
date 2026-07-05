import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";
import * as adminService from "../services/admin.service.js";
import * as auditService from "../services/audit.service.js";
import * as paymentService from "../services/payment.service.js";
import { successResponse, paginatedResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("SUPER_ADMIN", "ADMIN"));
router.use(auditMiddleware);

// ==================== DASHBOARD ====================

router.get(
  "/dashboard",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const dashboard = await adminService.getDashboard();
      successResponse(res, dashboard);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== VENDORS ====================

router.get(
  "/vendors",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        craftType: req.query.craftType as string | undefined,
      };
      const result = await adminService.getVendors(page, limit, filters);
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
  "/vendors/:vendorId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminService.getVendorDetail(req.params.vendorId);
      successResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/vendors/:vendorId/verify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminService.verifyVendor(req.params.vendorId, req.user!.id);
      successResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/vendors/:vendorId/reject",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminService.rejectVendor(req.params.vendorId, req.user!.id, req.body.reason);
      successResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/vendors/:vendorId/suspend",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminService.suspendVendor(req.params.vendorId, req.user!.id, req.body.reason);
      successResponse(res, vendor);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== USERS ====================

router.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        role: req.query.role as string | undefined,
        search: req.query.search as string | undefined,
        isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      };
      const result = await adminService.getUsers(page, limit, filters);
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
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await adminService.getUserDetail(req.params.userId);
      successResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await adminService.updateUser(req.params.userId, req.body);
      successResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/users/:userId/ban",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await adminService.banUser(req.params.userId, req.user!.id);
      successResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== PRODUCTS ====================

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        vendorId: req.query.vendorId as string | undefined,
      };
      const result = await adminService.getProducts(page, limit, filters);
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
  "/products/:productId/approve",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await adminService.approveProduct(req.params.productId, req.user!.id);
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/products/:productId/reject",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await adminService.rejectProduct(req.params.productId, req.user!.id, req.body.reason || "");
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/products/:productId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteProduct(req.params.productId, req.user!.id);
      successResponse(res, { message: "Product deleted" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/products/:productId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await adminService.updateProduct(req.params.productId, req.body, req.user!.id);
      successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/products/bulk-delete",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.bulkDeleteProducts(req.body.ids, req.user!.id);
      successResponse(res, { message: `${req.body.ids.length} products deleted` });
    } catch (err) {
      next(err);
    }
  }
);

// ==================== ORDERS ====================

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
      };
      const result = await adminService.getOrders(page, limit, filters);
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
  "/orders/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await adminService.getOrderDetail(req.params.orderId);
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/orders/:orderId/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await adminService.updateOrderStatus(
        req.params.orderId,
        req.user!.id,
        req.body.status,
        req.body.paymentStatus,
        req.body.note
      );
      successResponse(res, order);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== PAYMENTS ====================

router.get(
  "/payments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        gatewayName: req.query.gatewayName as string | undefined,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
      };
      const result = await adminService.getPayments(page, limit, filters);
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
  "/payouts/process",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await paymentService.processAllPayouts();
      successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/payouts/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.handlePayoutCallback(req.body);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== DISPUTES ====================

router.get(
  "/disputes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = { status: req.query.status as string | undefined };
      const result = await adminService.getDisputes(page, limit, filters);
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
  "/disputes/:disputeId/resolve",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dispute = await adminService.resolveDispute(req.params.disputeId, req.user!.id, req.body.resolution);
      successResponse(res, dispute);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== COUPONS ====================

router.get(
  "/coupons",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await adminService.getCoupons(page, limit);
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
  "/coupons",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await adminService.createCoupon(req.body);
      createdResponse(res, coupon);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/coupons/:couponId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await adminService.updateCoupon(req.params.couponId, req.body);
      successResponse(res, coupon);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/coupons/:couponId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteCoupon(req.params.couponId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== COMPETITIONS ====================

router.get(
  "/competitions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await adminService.getCompetitions(page, limit);
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
  "/competitions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competition = await adminService.createCompetition(req.body);
      createdResponse(res, competition);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/competitions/:competitionId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competition = await adminService.updateCompetition(req.params.competitionId, req.body);
      successResponse(res, competition);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/competitions/:competitionId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteCompetition(req.params.competitionId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== BANNERS ====================

router.get(
  "/banners",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await adminService.getBanners(page, limit);
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
  "/banners",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await adminService.createBanner(req.body);
      createdResponse(res, banner);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/banners/:bannerId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await adminService.updateBanner(req.params.bannerId, req.body);
      successResponse(res, banner);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/banners/:bannerId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteBanner(req.params.bannerId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== BLOG POSTS ====================

router.get(
  "/blog",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await adminService.getBlogPostsAdmin(page, limit);
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
  "/blog",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await adminService.createBlogPost(req.body);
      createdResponse(res, post);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/blog/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await adminService.updateBlogPost(req.params.postId, req.body);
      successResponse(res, post);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/blog/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteBlogPost(req.params.postId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== CONTENT PAGES ====================

router.get(
  "/pages",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await adminService.getContentPages(page, limit);
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
  "/pages",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contentPage = await adminService.createContentPage(req.body);
      createdResponse(res, contentPage);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/pages/:pageId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contentPage = await adminService.updateContentPage(req.params.pageId, req.body);
      successResponse(res, contentPage);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/pages/:pageId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteContentPage(req.params.pageId);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== COMMISSIONS ====================

router.get(
  "/commissions",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const commissions = await adminService.getCommissions();
      successResponse(res, commissions);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/commissions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commission = await adminService.setCommissions(req.body);
      createdResponse(res, commission);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== ANALYTICS ====================

router.get(
  "/analytics",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await adminService.getAdminAnalytics();
      successResponse(res, analytics);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== SUPPORT TICKETS ====================

router.get(
  "/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
      };
      const result = await adminService.getSupportTickets(page, limit, filters);
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
  "/tickets/:ticketId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prisma } = await import("../config/database.js");
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: req.params.ticketId },
        include: {
          replies: {
            include: { user: { select: { id: true, fullName: true, avatar: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          user: { select: { id: true, fullName: true, email: true } },
        },
      });
      successResponse(res, ticket);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/tickets/:ticketId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await adminService.updateSupportTicket(req.params.ticketId, req.body);
      successResponse(res, ticket);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== SETTINGS ====================

router.get(
  "/settings",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await adminService.getSettings();
      successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/settings/:key",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const setting = await adminService.updateSettings(req.params.key, req.body.value, req.user!.id);
      successResponse(res, setting);
    } catch (err) {
      next(err);
    }
  }
);

// ==================== AUDIT LOGS ====================

router.get(
  "/audit-logs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const filters = {
        userId: req.query.userId as string | undefined,
        action: req.query.action as string | undefined,
        entity: req.query.entity as string | undefined,
        entityId: req.query.entityId as string | undefined,
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
      };
      const result = await auditService.getAuditLogs(page, limit, filters);
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

// ==================== EXPORT ====================

router.get(
  "/export",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.query.type as string || "orders";
      const filters = {
        fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
        toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
        format: req.query.format as string | undefined,
      };
      const report = await adminService.exportReport(type, filters);
      successResponse(res, report);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
