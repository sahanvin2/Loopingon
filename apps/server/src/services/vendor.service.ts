import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { logger } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";
import { addShippingUpdateJob } from "../workers/email.worker.js";
import { reverseOrderSideEffects } from "./order.service.js";

export async function applyVendor(
  userId: string,
  data: {
    storeName: string;
    storeSlug: string;
    storeDescription: string;
    businessName?: string;
    businessRegistrationNo?: string;
    businessType?: string;
    taxId?: string;
    craftType?: string[];
    craftDescription?: string;
    yearsOfExperience?: number;
    workshopLocation?: string;
    workshopCity?: string;
    workshopDistrict?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
  }
) {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const existingVendor = await prisma.vendor.findUnique({ where: { userId } });
  if (existingVendor) throw new AppError("Vendor application already exists", 409, "VENDOR_ALREADY_EXISTS");

  const existingSlug = await prisma.vendor.findUnique({ where: { storeSlug: data.storeSlug } });
  if (existingSlug) throw new AppError("Store slug already taken", 409, "SLUG_TAKEN");

  const existingStoreName = await prisma.vendor.findUnique({ where: { storeName: data.storeName } });
  if (existingStoreName) throw new AppError("Store name already taken", 409, "STORE_NAME_TAKEN");

  const vendor = await prisma.vendor.create({
    data: {
      userId,
      storeName: data.storeName,
      storeSlug: data.storeSlug,
      storeDescription: data.storeDescription,
      businessName: data.businessName,
      businessRegistrationNo: data.businessRegistrationNo,
      businessType: data.businessType,
      taxId: data.taxId,
      craftType: data.craftType || [],
      craftDescription: data.craftDescription,
      yearsOfExperience: data.yearsOfExperience,
      workshopLocation: data.workshopLocation,
      workshopCity: data.workshopCity,
      workshopDistrict: data.workshopDistrict,
      websiteUrl: data.websiteUrl,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      youtubeUrl: data.youtubeUrl,
      tiktokUrl: data.tiktokUrl,
      status: "PENDING",
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: "VENDOR" },
  });

  return vendor;
}

export async function getApplicationStatus(userId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { userId } });
  if (!vendor) throw new AppError("Vendor application not found", 404, "VENDOR_NOT_FOUND");

  return {
    status: vendor.status,
    verificationNotes: vendor.verificationNotes,
    verifiedAt: vendor.verifiedAt,
    storeName: vendor.storeName,
    storeSlug: vendor.storeSlug,
  };
}

export async function uploadDocuments(
  vendorId: string,
  files: Array<{ docType: string; docUrl: string; docName: string }>
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  const docs = await Promise.all(
    files.map((file) =>
      prisma.vendorVerificationDoc.create({
        data: {
          vendorId,
          docType: file.docType,
          docUrl: file.docUrl,
          docName: file.docName,
        },
      })
    )
  );

  return docs;
}

