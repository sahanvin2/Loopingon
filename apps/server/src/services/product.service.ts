import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function getProducts(
  page?: number,
  limit?: number,
  filters?: {
    category?: string;
    craftType?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    location?: string;
    materials?: string[];
    search?: string;
    sortBy?: string;
    vendorId?: string;
    isFeatured?: boolean;
    isHandmade?: boolean;
    isEcoFriendly?: boolean;
    onSale?: boolean;
  }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (filters?.category) {
    where.categories = { some: { category: { slug: filters.category } } };
  }
  if (filters?.craftType) {
    where.craftType = filters.craftType;
  }
  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    where.price = {};
    if (filters.priceMin !== undefined) (where.price as any).gte = filters.priceMin;
    if (filters.priceMax !== undefined) (where.price as any).lte = filters.priceMax;
  }
  if (filters?.rating) {
    where.averageRating = { gte: filters.rating };
  }
  if (filters?.materials && filters.materials.length > 0) {
    where.materials = { hasSome: filters.materials };
  }
  if (filters?.vendorId) {
    where.vendorId = filters.vendorId;
  }
  if (filters?.isFeatured) {
    where.isFeatured = true;
  }
  if (filters?.isHandmade) {
    where.isHandmade = true;
  }
  if (filters?.isEcoFriendly) {
    where.isEcoFriendly = true;
  }
  if (filters?.onSale) {
    where.compareAtPrice = { not: null };
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { quantity: "desc" },
    { createdAt: "desc" },
  ];
  switch (filters?.sortBy) {
    case "price_asc":
      orderBy = [{ quantity: "desc" }, { price: "asc" }];
      break;
    case "price_desc":
      orderBy = [{ quantity: "desc" }, { price: "desc" }];
      break;
    case "rating":
      orderBy = [{ quantity: "desc" }, { averageRating: "desc" }];
      break;
    case "newest":
      orderBy = [{ quantity: "desc" }, { createdAt: "desc" }];
      break;
    case "popular":
      orderBy = [{ quantity: "desc" }, { salesCount: "desc" }];
      break;
    case "views":
      orderBy = [{ quantity: "desc" }, { viewsCount: "desc" }];
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true, storeLogo: true } },
        categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy,
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginationResult(products, total, p, l);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      vendor: {
        select: {
          id: true,
          storeName: true,
          storeSlug: true,
          storeLogo: true,
          storeBanner: true,
          rating: true,
          reviewCount: true,
          totalProducts: true,
          workshopCity: true,
          status: true,
        },
      },
      categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      tags: true,
    },
  });

  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
  if (product.vendor.status !== "VERIFIED" && product.vendor.status !== undefined) {
    // Still allow viewing but mark vendor status
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { viewsCount: { increment: 1 } },
  });

  return product;
}

export async function getProductReviews(
  slug: string,
  page?: number,
  limit?: number,
  sort?: string
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  const where = { productId: product.id, deletedAt: null, isHidden: false };

  let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "highest") orderBy = { rating: "desc" };
  if (sort === "lowest") orderBy = { rating: "asc" };
  if (sort === "helpful") orderBy = { helpfulCount: "desc" };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { customer: { select: { id: true, fullName: true, avatar: true } } },
      orderBy,
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.review.count({ where }),
  ]);

  return buildPaginationResult(reviews, total, p, l);
}

export async function getFeaturedProducts(limit: number = 10) {
  return prisma.product.findMany({
    where: { isFeatured: true, status: "PUBLISHED", deletedAt: null },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTrendingProducts(limit: number = 10) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get most viewed/purchased products from interactions in the last 30 days
  const interactions = await prisma.productInteraction.groupBy({
    by: ['productId'],
    _count: { productId: true },
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { _count: { productId: 'desc' } },
    take: limit,
  });

  const productIds = interactions.map((i) => i.productId);

  if (productIds.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "PUBLISHED", deletedAt: null },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
      },
    });

    // Sort to match interaction counts
    return products.sort((a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id));
  } else {
    // Fallback if no tracking data yet
    return prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
      },
      orderBy: { viewsCount: "desc" },
      take: limit,
    });
  }
}

export async function getRecentlyViewedProducts(cookieId: string, limit: number = 10) {
  const interactions = await prisma.productInteraction.findMany({
    where: { 
      session: { cookieId }, 
      type: 'VIEW' 
    },
    select: { productId: true },
    orderBy: { createdAt: 'desc' },
    distinct: ['productId'],
    take: limit,
  });

  const productIds = interactions.map((i) => i.productId);

  if (productIds.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "PUBLISHED", deletedAt: null },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
      },
    });
    return products.sort((a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id));
  }
  return [];
}

export async function getNewArrivals(limit: number = 10) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getDeals(limit: number = 10) {
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      compareAtPrice: { not: null },
    },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRecommendedProducts(userId?: string, limit: number = 10) {
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

    return prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [
          craftTypes.size > 0 ? { craftType: { in: Array.from(craftTypes) } } : {},
          vendorIds.size > 0 ? { vendorId: { in: Array.from(vendorIds) } } : {},
        ].filter((c) => Object.keys(c).length > 0),
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
      },
      orderBy: { averageRating: "desc" },
      take: limit,
    });
  }

  return prisma.product.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
    orderBy: { salesCount: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(productId: string, limit: number = 6) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { categories: true },
  });

  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      id: { not: productId },
      OR: [
        ...(product.categories.length > 0
          ? [{ categories: { some: { categoryId: { in: product.categories.map((c) => c.categoryId) } } } }]
          : []),
        { vendorId: product.vendorId },
      ],
    },
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      vendor: { select: { id: true, storeName: true, storeSlug: true } },
    },
    orderBy: { salesCount: "desc" },
    take: limit,
  });
}
