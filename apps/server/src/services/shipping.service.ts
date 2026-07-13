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
  const destination = address.country || "LK";

  let allDigital = true;
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;
    if (!product.isDigital) {
      allDigital = false;
    }
  }

  if (allDigital) {
    return {
      rates: [
        {
          id: "digital",
          name: "Digital Delivery",
          courierName: "Instant",
          cost: 0,
          estimatedDays: 0,
          type: "digital" as const,
        },
      ],
      selected: {
        method: "DIGITAL" as const,
        cost: 0,
        estimatedDays: 0,
        name: "Digital Delivery",
        courierName: "Instant",
      },
      totalWeight: 0,
      destination,
    };
  }

  const rates = [];

  rates.push({
    id: "standard",
    name: "Standard Delivery",
    courierName: "Standard",
    cost: 400,
    estimatedDays: 3,
    freeShippingMinAmount: 5000,
  });

  const shippingRates = await prisma.shippingRate.findMany({
    where: { isActive: true },
    orderBy: { domesticRate: "asc" },
  });

  for (const rate of shippingRates) {
    const cost = destination === "LK" ? Number(rate.domesticRate) : Number(rate.internationalRate);
    rates.push({
      id: rate.id,
      name: rate.name,
      courierName: rate.courierName,
      cost,
      estimatedDays: rate.estimatedDays,
      freeShippingMinAmount: rate.freeShippingMinAmount ? Number(rate.freeShippingMinAmount) : null,
    });
  }

  return {
    rates,
    selected: rates.length > 0 ? { ...rates[0], method: "STANDARD" as const } : null,
    totalWeight: 0,
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
