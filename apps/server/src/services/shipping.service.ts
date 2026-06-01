import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export async function getShippingRates(weight?: number, dimensions?: Record<string, number>, destination?: string) {
  const where: Record<string, unknown> = { isActive: true };

  if (weight) {
    where.weightLimit = { gte: weight };
  }

  return prisma.shippingRate.findMany({
    where: where as any,
    orderBy: { domesticRate: "asc" },
  });
}

export async function calculateShipping(
  address: { city?: string; district?: string; country?: string },
  items: Array<{ productId: string; variantId?: string; quantity: number }>
) {
  let totalWeight = 0;
  let freeShippingAll = true;

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;

    totalWeight += (product.weight || 0.5) * item.quantity;

    if (!product.freeShippingDomestic) {
      freeShippingAll = false;
    }
  }

  const destination = address.country || "LK";

  if (freeShippingAll && destination === "LK") {
    return {
      rates: [],
      selected: {
        method: "FREE",
        cost: 0,
        estimatedDays: 5,
        name: "Free Shipping",
      },
      totalWeight,
      destination,
    };
  }

  const shippingRates = await prisma.shippingRate.findMany({
    where: { isActive: true },
    orderBy: { domesticRate: "asc" },
  });

  const rates = shippingRates.map((rate) => {
    const cost = destination === "LK" ? Number(rate.domesticRate) : Number(rate.internationalRate);
    const weightMultiplier = totalWeight > 1 ? Math.ceil(totalWeight) : 1;

    return {
      id: rate.id,
      name: rate.name,
      courierName: rate.courierName,
      cost: cost * weightMultiplier,
      estimatedDays: rate.estimatedDays,
      freeShippingMinAmount: rate.freeShippingMinAmount ? Number(rate.freeShippingMinAmount) : null,
    };
  });

  return {
    rates,
    selected: rates.length > 0 ? { ...rates[0], method: "STANDARD" } : null,
    totalWeight,
    destination,
  };
}

export async function trackShipment(trackingNumber: string) {
  const shipment = await prisma.shipment.findFirst({
    where: { trackingNumber },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          estimatedDelivery: true,
          shippingAddress: {
            select: {
              city: true,
              district: true,
              country: true,
              postalCode: true,
            },
          },
        },
      },
    },
  });

  if (!shipment) throw new AppError("Shipment not found", 404, "SHIPMENT_NOT_FOUND");
  return shipment;
}

export async function updateTracking(
  orderId: string,
  courierName: string,
  trackingNumber: string,
  trackingUrl?: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  const existingShipment = await prisma.shipment.findFirst({
    where: { orderId, trackingNumber },
  });

  if (existingShipment) {
    return prisma.shipment.update({
      where: { id: existingShipment.id },
      data: {
        courierName,
        trackingUrl,
        statusUpdatedAt: new Date(),
      },
    });
  }

  return prisma.shipment.create({
    data: {
      orderId,
      courierName,
      trackingNumber,
      trackingUrl,
      status: "shipped",
      shippedAt: new Date(),
      estimatedDelivery: order.estimatedDelivery,
    },
  });
}
