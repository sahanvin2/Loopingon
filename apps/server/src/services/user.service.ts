import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";
import * as orderService from "./order.service.js";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    include: {
      customerProfile: true,
      addresses: {
        where: { deletedAt: null },
        orderBy: { isDefault: "desc" },
      },
      vendor: true,
    },
  });

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const { passwordHash, twoFactorSecret, twoFactorBackupCodes, ...userWithoutSensitive } = user;
  return userWithoutSensitive;
}

export async function updateProfile(
  userId: string,
  data: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    include: { customerProfile: true },
  });

  const { passwordHash, twoFactorSecret, twoFactorBackupCodes, ...result } = updated;
  return result;
}

export async function deleteAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date(), isActive: false },
  });
}

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(
  userId: string,
  data: {
    label?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    province?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
    isBilling?: boolean;
    latitude?: number;
    longitude?: number;
    deliveryNotes?: string;
  }
) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      district: data.district,
      province: data.province,
      postalCode: data.postalCode,
      country: data.country || "LK",
      isDefault: data.isDefault || false,
      isBilling: data.isBilling || false,
      latitude: data.latitude,
      longitude: data.longitude,
      deliveryNotes: data.deliveryNotes,
    },
  });
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: {
    label?: string;
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
    isBilling?: boolean;
    latitude?: number;
    longitude?: number;
    deliveryNotes?: string;
  }
) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });
  if (!address) throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
}

export async function deleteAddress(addressId: string, userId: string) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });
  if (!address) throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");

  await prisma.address.update({
    where: { id: addressId },
    data: { deletedAt: new Date() },
  });
}

export async function setDefaultAddress(addressId: string, userId: string) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });
  if (!address) throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);

  return prisma.address.findUnique({ where: { id: addressId } });
}

export async function getUserOrders(
  userId: string,
  page?: number,
  limit?: number,
  status?: string
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Record<string, unknown> = { customerId: userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { select: { id: true, title: true, slug: true } } } },
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

export async function getOrderDetail(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: { take: 1, orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
      shipments: true,
      vendor: { select: { id: true, userId: true, storeName: true, storeSlug: true, storeLogo: true } },
      shippingAddress: true,
    },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  return order;
}

export async function uploadAvatar(userId: string, _file: Express.Multer.File) {
  // In production, upload to AWS S3 / DigitalOcean Spaces
  // const result = await s3Client.upload({ ... });
  // const url = result.Location;
  const url = `/uploads/avatars/${userId}.jpg`;

  await prisma.user.update({
    where: { id: userId },
    data: { avatar: url },
  });

  return { url };
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.customerId !== userId) throw new AppError("Unauthorized", 403, "UNAUTHORIZED");

  // Check if within 24 hours
  const hoursSinceOrder = (new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSinceOrder > 24) {
    throw new AppError("Order can only be cancelled within 24 hours of placement", 400, "CANCEL_TIMEOUT");
  }

  // Ensure it's not already shipped or delivered
  if (["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED", "SHIPPED", "READY_TO_SHIP"].includes(order.status)) {
    throw new AppError("Order cannot be cancelled at this stage", 400, "INVALID_STATE");
  }

  return await orderService.cancelOrder(orderId, userId, "Cancelled by customer request");
}
