import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";
import { generateOrderNumber } from "../utils/slug.js";

export async function createOrder(
  userId: string,
  data: {
    vendorId: string;
    items: Array<{ productId: string; variantId?: string; quantity: number }>;
    shippingAddressId: string;
    shippingMethod?: string;
    couponCode?: string;
    customerNotes?: string;
    paymentMethod?: string;
    isGift?: boolean;
    giftMessage?: string;
    giftWrap?: boolean;
  }
) {
  const [user, shippingAddress] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId, deletedAt: null } }),
    prisma.address.findFirst({ where: { id: data.shippingAddressId, userId, deletedAt: null } }),
  ]);

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!shippingAddress) throw new AppError("Shipping address not found", 404, "ADDRESS_NOT_FOUND");

  const vendor = await prisma.vendor.findUnique({ where: { id: data.vendorId } });
  if (!vendor || vendor.status !== "VERIFIED") throw new AppError("Vendor not available", 400, "VENDOR_UNAVAILABLE");

  const orderItems: Array<{
    productId: string;
    variantId: string | null;
    productTitle: string;
    productImage: string | null;
    price: number;
    quantity: number;
    totalPrice: number;
    vendorId: string;
  }> = [];

  let subtotal = 0;

  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId, deletedAt: null },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });

    if (!product || product.status !== "PUBLISHED") {
      throw new AppError(`Product ${item.productId} is not available`, 400, "PRODUCT_UNAVAILABLE");
    }

    let price = Number(product.price);
    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant || variant.productId !== product.id) {
        throw new AppError(`Variant ${item.variantId} not found`, 404, "VARIANT_NOT_FOUND");
      }
      if (variant.price) price = Number(variant.price);
    }

    if (product.quantity < item.quantity) {
      throw new AppError(`Insufficient stock for "${product.title}"`, 400, "INSUFFICIENT_STOCK");
    }

    const totalPrice = price * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      productId: product.id,
      variantId: item.variantId || null,
      productTitle: product.title,
      productImage: product.images[0]?.url || null,
      price,
      quantity: item.quantity,
      totalPrice,
      vendorId: data.vendorId,
    });
  }

  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (data.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: data.couponCode, isActive: true, expiresAt: { gt: new Date() } },
    });

    if (coupon) {
      const usageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });

      if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
        if (!coupon.perUserLimit || usageCount < coupon.perUserLimit) {
          if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
            if (coupon.discountType === "PERCENTAGE") {
              discountAmount = subtotal * (Number(coupon.discountValue) / 100);
              if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
                discountAmount = Number(coupon.maxDiscountAmount);
              }
            } else if (coupon.discountType === "FIXED_AMOUNT") {
              discountAmount = Number(coupon.discountValue);
            }
            appliedCouponCode = data.couponCode;
          }
        }
      }
    }
  }

  const shippingCost = data.shippingMethod === "FREE" ? 0 : 0;
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

  const commissionRate = vendor.commissionRate || 20;
  const commissionAmount = Math.round((subtotal - discountAmount) * (commissionRate / 100) * 100) / 100;
  const vendorPayoutAmount = Math.round((subtotal - discountAmount - commissionAmount) * 100) / 100;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: userId,
      vendorId: data.vendorId,
      status: "PENDING_PAYMENT",
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      couponCode: appliedCouponCode,
      totalAmount,
      commissionRate,
      commissionAmount,
      vendorPayoutAmount,
      shippingMethod: (data.shippingMethod as any) || "STANDARD",
      shippingAddressId: data.shippingAddressId,
      customerNotes: data.customerNotes,
      giftMessage: data.giftMessage,
      isGift: data.isGift || false,
      giftWrap: data.giftWrap || false,
      paymentMethod: data.paymentMethod,
      items: {
        create: orderItems,
      },
      statusHistory: {
        create: {
          status: "PENDING_PAYMENT",
          note: "Order created",
        },
      },
    },
    include: {
      items: true,
      statusHistory: true,
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
  });

  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.quantity },
        salesCount: { increment: item.quantity },
      },
    });
  }

  if (appliedCouponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: appliedCouponCode } });
    if (coupon) {
      await prisma.couponUsage.create({
        data: {
          couponId: coupon.id,
          userId,
          orderId: order.id,
          discountAmount,
        },
      });
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  await prisma.vendor.update({
    where: { id: data.vendorId },
    data: {
      totalOrders: { increment: 1 },
      pendingPayoutAmount: { increment: vendorPayoutAmount },
    },
  });

  await prisma.customerProfile.update({
    where: { userId },
    data: {
      totalOrders: { increment: 1 },
      totalSpent: { increment: totalAmount },
      lifetimeValue: { increment: totalAmount },
      lastOrderAt: new Date(),
    },
  });

  // Update vendor daily analytics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.vendorAnalytics.upsert({
    where: {
      vendorId_date: {
        vendorId: data.vendorId,
        date: today,
      },
    },
    create: {
      vendorId: data.vendorId,
      date: today,
      revenue: totalAmount,
      commission: commissionAmount,
      orders: 1,
      views: 0,
      conversionRate: 0,
    },
    update: {
      revenue: { increment: totalAmount },
      commission: { increment: commissionAmount },
      orders: { increment: 1 },
    },
  });

  // Send notification to vendor
  await prisma.notification.create({
    data: {
      userId: data.vendorId,
      type: "NEW_MESSAGE",
      channel: "IN_APP",
      title: "New Order Received! 🎉",
      body: `You received a new order #${order.orderNumber} worth ${totalAmount.toLocaleString()} LKR. View your dashboard to process it.`,
      data: { orderId: order.id, orderNumber: order.orderNumber, amount: totalAmount },
    },
  });

  return order;
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, title: true, slug: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
          },
        },
      },
      customer: { select: { id: true, fullName: true, email: true, phone: true } },
      vendor: { select: { id: true, storeName: true, storeSlug: true, storeLogo: true } },
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      shipments: true,
      dispute: true,
    },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  return order;
}

