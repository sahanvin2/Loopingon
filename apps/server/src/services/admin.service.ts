import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

// ============ DASHBOARD ============

export async function getDashboard() {
  const [
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingVendors,
    recentOrders,
    ordersToday,
    revenueToday,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.vendor.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { in: ["DELIVERED", "COMPLETED"] } }, _sum: { totalAmount: true } }),
    prisma.vendor.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { customer: { select: { id: true, fullName: true } }, vendor: { select: { id: true, storeName: true } } } }),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }, _sum: { totalAmount: true } }),
  ]);

  return {
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    pendingVendors,
    recentOrders,
    ordersToday,
    revenueToday: revenueToday._sum.totalAmount || 0,
  };
}

// ============ VENDORS ============

export async function getVendors(
  page?: number,
  limit?: number,
  filters?: { status?: string; search?: string; craftType?: string }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.VendorWhereInput = { deletedAt: null };

  if (filters?.status) where.status = filters.status as any;
  if (filters?.search) {
    where.OR = [
      { storeName: { contains: filters.search, mode: "insensitive" } },
      { businessName: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters?.craftType) where.craftType = { has: filters.craftType };

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.vendor.count({ where }),
  ]);

  return buildPaginationResult(vendors, total, p, l);
}

export async function getVendorDetail(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      user: true,
      bankDetails: { where: { deletedAt: null } },
      verificationDocs: true,
      storefrontSettings: true,
    },
  });

  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");
  return vendor;
}

export async function verifyVendor(vendorId: string, adminId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      status: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: adminId,
      verificationNotes: "Approved by admin",
    },
  });
}

export async function rejectVendor(vendorId: string, adminId: string, reason: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      status: "REJECTED",
      verificationNotes: reason,
      verifiedBy: adminId,
    },
  });
}

export async function suspendVendor(vendorId: string, adminId: string, reason: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      status: "SUSPENDED",
      verificationNotes: reason,
      verifiedBy: adminId,
    },
  });
}

// ============ USERS ============

export async function getUsers(
  page?: number,
  limit?: number,
  filters?: { role?: string; search?: string; isActive?: boolean }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.UserWhereInput = { deletedAt: null };

  if (filters?.role) where.role = filters.role as any;
  if (filters?.isActive !== undefined) where.isActive = filters.isActive;
  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, fullName: true, phone: true, role: true, isActive: true, emailVerified: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.user.count({ where }),
  ]);

  return buildPaginationResult(users, total, p, l);
}

export async function getUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customerProfile: true,
      vendor: true,
      addresses: true,
      orders: { take: 5, orderBy: { createdAt: "desc" } },
      reviews: { take: 5, orderBy: { createdAt: "desc" } },
      referralsMade: true,
    },
  });

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  const { passwordHash, twoFactorSecret, twoFactorBackupCodes, ...safeUser } = user;
  return safeUser;
}

export async function updateUser(userId: string, data: { fullName?: string; phone?: string; role?: string; isActive?: boolean; emailVerified?: boolean }) {
  return prisma.user.update({ where: { id: userId }, data: data as any });
}

