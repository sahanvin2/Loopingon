import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export async function getPublicStats() {
  const [vendorCount, productCount, orderCount, customerCount] = await Promise.all([
    prisma.vendor.count({ where: { status: "VERIFIED", deletedAt: null } }),
    prisma.product.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ["DELIVERED", "COMPLETED"] } },
    _sum: { totalAmount: true },
  });

  return {
    vendors: vendorCount,
    products: productCount,
    orders: orderCount,
    customers: customerCount,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    countriesServed: 1,
  };
}

export async function getVendorAnalytics(vendorId: string, period: "7d" | "30d" | "90d" | "1y" = "30d") {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[period] || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    analytics,
    orders,
    revenueByDay,
    topProducts,
    orderStatusBreakdown,
  ] = await Promise.all([
    prisma.vendorAnalytics.findMany({
      where: { vendorId, date: { gte: since } },
      orderBy: { date: "asc" },
    }),

    prisma.order.findMany({
      where: { vendorId, createdAt: { gte: since } },
      select: { id: true, status: true, totalAmount: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),

    prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as revenue
      FROM orders
      WHERE vendor_id = ${vendorId} AND created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,

    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { vendorId, order: { createdAt: { gte: since } } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 5,
    }),

    prisma.order.groupBy({
      by: ["status"],
      where: { vendorId, createdAt: { gte: since } },
      _count: { status: true },
    }),
  ]);

  return {
    period,
    analytics,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    revenueByDay,
    topProducts,
    orderStatusBreakdown,
  };
}
