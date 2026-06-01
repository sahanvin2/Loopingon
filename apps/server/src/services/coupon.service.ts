import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export async function validateCoupon(code: string, cartTotal: number, userId: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon) throw new AppError("Invalid coupon code", 404, "COUPON_NOT_FOUND");
  if (!coupon.isActive) throw new AppError("Coupon is inactive", 400, "COUPON_INACTIVE");

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new AppError("Coupon not yet active", 400, "COUPON_NOT_ACTIVE");
  if (coupon.expiresAt < now) throw new AppError("Coupon has expired", 400, "COUPON_EXPIRED");

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", 400, "COUPON_LIMIT_REACHED");
  }

  const userUsageCount = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } });
  if (coupon.perUserLimit && userUsageCount >= coupon.perUserLimit) {
    throw new AppError("You have reached the usage limit for this coupon", 400, "COUPON_USER_LIMIT");
  }

  if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
    throw new AppError(
      `Minimum order amount of ${Number(coupon.minOrderAmount).toFixed(2)} required`,
      400,
      "COUPON_MIN_ORDER"
    );
  }

  if (coupon.forNewCustomersOnly) {
    const orderCount = await prisma.order.count({ where: { customerId: userId } });
    if (orderCount > 0) throw new AppError("Coupon is for new customers only", 400, "COUPON_NEW_CUSTOMERS");
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = cartTotal * (Number(coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
      discountAmount = Number(coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === "FIXED_AMOUNT") {
    discountAmount = Number(coupon.discountValue);
  } else if (coupon.discountType === "FREE_SHIPPING") {
    discountAmount = 0;
  }

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount: Math.round(discountAmount * 100) / 100,
    },
  };
}

export async function applyCoupon(code: string, orderId: string, userId: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new AppError("Invalid coupon code", 404, "COUPON_NOT_FOUND");

  const order = await prisma.order.findFirst({ where: { id: orderId, customerId: userId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  await prisma.couponUsage.create({
    data: {
      couponId: coupon.id,
      userId,
      orderId,
      discountAmount: order.discountAmount,
    },
  });

  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { usageCount: { increment: 1 } },
  });
}
