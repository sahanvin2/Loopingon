import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { logger } from "../middleware/errorHandler.middleware.js";

export async function getCart(userId: string) {
  let cart = await prisma.cart.findUnique({
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
              quantity: true,
              status: true,
              freeShippingDomestic: true,
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              vendor: { select: { id: true, storeName: true, storeSlug: true, freeShippingEnabled: true, freeShippingMinOrder: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: true } },
      },
    }) as any;
  }

  return cart;
}

export async function addToCart(
  userId: string,
  productId: string,
  variantId?: string,
  quantity: number = 1
) {
  const product = await prisma.product.findUnique({
    where: { id: productId, deletedAt: null },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
  if (product.status !== "PUBLISHED") throw new AppError("Product is not available", 400, "PRODUCT_UNAVAILABLE");
  if (product.quantity < quantity) throw new AppError("Insufficient stock", 400, "INSUFFICIENT_STOCK");

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError("Variant not found", 404, "VARIANT_NOT_FOUND");
    }
    if (variant.quantity < quantity) throw new AppError("Insufficient variant stock", 400, "INSUFFICIENT_STOCK");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId || null },
  });

  let item;
  const price = variantId
    ? (await prisma.productVariant.findUnique({ where: { id: variantId } }))?.price || product.price
    : product.price;

  if (existingItem) {
    item = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity, price: price as any },
    });
  } else {
    item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
        price: price as any,
      },
    });
  }


  return item;
}

export async function updateCartItem(itemId: string, userId: string, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404, "CART_NOT_FOUND");

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: true },
  });

  if (!item) throw new AppError("Cart item not found", 404, "CART_ITEM_NOT_FOUND");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return null;
  }

  if (item.product.quantity < quantity) {
    throw new AppError("Insufficient stock", 400, "INSUFFICIENT_STOCK");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

export async function removeCartItem(itemId: string, userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) return;

  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function mergeGuestCart(
  userId: string,
  guestCartItems: Array<{ productId: string; variantId?: string; quantity: number }>
) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  for (const guestItem of guestCartItems) {
    const product = await prisma.product.findUnique({ where: { id: guestItem.productId, deletedAt: null } });
    if (!product || product.status !== "PUBLISHED") continue;

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: guestItem.productId, variantId: guestItem.variantId || null },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + guestItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId || null,
          quantity: guestItem.quantity,
          price: product.price,
        },
      });
    }
  }

  return getCart(userId);
}
