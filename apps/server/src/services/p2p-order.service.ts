import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { v4 as uuidv4 } from "uuid";
import type { OrderStatus } from "@prisma/client";

const PAYMENT_TIMEOUT_MINUTES = 25;
const AUTO_COMPLETE_HOURS = 24;

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING_PAYMENT: ["PAYMENT_SUBMITTED", "EXPIRED", "CANCELLED"],
  PAYMENT_SUBMITTED: ["PAYMENT_CONFIRMED", "DISPUTED", "EXPIRED", "CANCELLED"],
  PAYMENT_CONFIRMED: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["COMPLETED", "DISPUTED"],
  COMPLETED: [],
  EXPIRED: [],
  DISPUTED: ["PAYMENT_CONFIRMED", "DELIVERED", "COMPLETED", "CANCELLED", "PENDING_PAYMENT"],
  CANCELLED: [],
};

export function generateReferenceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KND-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createOrder(data: {
  customerId: string;
  vendorId?: string;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  customerNotes?: string;
}) {
  let subtotal = 0;
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

  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { images: { take: 1, where: { isPrimary: true } } },
    });
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404, "PRODUCT_NOT_FOUND");
    if (product.quantity < item.quantity) throw new AppError(`Insufficient stock for ${product.title}`, 400, "INSUFFICIENT_STOCK");
    if (product.status !== "PUBLISHED") throw new AppError(`Product ${product.title} is not available`, 400, "PRODUCT_UNAVAILABLE");

    const price = Number(product.price);
    const totalPrice = price * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId || null,
      productTitle: product.title,
      productImage: product.images[0]?.url || null,
      price,
      quantity: item.quantity,
      totalPrice,
      vendorId: product.vendorId,
    });
  }

  const finalVendorId = data.vendorId || orderItems[0]?.vendorId;
  if (!finalVendorId) throw new AppError("Vendor ID is required", 400, "MISSING_VENDOR");

  const commissionRate = 20;
  const commissionAmount = (subtotal * commissionRate) / 100;
  const referenceCode = generateReferenceCode();
  const expiresAt = new Date(Date.now() + PAYMENT_TIMEOUT_MINUTES * 60 * 1000);
  const orderNumber = `KND-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

  const TRANSACTION_FEE = 25;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: data.customerId,
      vendorId: finalVendorId,
      status: "PENDING_PAYMENT",
      subtotal,
      shippingCost: TRANSACTION_FEE,
      totalAmount: subtotal + TRANSACTION_FEE,
      shippingMethod: "DIGITAL",
      commissionRate,
      commissionAmount,
      vendorPayoutAmount: subtotal - commissionAmount,
      referenceCode,
      expiresAt,
      customerNotes: data.customerNotes,
      items: {
        create: orderItems.map((oi) => ({
          productId: oi.productId,
          variantId: oi.variantId,
          productTitle: oi.productTitle,
          productImage: oi.productImage,
          price: oi.price,
          quantity: oi.quantity,
          totalPrice: oi.totalPrice,
          vendorId: oi.vendorId,
        })),
      },
      statusHistory: {
        create: {
          status: "PENDING_PAYMENT",
          note: "Order created",
        },
      },
      orderEvents: {
        create: {
          fromStatus: null,
          toStatus: "PENDING_PAYMENT",
          actor: "system",
          note: "Order created",
        },
      },
    },
    include: {
      items: true,
      orderEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantity: { decrement: item.quantity } },
    });
  }

  return { order, expiresAt, paymentTimeoutMinutes: PAYMENT_TIMEOUT_MINUTES, referenceCode };
}

export async function getOrder(orderId: string, userId?: string, role?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      orderEvents: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      customer: { select: { id: true, email: true, fullName: true, avatar: true } },
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  if (userId && role) {
    if (role === "CUSTOMER" && order.customerId !== userId) {
      throw new AppError("Access denied", 403, "FORBIDDEN");
    }
    if (role === "VENDOR" && order.vendorId !== userId) {
      const vendor = await prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || vendor.id !== order.vendorId) {
        throw new AppError("Access denied", 403, "FORBIDDEN");
      }
    }
  }

  const responseOrder: Record<string, unknown> = {
    ...order,
    deliveredPayload: order.status === "DELIVERED" || order.status === "COMPLETED" || order.status === "DISPUTED"
      ? order.deliveredPayload
      : null,
    expiresAt: order.expiresAt,
    paymentTimeoutMinutes: PAYMENT_TIMEOUT_MINUTES,
  };

  return responseOrder;
}

async function validateTransition(orderId: string, fromStatus: OrderStatus, toStatus: OrderStatus) {
  const allowed = VALID_TRANSITIONS[fromStatus];
  if (!allowed || !allowed.includes(toStatus)) {
    throw new AppError(
      `Invalid transition from ${fromStatus} to ${toStatus}`,
      400,
      "INVALID_TRANSITION"
    );
  }
}

export async function submitPayment(orderId: string, userId: string, paymentProofUrl?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.customerId !== userId) throw new AppError("Access denied", 403, "FORBIDDEN");
  if (order.status !== "PENDING_PAYMENT") throw new AppError("Order is not awaiting payment", 400, "INVALID_STATUS");

  if (order.expiresAt && new Date() > order.expiresAt) {
    await transitionOrder(orderId, "EXPIRED", "system", undefined, "Order expired");
    throw new AppError("Order has expired", 400, "ORDER_EXPIRED");
  }

  await validateTransition(orderId, order.status, "PAYMENT_SUBMITTED");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAYMENT_SUBMITTED",
      paymentProofUrl: paymentProofUrl || null,
      paymentSubmittedAt: new Date(),
      statusHistory: {
        create: { status: "PAYMENT_SUBMITTED", note: "Buyer submitted payment proof" },
      },
      orderEvents: {
        create: { fromStatus: order.status, toStatus: "PAYMENT_SUBMITTED", actor: "buyer", actorId: userId, note: "Payment submitted" },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return updated;
}

export async function confirmPayment(orderId: string, userId: string, role: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  if (role === "VENDOR" || role === "SUPER_ADMIN" || role === "ADMIN" || role === "SUPPORT") {
    // allowed
  } else {
    throw new AppError("Access denied", 403, "FORBIDDEN");
  }

  if (order.status !== "PAYMENT_SUBMITTED") throw new AppError("Order is not awaiting confirmation", 400, "INVALID_STATUS");
  await validateTransition(orderId, order.status, "PAYMENT_CONFIRMED");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAYMENT_CONFIRMED",
      paymentStatus: "COMPLETED",
      paidAt: new Date(),
      statusHistory: {
        create: { status: "PAYMENT_CONFIRMED", note: "Payment confirmed by admin/seller" },
      },
      orderEvents: {
        create: { fromStatus: order.status, toStatus: "PAYMENT_CONFIRMED", actor: role === "VENDOR" ? "seller" : "admin", actorId: userId, note: "Payment confirmed" },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return updated;
}

export async function deliverItem(orderId: string, userId: string, role: string, deliveredPayload: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  if (role === "VENDOR" || role === "SUPER_ADMIN" || role === "ADMIN" || role === "SUPPORT") {
    // allowed
  } else {
    throw new AppError("Access denied", 403, "FORBIDDEN");
  }

  if (order.status !== "PAYMENT_CONFIRMED") throw new AppError("Payment must be confirmed before delivery", 400, "INVALID_STATUS");
  await validateTransition(orderId, order.status, "DELIVERED");

  const encodedPayload = Buffer.from(deliveredPayload).toString("base64");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "DELIVERED",
      deliveredPayload: encodedPayload,
      deliveredAt: new Date(),
      statusHistory: {
        create: { status: "DELIVERED", note: "Digital item delivered" },
      },
      orderEvents: {
        create: { fromStatus: order.status, toStatus: "DELIVERED", actor: role === "VENDOR" ? "seller" : "admin", actorId: userId, note: "Item delivered" },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return {
    ...updated,
    deliveredPayload,
  };
}

export async function completeOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.customerId !== userId) throw new AppError("Access denied", 403, "FORBIDDEN");
  if (order.status !== "DELIVERED") throw new AppError("Item must be delivered before completion", 400, "INVALID_STATUS");

  await validateTransition(orderId, order.status, "COMPLETED");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "COMPLETED",
      deliveredAt: new Date(),
      statusHistory: {
        create: { status: "COMPLETED", note: "Buyer confirmed receipt" },
      },
      orderEvents: {
        create: { fromStatus: order.status, toStatus: "COMPLETED", actor: "buyer", actorId: userId, note: "Receipt confirmed" },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return updated;
}

export async function disputeOrder(orderId: string, userId: string, role: string, reason: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  const disputableStatuses: OrderStatus[] = ["PAYMENT_SUBMITTED", "PAYMENT_CONFIRMED", "DELIVERED"];
  if (!disputableStatuses.includes(order.status)) {
    throw new AppError("Order cannot be disputed in current status", 400, "INVALID_STATUS");
  }

  await validateTransition(orderId, order.status, "DISPUTED");

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "DISPUTED",
      disputeReason: reason,
      statusHistory: {
        create: { status: "DISPUTED", note: `Dispute: ${reason}` },
      },
      orderEvents: {
        create: { fromStatus: order.status, toStatus: "DISPUTED", actor: role === "VENDOR" ? "seller" : "buyer", actorId: userId, note: reason },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return updated;
}

export async function resolveDispute(orderId: string, userId: string, resolution: "revert" | "complete" | "cancel", note?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderEvents: { orderBy: { createdAt: "asc" }, take: 5 } },
  });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.status !== "DISPUTED") throw new AppError("Order is not in dispute", 400, "INVALID_STATUS");

  let newStatus: OrderStatus;
  const lastNonDisputedEvent = [...order.orderEvents].reverse().find(e => e.toStatus !== "DISPUTED");
  const previousStatus = (lastNonDisputedEvent?.toStatus || "PAYMENT_SUBMITTED") as OrderStatus;

  switch (resolution) {
    case "revert":
      newStatus = previousStatus;
      break;
    case "complete":
      newStatus = "COMPLETED";
      break;
    case "cancel":
      newStatus = "CANCELLED";
      break;
    default:
      throw new AppError("Invalid resolution type", 400, "INVALID_RESOLUTION");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      disputeResolvedAt: new Date(),
      disputeResolution: `${resolution}: ${note || ""}`,
      cancelledAt: newStatus === "CANCELLED" ? new Date() : undefined,
      statusHistory: {
        create: { status: newStatus, note: `Dispute resolved (${resolution}): ${note || ""}` },
      },
      orderEvents: {
        create: { fromStatus: "DISPUTED", toStatus: newStatus, actor: "admin", actorId: userId, note: `Dispute resolved: ${resolution}. ${note || ""}` },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return updated;
}

export async function extendTimer(orderId: string, userId: string, additionalMinutes: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.status !== "PENDING_PAYMENT") throw new AppError("Order is not awaiting payment", 400, "INVALID_STATUS");

  const newExpiry = new Date(Date.now() + additionalMinutes * 60 * 1000);
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      expiresAt: newExpiry,
      orderEvents: {
        create: {
          fromStatus: order.status,
          toStatus: order.status,
          actor: "admin",
          actorId: userId,
          note: `Timer extended by ${additionalMinutes} minutes`,
        },
      },
    },
    include: { orderEvents: { orderBy: { createdAt: "asc" } } },
  });

  return { ...updated, paymentTimeoutMinutes: PAYMENT_TIMEOUT_MINUTES };
}

export async function expireOrders() {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PENDING_PAYMENT", "PAYMENT_SUBMITTED"] },
      expiresAt: { lt: new Date() },
    },
  });

  for (const order of expiredOrders) {
    await transitionOrder(order.id, "EXPIRED", "system", undefined, "Order expired due to timeout");
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "EXPIRED",
        statusHistory: {
          create: { status: "EXPIRED", note: "Order expired - payment not received in time" },
        },
      },
    });
  }

  return expiredOrders.length;
}

export async function autoCompleteOrders() {
  const deadline = new Date(Date.now() - AUTO_COMPLETE_HOURS * 60 * 60 * 1000);
  const deliverableOrders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { lt: deadline },
    },
  });

  for (const order of deliverableOrders) {
    await transitionOrder(order.id, "COMPLETED", "system", undefined, "Auto-completed after 24 hours");
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        deliveredAt: new Date(),
        statusHistory: {
          create: { status: "COMPLETED", note: "Auto-completed after 24 hours of delivery" },
        },
      },
    });
  }

  return deliverableOrders.length;
}

async function transitionOrder(orderId: string, toStatus: OrderStatus, actor: string, actorId?: string, note?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  await validateTransition(orderId, order.status, toStatus);

  return prisma.orderEvent.create({
    data: {
      orderId,
      fromStatus: order.status,
      toStatus,
      actor,
      actorId,
      note,
    },
  });
}

export async function getOrdersForAdmin(filters: {
  status?: OrderStatus;
  vendorId?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.vendorId) where.vendorId = filters.vendorId;
  if (filters.customerId) where.customerId = filters.customerId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      include: {
        items: true,
        orderEvents: { orderBy: { createdAt: "asc" } },
        customer: { select: { id: true, email: true, fullName: true } },
        vendor: { select: { id: true, storeName: true } },
      },
      orderBy: [{ expiresAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: where as any }),
  ]);

  return { orders, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getOrdersForUser(userId: string, role: string, filters: { status?: OrderStatus; page?: number; limit?: number }) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;

  if (role === "CUSTOMER") {
    where.customerId = userId;
  } else if (role === "VENDOR") {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (vendor) where.vendorId = vendor.id;
    else return { orders: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      include: {
        items: true,
        orderEvents: { orderBy: { createdAt: "asc" } },
        vendor: { select: { id: true, storeName: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: where as any }),
  ]);

  return { orders, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export function getBankDetails() {
  return {
    bankName: "Dialog Finance PLC",
    accountName: "Sahan Nawarathne",
    accountNumber: "001020613595",
    branch: "Head Office",
    instructions: "Use the reference code exactly as shown. Include it in your transfer description to ensure automatic matching.",
  };
}
