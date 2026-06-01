import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function search(
  query: string,
  filters?: {
    category?: string;
    craftType?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    vendorId?: string;
    page?: number;
    limit?: number;
  }
) {
  const { page: p, limit: l } = getPaginationParams(filters?.page, filters?.limit);

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { tags: { some: { tag: { contains: query, mode: "insensitive" } } } },
      { vendor: { storeName: { contains: query, mode: "insensitive" } } },
    ],
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
  if (filters?.vendorId) {
    where.vendorId = filters.vendorId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, rating: true, storeLogo: true } },
      },
      orderBy: { salesCount: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginationResult(products, total, p, l);
}

export async function getSuggestions(query: string, limit: number = 5) {
  if (!query || query.length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      title: { contains: query, mode: "insensitive" },
    },
    select: { id: true, title: true, slug: true },
    take: limit,
    orderBy: { salesCount: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      name: { contains: query, mode: "insensitive" },
    },
    select: { id: true, name: true, slug: true },
    take: 3,
  });

  const vendors = await prisma.vendor.findMany({
    where: {
      status: "VERIFIED",
      deletedAt: null,
      storeName: { contains: query, mode: "insensitive" },
    },
    select: { id: true, storeName: true, storeSlug: true },
    take: 3,
  });

  return {
    products,
    categories,
    vendors,
  };
}

export async function getTrendingSearches(limit: number = 10) {
  // In production, track searches in a SearchLog table and aggregate
  // For now, return trending products as proxy
  return prisma.product.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { id: true, title: true, slug: true, salesCount: true },
    orderBy: { salesCount: "desc" },
    take: limit,
  });
}
