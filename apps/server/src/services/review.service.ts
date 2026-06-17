import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

import { randomUUID } from "crypto";

export async function createReview(
  userId: string,
  productId: string,
  orderId?: string,
  rating: number = 5,
  title?: string,
  content?: string,
  images?: string[]
) {
  let isVerified = false;
  let finalOrderId = orderId;

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId: userId },
    });

    if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
    if (order.status !== "DELIVERED" && order.status !== "COMPLETED") {
      throw new AppError("Can only review delivered orders", 400, "ORDER_NOT_DELIVERED");
    }

    const existingReview = await prisma.review.findFirst({ where: { orderId } });
    if (existingReview) throw new AppError("Already reviewed this order", 409, "ALREADY_REVIEWED");
    
    isVerified = true;
  } else {
    // Check if the user has ALREADY reviewed this product to prevent spam
    const existingUnverified = await prisma.review.findFirst({ where: { productId, customerId: userId } });
    if (existingUnverified) throw new AppError("You have already reviewed this product.", 409, "ALREADY_REVIEWED");
    finalOrderId = `unverified-${randomUUID()}`;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  const review = await prisma.review.create({
    data: {
      productId,
      orderId: finalOrderId as string,
      customerId: userId,
      vendorId: product.vendorId,
      rating,
      title: title || null,
      content: content || null,
      images: images || [],
      isVerified,
    },
  });

  await updateProductRating(productId);
  await updateVendorRating(product.vendorId);

  return review;
}

export async function updateReview(
  reviewId: string,
  userId: string,
  data: { rating?: number; title?: string; content?: string; images?: string[] }
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId: userId, deletedAt: null },
  });

  if (!review) throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data,
  });

  if (data.rating) {
    await updateProductRating(review.productId);
    await updateVendorRating(review.vendorId);
  }

  return updated;
}

export async function deleteReview(reviewId: string, userId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId: userId, deletedAt: null },
  });

  if (!review) throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");

  await prisma.review.update({
    where: { id: reviewId },
    data: { deletedAt: new Date() },
  });

  await updateProductRating(review.productId);
  await updateVendorRating(review.vendorId);
}

export async function markHelpful(reviewId: string, userId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, deletedAt: null },
  });

  if (!review) throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");

  await prisma.review.update({
    where: { id: reviewId },
    data: { helpfulCount: { increment: 1 } },
  });
}

export async function reportReview(reviewId: string, userId: string, reason: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, deletedAt: null },
  });

  if (!review) throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");

  await prisma.review.update({
    where: { id: reviewId },
    data: { isHidden: true, hiddenReason: reason },
  });
}

export async function getVendorReviewStats(vendorId: string) {
  const reviews = await prisma.review.groupBy({
    by: ["rating"],
    where: { vendorId, deletedAt: null, isHidden: false },
    _count: { rating: true },
  });

  const average = await prisma.review.aggregate({
    where: { vendorId, deletedAt: null, isHidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = r._count.rating;
  });

  return {
    average: average._avg.rating || 0,
    total: average._count.rating || 0,
    distribution,
  };
}

async function updateProductRating(productId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { productId, deletedAt: null, isHidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: aggregate._avg.rating || 0,
      reviewCount: aggregate._count.rating || 0,
    },
  });
}

async function updateVendorRating(vendorId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { vendorId, deletedAt: null, isHidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      rating: aggregate._avg.rating || 0,
      reviewCount: aggregate._count.rating || 0,
    },
  });
}
