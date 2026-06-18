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
  const destination = address.country || "LK";
  const subtotal = 0;

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;

    totalWeight += (product.weight || 0.5) * item.quantity;

    if (!product.freeShippingDomestic) {
      freeShippingAll = false;
    }
  }

  // Koombiyo base rate: Rs. 350 for up to 2kg
  // Additional weight: Rs. 50 per kg above 2kg
  // Express (next day): Rs. 650 flat rate
  // Free: orders over Rs. 5,000

  const weightKg = Math.ceil(Math.max(totalWeight, 1));
  const koombiyoCost = 350 + (weightKg > 2 ? (weightKg - 2) * 50 : 0);
  const expressCost = 650;

  if (subtotal >= 5000 && destination === "LK") {
    return {
      rates: [
        {
          id: "koombiyo",
          name: "Koombiyo Delivery",
          courierName: "Koombiyo",
          cost: 0,
          estimatedDays: 3,
          freeShippingMinAmount: 5000,
        },
        {
          id: "express",
          name: "Koombiyo Express",
          courierName: "Koombiyo Express",
          cost: 0,
          estimatedDays: 1,
          freeShippingMinAmount: 5000,
        },
      ],
      selected: {
        method: "FREE",
        cost: 0,
        estimatedDays: 3,
        name: "Free Delivery",
        courierName: "Koombiyo",
      },
      totalWeight,
      destination,
    };
  }

  const rates = [];

  // Koombiyo rates (always available domestically)
  if (destination === "LK") {
    rates.push({
      id: "koombiyo",
      name: "Koombiyo Delivery",
      courierName: "Koombiyo",
      cost: koombiyoCost,
      estimatedDays: 3,
      freeShippingMinAmount: 5000,
    });
  }

  // Query dynamic shipping rates from DB
  const shippingRates = await prisma.shippingRate.findMany({
    where: { isActive: true },
    orderBy: { domesticRate: "asc" },
  });

  for (const rate of shippingRates) {
    const cost = destination === "LK" ? Number(rate.domesticRate) : Number(rate.internationalRate);
    const weightMultiplier = totalWeight > 1 ? Math.ceil(totalWeight) : 1;

    rates.push({
      id: rate.id,
      name: rate.name,
      courierName: rate.courierName,
      cost: cost * weightMultiplier,
      estimatedDays: rate.estimatedDays,
      freeShippingMinAmount: rate.freeShippingMinAmount ? Number(rate.freeShippingMinAmount) : null,
    });
  }

  return {
    rates,
    selected: rates.length > 0 ? { ...rates[0], method: "KOOMBIYO" } : null,
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