export async function banUser(userId: string, adminId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const isActive = !user.isActive;
  return prisma.user.update({
    where: { id: userId },
    data: { isActive, lockedUntil: isActive ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  });
}

// ============ PRODUCTS ============

export async function getProducts(
  page?: number,
  limit?: number,
  filters?: { status?: string; search?: string; vendorId?: string }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.ProductWhereInput = { deletedAt: null };

  if (filters?.status) where.status = filters.status as any;
  if (filters?.vendorId) where.vendorId = filters.vendorId;
  if (filters?.search) where.title = { contains: filters.search, mode: "insensitive" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        vendor: { select: { id: true, storeName: true } },
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginationResult(products, total, p, l);
}

export async function approveProduct(productId: string, adminId: string) {
  return prisma.product.update({
    where: { id: productId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export async function rejectProduct(productId: string, adminId: string, reason: string) {
  return prisma.product.update({ where: { id: productId }, data: { status: "REJECTED" } });
}

// ============ ORDERS ============

export async function getOrders(
  page?: number,
  limit?: number,
  filters?: { status?: string; search?: string; fromDate?: Date; toDate?: Date }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.OrderWhereInput = {};

  if (filters?.status) where.status = filters.status as any;
  if (filters?.search) where.orderNumber = { contains: filters.search, mode: "insensitive" };
  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
    if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true } },
        vendor: { select: { id: true, storeName: true } },
        items: { select: { id: true, productTitle: true, quantity: true, totalPrice: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.order.count({ where }),
  ]);

  return buildPaginationResult(orders, total, p, l);
}

export async function getOrderDetail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      customer: true,
      vendor: true,
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      shipments: true,
      dispute: true,
    },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  return order;
}

// ============ PAYMENTS ============

export async function getPayments(
  page?: number,
  limit?: number,
  filters?: { status?: string; gatewayName?: string; fromDate?: Date; toDate?: Date }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.PaymentTransactionWhereInput = {};

  if (filters?.status) where.status = filters.status as any;
  if (filters?.gatewayName) where.gatewayName = filters.gatewayName;
  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
    if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
  }

  const [payments, total] = await Promise.all([
    prisma.paymentTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.paymentTransaction.count({ where }),
  ]);

  return buildPaginationResult(payments, total, p, l);
}

// ============ DISPUTES ============

export async function getDisputes(page?: number, limit?: number, filters?: { status?: string }) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.OrderDisputeWhereInput = {};
  if (filters?.status) where.status = filters.status as any;

  const [disputes, total] = await Promise.all([
    prisma.orderDispute.findMany({
      where,
      include: { order: { select: { id: true, orderNumber: true, totalAmount: true, status: true } } },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.orderDispute.count({ where }),
  ]);

  return buildPaginationResult(disputes, total, p, l);
}

export async function resolveDispute(disputeId: string, adminId: string, resolution: string) {
  const dispute = await prisma.orderDispute.findUnique({ where: { id: disputeId } });
  if (!dispute) throw new AppError("Dispute not found", 404, "DISPUTE_NOT_FOUND");

  return prisma.orderDispute.update({
    where: { id: disputeId },
    data: { status: "RESOLVED", resolution, resolvedBy: adminId, resolvedAt: new Date() },
  });
}

// ============ COUPONS ============

export async function getCoupons(page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = {};

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, skip: (p - 1) * l, take: l }),
    prisma.coupon.count({ where }),
  ]);

  return buildPaginationResult(coupons, total, p, l);
}

export async function createCoupon(data: {
  code: string; description?: string; discountType: string; discountValue: number;
  minOrderAmount?: number; maxDiscountAmount?: number; usageLimit?: number; perUserLimit?: number;
  startsAt?: Date; expiresAt: Date; isActive?: boolean;
  applicableProducts?: string[]; applicableCategories?: string[]; applicableVendors?: string[];
  forNewCustomersOnly?: boolean;
}) {
  return prisma.coupon.create({ data: data as any });
}

export async function updateCoupon(couponId: string, data: Record<string, unknown>) {
  return prisma.coupon.update({ where: { id: couponId }, data: data as any });
}

export async function deleteCoupon(couponId: string) {
  await prisma.coupon.update({ where: { id: couponId }, data: { isActive: false } });
}

// ============ COMPETITIONS ============

export async function getCompetitions(page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = {};

  const [competitions, total] = await Promise.all([
    prisma.competition.findMany({ where, orderBy: { startDate: "desc" }, skip: (p - 1) * l, take: l }),
    prisma.competition.count({ where }),
  ]);

  return buildPaginationResult(competitions, total, p, l);
}

export async function createCompetition(data: Record<string, unknown>) {
  return prisma.competition.create({ data: data as any });
}

export async function updateCompetition(competitionId: string, data: Record<string, unknown>) {
  return prisma.competition.update({ where: { id: competitionId }, data: data as any });
}

export async function deleteCompetition(competitionId: string) {
  return prisma.competition.delete({ where: { id: competitionId } });
}

// ============ BANNERS ============

export async function getBanners(page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = {};

  const [banners, total] = await Promise.all([
    prisma.banner.findMany({ where, orderBy: { sortOrder: "asc" }, skip: (p - 1) * l, take: l }),
    prisma.banner.count({ where }),
  ]);

  return buildPaginationResult(banners, total, p, l);
}

export async function createBanner(data: Record<string, unknown>) {
  return prisma.banner.create({ data: data as any });
}

export async function updateBanner(bannerId: string, data: Record<string, unknown>) {
  return prisma.banner.update({ where: { id: bannerId }, data: data as any });
}

export async function deleteBanner(bannerId: string) {
  return prisma.banner.delete({ where: { id: bannerId } });
}

// ============ BLOG POSTS ============

export async function getBlogPostsAdmin(page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = {};

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip: (p - 1) * l, take: l }),
    prisma.blogPost.count({ where }),
  ]);

  return buildPaginationResult(posts, total, p, l);
}

export async function createBlogPost(data: Record<string, unknown>) {
  return prisma.blogPost.create({ data: data as any });
}

