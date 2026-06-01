import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { successResponse } from "../utils/response.js";
import { prisma } from "../config/database.js";

const router = Router();

router.post(
  "/chatbot/message",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, context } = req.body;

      const response = {
        reply: `Thank you for your message about "${message}". A support agent will assist you shortly.`,
        confidence: 0.85,
        suggestions: ["Track order", "Return policy", "Contact support"],
      };

      try {
        if (req.user?.id) {
          await prisma.auditLog.create({
            data: {
              userId: req.user.id,
              action: "ai_chat",
              entity: "ai_chatbot",
              newValue: { message, response: response.reply },
            },
          }).catch(() => {});
        }
      } catch {}

      successResponse(res, response);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/assistant/query",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, type } = req.body;

      let result: Record<string, unknown> = { query, type };

      if (type === "product_recommendations") {
        const products = await prisma.product.findMany({
          where: { status: "PUBLISHED", deletedAt: null },
          select: { id: true, title: true, slug: true, price: true },
          take: 5,
          orderBy: { salesCount: "desc" },
        });
        result = { query, type, products };
      } else if (type === "vendor_insights") {
        if (req.user?.vendor) {
          const orders = await prisma.order.count({ where: { vendorId: req.user.vendor.id } });
          const revenue = await prisma.order.aggregate({
            where: { vendorId: req.user.vendor.id, status: { in: ["DELIVERED", "COMPLETED"] } },
            _sum: { totalAmount: true },
          });
          result = { query, type, totalOrders: orders, totalRevenue: revenue._sum.totalAmount || 0 };
        }
      } else if (type === "order_status") {
        const orderId = req.body.orderId as string;
        if (orderId) {
          const order = await prisma.order.findFirst({
            where: { id: orderId, customerId: req.user!.id },
            select: { id: true, orderNumber: true, status: true, totalAmount: true, shippingAddress: true },
          });
          result = { query, type, order };
        }
      }

      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/recommendations",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      let recommendations: unknown[] = [];

      if (userId) {
        const recentOrders = await prisma.order.findMany({
          where: { customerId: userId },
          select: { items: { include: { product: { select: { craftType: true, vendorId: true } } } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        const craftTypes = new Set<string>();
        const vendorIds = new Set<string>();
        recentOrders.forEach((order) => {
          order.items.forEach((item) => {
            if (item.product.craftType) craftTypes.add(item.product.craftType);
            vendorIds.add(item.product.vendorId);
          });
        });

        const orConditions: Record<string, unknown>[] = [];
        if (craftTypes.size > 0) orConditions.push({ craftType: { in: Array.from(craftTypes) } });
        if (vendorIds.size > 0) orConditions.push({ vendorId: { in: Array.from(vendorIds) } });

        recommendations = await prisma.product.findMany({
          where: {
            status: "PUBLISHED",
            deletedAt: null,
            ...(orConditions.length > 0 ? { OR: orConditions } : {}),
          },
          include: {
            images: { take: 1, orderBy: { sortOrder: "asc" } },
            vendor: { select: { id: true, storeName: true, storeSlug: true } },
          },
          orderBy: { averageRating: "desc" },
          take: 10,
        });
      } else {
        recommendations = await prisma.product.findMany({
          where: { status: "PUBLISHED", deletedAt: null },
          include: {
            images: { take: 1, orderBy: { sortOrder: "asc" } },
            vendor: { select: { id: true, storeName: true, storeSlug: true } },
          },
          orderBy: { salesCount: "desc" },
          take: 10,
        });
      }

      successResponse(res, recommendations);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/search/enhance",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, filters } = req.body;

      const enhancedResults = await prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          OR: query
            ? [
                { title: { contains: query as string, mode: "insensitive" } },
                { description: { contains: query as string, mode: "insensitive" } },
                { tags: { some: { tag: { contains: query as string, mode: "insensitive" } } } },
              ]
            : undefined,
        },
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          vendor: { select: { id: true, storeName: true, storeSlug: true } },
        },
        orderBy: query ? { _relevance: { fields: ["title", "description"], search: query as string, sort: "asc" } } : { salesCount: "desc" },
        take: 20,
      });

      successResponse(res, {
        query,
        filters,
        results: enhancedResults,
        totalResults: enhancedResults.length,
        enhanced: !!query,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/generate-description",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productName, keywords, style } = req.body;

      const description = `Introducing the exquisite ${productName}. ${keywords ? `Featuring ${Array.isArray(keywords) ? keywords[0] : keywords}, ` : ""}this masterpiece is crafted with passion and precision. Each piece tells a story of tradition, skill, and dedication. Perfect for those who appreciate authentic craftsmanship.`;

      successResponse(res, {
        description,
        productName,
        style: style || "professional",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/insights",
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        trendingProducts,
        popularCategories,
        topVendors,
      ] = await Promise.all([
        prisma.product.findMany({
          where: { status: "PUBLISHED", deletedAt: null },
          select: { id: true, title: true, slug: true, salesCount: true, averageRating: true },
          orderBy: { salesCount: "desc" },
          take: 5,
        }),
        prisma.category.findMany({
          where: { isActive: true, deletedAt: null },
          select: { id: true, name: true, slug: true, image: true },
          orderBy: { sortOrder: "asc" },
          take: 5,
        }),
        prisma.vendor.findMany({
          where: { status: "VERIFIED", deletedAt: null },
          select: { id: true, storeName: true, storeSlug: true, rating: true, reviewCount: true },
          orderBy: { rating: "desc" },
          take: 5,
        }),
      ]);

      successResponse(res, {
        trendingProducts,
        popularCategories,
        topVendors,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
