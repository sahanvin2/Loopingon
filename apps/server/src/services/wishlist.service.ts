import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { generateShareToken } from "../utils/otp.js";

export async function getWishlist(userId: string) {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              compareAtPrice: true,
              averageRating: true,
              reviewCount: true,
              status: true,
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              vendor: { select: { id: true, storeName: true, storeSlug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: {
        items: { include: { product: true } },
      },
    }) as any;
  }

  return wishlist;
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId, deletedAt: null } });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId } });
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existingItem) throw new AppError("Product already in wishlist", 409, "ALREADY_IN_WISHLIST");

  const item = await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
      addedPrice: product.price,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { wishlistCount: { increment: 1 } },
  });

  return item;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) throw new AppError("Wishlist not found", 404, "WISHLIST_NOT_FOUND");

  const item = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (!item) throw new AppError("Item not in wishlist", 404, "WISHLIST_ITEM_NOT_FOUND");

  await prisma.wishlistItem.delete({ where: { id: item.id } });

  await prisma.product.update({
    where: { id: productId },
    data: { wishlistCount: { decrement: 1 } },
  });
}

export async function shareWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) throw new AppError("Wishlist not found", 404, "WISHLIST_NOT_FOUND");

  const shareToken = generateShareToken();

  await prisma.wishlist.update({
    where: { id: wishlist.id },
    data: { isPublic: true },
  });

  return {
    shareId: wishlist.id,
    shareToken,
    url: `${process.env.FRONTEND_URL}/wishlist/shared/${wishlist.id}?token=${shareToken}`,
  };
}

export async function getSharedWishlist(shareId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: shareId, isPublic: true },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              compareAtPrice: true,
              averageRating: true,
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              vendor: { select: { id: true, storeName: true, storeSlug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      user: { select: { id: true, fullName: true } },
    },
  });

  if (!wishlist) throw new AppError("Shared wishlist not found", 404, "WISHLIST_NOT_FOUND");
  return wishlist;
}