export async function getStorefrontBySlug(slug: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { storeSlug: slug, deletedAt: null },
    include: {
      storefrontSettings: true,
      products: {
        where: { status: "PUBLISHED", deletedAt: null },
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!vendor) throw new AppError("Store not found", 404, "STORE_NOT_FOUND");
  if (vendor.status !== "VERIFIED") throw new AppError("Store is not yet verified", 403, "STORE_NOT_VERIFIED");

  const productCount = await prisma.product.count({
    where: { vendorId: vendor.id, status: "PUBLISHED", deletedAt: null },
  });

  return {
    ...vendor,
    productCount,
  };
}

export async function getVendors(
  page?: number,
  limit?: number,
  filters?: {
    craftType?: string;
    location?: string;
    rating?: number;
    search?: string;
    status?: string;
  }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.VendorWhereInput = {
    status: filters?.status as any || "VERIFIED",
    deletedAt: null,
  };

  if (filters?.craftType) {
    where.craftType = { has: filters.craftType };
  }
  if (filters?.location) {
    where.OR = [
      { workshopCity: { contains: filters.location, mode: "insensitive" } },
      { workshopDistrict: { contains: filters.location, mode: "insensitive" } },
    ];
  }
  if (filters?.rating) {
    where.rating = { gte: filters.rating };
  }
  if (filters?.search) {
    where.OR = [
      ...(where.OR as any[] || []),
      { storeName: { contains: filters.search, mode: "insensitive" } },
      { storeDescription: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: { storefrontSettings: true },
      orderBy: { rating: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.vendor.count({ where }),
  ]);

  return buildPaginationResult(vendors, total, p, l);
}

export async function getVendorReviews(vendorId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);

  const where = { vendorId, deletedAt: null, isHidden: false };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { customer: { select: { id: true, fullName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.review.count({ where }),
  ]);

  return buildPaginationResult(reviews, total, p, l);
}

export async function getDashboardOverview(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, todayRevenue] = await Promise.all([
    prisma.order.count({
      where: { vendorId, createdAt: { gte: today } },
    }),
    prisma.order.aggregate({
      where: { vendorId, createdAt: { gte: today } },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalProducts: vendor.totalProducts,
    totalOrders: vendor.totalOrders,
    totalRevenue: vendor.totalRevenue,
    todayOrders,
    todayRevenue: todayRevenue._sum.totalAmount || 0,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    responseRate: vendor.responseRate,
    pendingPayoutAmount: vendor.pendingPayoutAmount,
    vacationMode: vendor.vacationMode,
  };
}

export async function getDashboardAnalytics(vendorId: string, period: "7d" | "30d" | "90d" | "1y" = "30d") {
  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[period] || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [analytics, orders] = await Promise.all([
    prisma.vendorAnalytics.findMany({
      where: { vendorId, date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.order.groupBy({
      by: ["createdAt"],
      where: { vendorId, createdAt: { gte: since } },
      _count: { id: true },
      _sum: { totalAmount: true },
    }),
  ]);

  return { analytics, orderSummary: orders };
}

export async function getVendorProducts(
  vendorId: string,
  page?: number,
  limit?: number,
  filters?: { status?: string; search?: string; categoryId?: string }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.ProductWhereInput = { vendorId, deletedAt: null };

  if (filters?.status) where.status = filters.status as any;
  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }
  if (filters?.categoryId) {
    where.categories = { some: { categoryId: filters.categoryId } };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginationResult(products, total, p, l);
}

export async function createProduct(
  vendorId: string,
  data: {
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    quantity: number;
    sku?: string;
    craftType?: string;
    materials?: string[];
    dimensions?: Record<string, unknown>;
    weight?: number;
    processingTime?: number;
    shippingPrice?: number;
    categoryIds?: string[];
    tags?: string[];
    isHandmade?: boolean;
    isCustomizable?: boolean;
    isEcoFriendly?: boolean;
    isFairTrade?: boolean;
  }
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  const existing = await prisma.vendor.findUnique({ where: { storeSlug: data.slug } });
  if (existing) throw new AppError("Product slug already taken", 409, "SLUG_TAKEN");

  const product = await prisma.product.create({
    data: {
      vendorId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      costPrice: data.costPrice,
      quantity: data.quantity,
      sku: data.sku,
      craftType: data.craftType,
      materials: data.materials || [],
      dimensions: data.dimensions as any,
      weight: data.weight,
      processingTime: data.processingTime,
      shippingPrice: data.shippingPrice,
      isHandmade: data.isHandmade ?? true,
      isCustomizable: data.isCustomizable ?? false,
      isEcoFriendly: data.isEcoFriendly ?? false,
      isFairTrade: data.isFairTrade ?? false,
      status: "DRAFT",
      categories: data.categoryIds
        ? {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          }
        : undefined,
      tags: data.tags
        ? {
            create: data.tags.map((tag) => ({ tag })),
          }
        : undefined,
      images: (data as any).images && Array.isArray((data as any).images) && (data as any).images.length > 0
        ? {
            create: (data as any).images.map((img: any, index: number) => ({
              url: img.url,
              thumbnail: img.url,
              medium: img.url,
              large: img.url,
              sortOrder: img.sortOrder ?? index,
              isPrimary: img.isPrimary ?? index === 0,
            })),
          }
        : undefined,
    },
    include: {
      images: true,
      categories: { include: { category: true } },
      tags: true,
    },
  });

  return product;
}

export async function updateProduct(
  productId: string,
  vendorId: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    compareAtPrice?: number;
    quantity?: number;
    sku?: string;
    craftType?: string;
    materials?: string[];
    dimensions?: Record<string, unknown>;
    weight?: number;
    processingTime?: number;
    shippingPrice?: number;
    isHandmade?: boolean;
    isCustomizable?: boolean;
    isEcoFriendly?: boolean;
    isFairTrade?: boolean;
    categoryIds?: string[];
    tags?: string[];
  }
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, vendorId, deletedAt: null },
  });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  if (data.slug && data.slug !== product.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError("Product slug already taken", 409, "SLUG_TAKEN");
  }

  const updateData: any = { ...data };
  delete updateData.categoryIds;
  delete updateData.tags;
  delete updateData.images;

  if (data.categoryIds) {
    await prisma.productCategory.deleteMany({ where: { productId } });
    await prisma.productCategory.createMany({
      data: data.categoryIds.map((categoryId) => ({ productId, categoryId })),
    });
  }

  if (data.tags) {
    await prisma.productTag.deleteMany({ where: { productId } });
    await prisma.productTag.createMany({
      data: data.tags.map((tag) => ({ productId, tag })),
    });
  }

  if ((data as any).images && Array.isArray((data as any).images)) {
    await prisma.productImage.deleteMany({ where: { productId } });
    const images = (data as any).images;
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId,
          url: img.url,
          thumbnail: img.url,
          medium: img.url,
          large: img.url,
          sortOrder: img.sortOrder ?? index,
          isPrimary: img.isPrimary ?? index === 0,
        })),
      });
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: { images: true, categories: { include: { category: true } }, tags: true },
  });
}