export async function updateBlogPost(postId: string, data: Record<string, unknown>) {
  return prisma.blogPost.update({ where: { id: postId }, data: data as any });
}

export async function deleteBlogPost(postId: string) {
  return prisma.blogPost.delete({ where: { id: postId } });
}

// ============ CONTENT PAGES ============

export async function getContentPages(page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = {};

  const [pages, total] = await Promise.all([
    prisma.page.findMany({ where, orderBy: { createdAt: "desc" }, skip: (p - 1) * l, take: l }),
    prisma.page.count({ where }),
  ]);

  return buildPaginationResult(pages, total, p, l);
}

export async function createContentPage(data: Record<string, unknown>) {
  return prisma.page.create({ data: data as any });
}

export async function updateContentPage(pageId: string, data: Record<string, unknown>) {
  return prisma.page.update({ where: { id: pageId }, data: data as any });
}

export async function deleteContentPage(pageId: string) {
  return prisma.page.delete({ where: { id: pageId } });
}

// ============ COMMISSIONS ============

export async function getCommissions() {
  return prisma.commissionSetting.findMany({ orderBy: { createdAt: "desc" } });
}

export async function setCommissions(data: Record<string, unknown>) {
  return prisma.commissionSetting.create({ data: data as any });
}

// ============ ANALYTICS ============

export async function getAdminAnalytics() {
  const [
    totalVendors, totalCustomers, totalProducts, totalOrders,
    revenueTotal, revenueThisMonth, conversionRate,
    pendingOrders, processingOrders, shippedOrders,
  ] = await Promise.all([
    prisma.vendor.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { in: ["DELIVERED", "COMPLETED"] } }, _sum: { totalAmount: true } }),
    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "COMPLETED"] }, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({ _avg: { totalAmount: true } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.count({ where: { status: { in: ["PAYMENT_CONFIRMED", "PROCESSING"] } } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
  ]);

  const sessionCount = await prisma.session.count();
  const totalVisits = sessionCount;
  const totalOrdersNum = totalOrders;

  return {
    overview: {
      totalVendors,
      totalCustomers,
      totalProducts,
      totalOrders: totalOrdersNum,
      totalRevenue: revenueTotal._sum.totalAmount || 0,
      revenueThisMonth: revenueThisMonth._sum.totalAmount || 0,
      avgOrderValue: conversionRate._avg.totalAmount || 0,
      conversionRate: totalVisits > 0 ? (totalOrdersNum / totalVisits) * 100 : 0,
    },
    orders: {
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
    },
  };
}

// ============ SUPPORT TICKETS ============

export async function getSupportTickets(page?: number, limit?: number, filters?: { status?: string; priority?: string }) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.SupportTicketWhereInput = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { updatedAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return buildPaginationResult(tickets, total, p, l);
}

export async function updateSupportTicket(ticketId: string, data: { status?: string; priority?: string; assignedTo?: string }) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

  const updateData: any = { ...data };
  if (data.status === "resolved" || data.status === "closed") {
    updateData.resolvedAt = new Date();
  }

  return prisma.supportTicket.update({ where: { id: ticketId }, data: updateData });
}

// ============ SETTINGS ============

export async function getSettings() {
  return prisma.systemSetting.findMany();
}

export async function updateSettings(key: string, value: unknown, updatedBy?: string) {
  return prisma.systemSetting.upsert({
    where: { key },
    update: { value: value as any, updatedBy },
    create: { key, value: value as any, updatedBy },
  });
}

// ============ EXPORT ============

export async function exportReport(type: string, filters: { fromDate?: Date; toDate?: Date; format?: string }) {
  let data: unknown[] = [];

  switch (type) {
    case "orders": {
      const where: Prisma.OrderWhereInput = {};
      if (filters.fromDate || filters.toDate) {
        where.createdAt = {};
        if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
        if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
      }
      data = await prisma.order.findMany({
        where,
        include: { customer: { select: { fullName: true, email: true } }, vendor: { select: { storeName: true } } },
        orderBy: { createdAt: "desc" },
      });
      break;
    }
    case "vendors": {
      data = await prisma.vendor.findMany({ where: { deletedAt: null }, include: { user: { select: { email: true } } } });
      break;
    }
    case "users": {
      data = await prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true, email: true, fullName: true, role: true, createdAt: true },
      });
      break;
    }
    case "revenue": {
      data = await prisma.paymentTransaction.findMany({
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      });
      break;
    }
    default:
      throw new AppError("Unknown export type", 400, "UNKNOWN_EXPORT_TYPE");
  }

  return { type, totalRecords: data.length, data };
}