export async function getOrders(
  page?: number,
  limit?: number,
  filters?: { status?: string; customerId?: string; vendorId?: string; fromDate?: Date; toDate?: Date }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.OrderWhereInput = {};

  if (filters?.status) where.status = filters.status as any;
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.vendorId) where.vendorId = filters.vendorId;
  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
    if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { select: { id: true, productTitle: true, productImage: true, quantity: true, price: true } },
        customer: { select: { id: true, fullName: true } },
        vendor: { select: { id: true, storeName: true, storeSlug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.order.count({ where }),
  ]);

  return buildPaginationResult(orders, total, p, l);
}

export async function cancelOrder(orderId: string, userId: string, reason: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  const cancellableStatuses = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "PROCESSING"];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError("Order cannot be cancelled at this stage", 400, "CANNOT_CANCEL");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      cancellationReason: reason,
      cancelledBy: userId,
      cancelledAt: new Date(),
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status: "CANCELLED",
      note: `Cancelled by customer: ${reason}`,
      changedBy: userId,
    },
  });

  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantity: { increment: item.quantity }, salesCount: { decrement: item.quantity } },
    });
  }

  if (order.paymentStatus === "COMPLETED") {
    await prisma.paymentTransaction.updateMany({
      where: { orderId },
      data: { status: "REFUNDED", refundedAt: new Date(), refundAmount: order.totalAmount },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "REFUNDED" },
    });

    // Reverse pending payout amount
    await prisma.vendor.update({
      where: { id: order.vendorId },
      data: { pendingPayoutAmount: { decrement: Number(order.vendorPayoutAmount || 0) } },
    });

    // Reverse referral commission if any
    const referral = await prisma.referral.findUnique({
      where: { referredUserId: order.customerId },
    });
    if (referral && referral.rewardAmount) {
      await prisma.$transaction([
        prisma.referral.update({
          where: { referredUserId: order.customerId },
          data: { status: "reversed", rewardAmount: 0 },
        }),
        prisma.referralCode.update({
          where: { userId: referral.referrerId },
          data: { totalEarnings: { decrement: Number(referral.rewardAmount) } },
        }),
      ]);
    }
  }

  return updated;
}

export async function returnOrder(orderId: string, userId: string, reason: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.status !== "DELIVERED" && order.status !== "COMPLETED") {
    throw new AppError("Only delivered orders can be returned", 400, "CANNOT_RETURN");
  }

  const returnWindow = 7 * 24 * 60 * 60 * 1000;
  if (order.deliveredAt && Date.now() - order.deliveredAt.getTime() > returnWindow) {
    throw new AppError("Return window has expired (7 days after delivery)", 400, "RETURN_WINDOW_EXPIRED");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "RETURN_REQUESTED",
      cancellationReason: reason,
      cancelledBy: userId,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status: "RETURN_REQUESTED",
      note: `Return requested by customer: ${reason}`,
      changedBy: userId,
    },
  });

  return updated;
}