export async function deleteProduct(productId: string, vendorId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, vendorId, deletedAt: null },
  });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  await prisma.product.update({
    where: { id: productId },
    data: { deletedAt: new Date(), status: "DISCONTINUED" },
  });

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { totalProducts: { decrement: 1 } },
  });
}

export async function addProductImage(
  productId: string,
  vendorId: string,
  files: Array<{
    url: string;
    thumbnail: string;
    medium: string;
    large: string;
    alt?: string;
    width?: number;
    height?: number;
    sizeBytes?: number;
  }>
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, vendorId, deletedAt: null },
  });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  const existingCount = await prisma.productImage.count({ where: { productId } });

  const images = await Promise.all(
    files.map((file, index) =>
      prisma.productImage.create({
        data: {
          productId,
          url: file.url,
          thumbnail: file.thumbnail,
          medium: file.medium,
          large: file.large,
          alt: file.alt,
          width: file.width,
          height: file.height,
          sizeBytes: file.sizeBytes,
          sortOrder: existingCount + index,
          isPrimary: existingCount === 0 && index === 0,
        },
      })
    )
  );

  return images;
}

export async function deleteProductImage(imageId: string, vendorId: string) {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: { select: { vendorId: true } } },
  });

  if (!image || image.product.vendorId !== vendorId) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  await prisma.productImage.delete({ where: { id: imageId } });
}

export async function addProductVideo(
  productId: string,
  vendorId: string,
  file: { url: string; thumbnailUrl?: string; duration?: number }
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, vendorId, deletedAt: null },
  });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  return prisma.productVideo.create({
    data: {
      productId,
      url: file.url,
      thumbnailUrl: file.thumbnailUrl,
      duration: file.duration,
    },
  });
}

export async function getVendorOrders(
  vendorId: string,
  page?: number,
  limit?: number,
  filters?: { status?: string; fromDate?: Date; toDate?: Date; search?: string }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.OrderWhereInput = { vendorId };

  if (filters?.status) where.status = filters.status as any;
  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
    if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
  }
  if (filters?.search) {
    where.orderNumber = { contains: filters.search, mode: "insensitive" };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { select: { id: true, productTitle: true, productImage: true, quantity: true, price: true } },
        customer: { select: { id: true, fullName: true } },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.order.count({ where }),
  ]);

  return buildPaginationResult(orders, total, p, l);
}

export async function getVendorOrderDetail(orderId: string, vendorId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, vendorId },
    include: {
      items: { include: { product: { select: { id: true, title: true, slug: true } } } },
      customer: { select: { id: true, fullName: true, email: true, phone: true } },
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      shipments: true,
    },
  });

  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  vendorId: string,
  status: string,
  note?: string,
  trackingInfo?: { courierName?: string; trackingNumber?: string; trackingUrl?: string }
) {
  const order = await prisma.order.findFirst({ where: { id: orderId, vendorId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  const updateData: any = {
    status: status as any,
  };

  if (status === "SHIPPED") {
    updateData.shippedAt = new Date();
    if (trackingInfo) {
      updateData.courierName = trackingInfo.courierName;
      updateData.trackingNumber = trackingInfo.trackingNumber;
      updateData.trackingUrl = trackingInfo.trackingUrl;
    }
  }
  if (status === "DELIVERED") {
    updateData.deliveredAt = new Date();
    updateData.actualDelivery = new Date();
  }

  const [updatedOrder] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: updateData,
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: status as any,
        note,
        changedBy: vendorId,
      },
    }),
  ]);

  if (trackingInfo?.trackingNumber) {
    await prisma.shipment.create({
      data: {
        orderId,
        courierName: trackingInfo.courierName || "Unknown",
        trackingNumber: trackingInfo.trackingNumber,
        trackingUrl: trackingInfo.trackingUrl,
        status: "shipped",
        shippedAt: new Date(),
      },
    });
  }

  // Send shipping update email to customer
  try {
    const orderWithCustomer = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: { select: { email: true, fullName: true } } },
    });

    if (orderWithCustomer?.customer) {
      await addShippingUpdateJob(
        orderWithCustomer.customer.email,
        orderWithCustomer.orderNumber,
        trackingInfo?.trackingNumber || "",
        status,
        orderWithCustomer.customer.fullName,
        trackingInfo?.trackingUrl,
        trackingInfo?.courierName,
        status === "DELIVERED" ? "Delivered" : undefined
      );
    }
  } catch (err) {
    logger.warn("Failed to queue shipping update email", err);
  }

  if (["CANCELLED", "REFUNDED", "RETURNED", "RETURN_REQUESTED"].includes(updatedOrder.status)) {
    await reverseOrderSideEffects(orderId, order.customerId, Number(order.totalAmount));
  }

  return updatedOrder;
}

