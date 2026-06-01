import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        where: { isActive: true, deletedAt: null },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug, deletedAt: null },
    include: {
      parent: true,
      children: {
        where: { isActive: true, deletedAt: null },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!category) throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  return category;
}

export async function getCategoryProducts(
  slug: string,
  page?: number,
  limit?: number,
  filters?: {
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sortBy?: string;
    craftType?: string;
  }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    categories: { some: { categoryId: category.id } },
  };

  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    where.price = {};
    if (filters.priceMin !== undefined) (where.price as any).gte = filters.priceMin;
    if (filters.priceMax !== undefined) (where.price as any).lte = filters.priceMax;
  }
  if (filters?.rating) where.averageRating = { gte: filters.rating };
  if (filters?.craftType) where.craftType = filters.craftType;

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (filters?.sortBy) {
    case "price_asc": orderBy = { price: "asc" }; break;
    case "price_desc": orderBy = { price: "desc" }; break;
    case "rating": orderBy = { averageRating: "desc" }; break;
    case "popular": orderBy = { salesCount: "desc" }; break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true } },
      },
      orderBy,
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginationResult(products, total, p, l);
}

export async function getFeaturedCategories() {
  return prisma.category.findMany({
    where: { isFeatured: true, isActive: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryTree() {
  const roots = await prisma.category.findMany({
    where: { parentId: null, isActive: true, deletedAt: null },
    include: {
      children: {
        where: { isActive: true, deletedAt: null },
        include: {
          children: {
            where: { isActive: true, deletedAt: null },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return roots;
}