export async function getVendorPayouts(vendorId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = { vendorId };

  const [payouts, total] = await Promise.all([
    prisma.payoutSchedule.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.payoutSchedule.count({ where }),
  ]);

  return buildPaginationResult(payouts, total, p, l);
}

export async function getPayoutDetail(payoutId: string, vendorId: string) {
  const payout = await prisma.payoutSchedule.findFirst({ where: { id: payoutId, vendorId } });
  if (!payout) throw new AppError("Payout not found", 404, "PAYOUT_NOT_FOUND");
  return payout;
}

export async function addBankDetail(
  vendorId: string,
  data: {
    bankName: string;
    branchName: string;
    accountHolderName: string;
    accountNumber: string;
    accountType: string;
    isPrimary?: boolean;
  }
) {
  if (data.isPrimary) {
    await prisma.vendorBankDetail.updateMany({
      where: { vendorId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  return prisma.vendorBankDetail.create({
    data: {
      vendorId,
      bankName: data.bankName,
      branchName: data.branchName,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      isPrimary: data.isPrimary || false,
    },
  });
}

export async function updateBankDetail(
  detailId: string,
  vendorId: string,
  data: {
    bankName?: string;
    branchName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    accountType?: string;
    isPrimary?: boolean;
  }
) {
  const bankDetail = await prisma.vendorBankDetail.findFirst({
    where: { id: detailId, vendorId, deletedAt: null },
  });
  if (!bankDetail) throw new AppError("Bank detail not found", 404, "BANK_DETAIL_NOT_FOUND");

  if (data.isPrimary) {
    await prisma.vendorBankDetail.updateMany({
      where: { vendorId, isPrimary: true, id: { not: detailId } },
      data: { isPrimary: false },
    });
  }

  return prisma.vendorBankDetail.update({
    where: { id: detailId },
    data,
  });
}

export async function deleteBankDetail(detailId: string, vendorId: string) {
  const bankDetail = await prisma.vendorBankDetail.findFirst({
    where: { id: detailId, vendorId, deletedAt: null },
  });
  if (!bankDetail) throw new AppError("Bank detail not found", 404, "BANK_DETAIL_NOT_FOUND");

  await prisma.vendorBankDetail.update({
    where: { id: detailId },
    data: { deletedAt: new Date() },
  });
}

export async function updateStorefrontSettings(
  vendorId: string,
  data: {
    themeColor?: string;
    customCss?: string;
    featuredProducts?: string[];
    aboutSection?: string;
    policies?: Record<string, unknown>;
    storySection?: string;
    videoUrl?: string;
  }
) {
  const existing = await prisma.storefrontSettings.findUnique({ where: { vendorId } });

  if (existing) {
    return prisma.storefrontSettings.update({ where: { vendorId }, data: { ...data, policies: data.policies as any } });
  }

  return prisma.storefrontSettings.create({
    data: { vendorId, ...data, featuredProducts: data.featuredProducts || [], policies: data.policies as any },
  });
}

export async function updateVendorSettings(
  vendorId: string,
  data: {
    vacationMode?: boolean;
    freeShippingEnabled?: boolean;
    freeShippingMinOrder?: number;
    storeDescription?: string;
    storeLogo?: string;
    storeBanner?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
  }
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  return prisma.vendor.update({
    where: { id: vendorId },
    data,
  });
}

export async function reorderProductImages(productId: string, vendorId: string, imageIds: string[]) {
  const product = await prisma.product.findUnique({ where: { id: productId, vendorId } });
  if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  await Promise.all(imageIds.map((id, index) => prisma.productImage.update({ where: { id, productId }, data: { sortOrder: index } })));
}
