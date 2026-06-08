import crypto from "crypto";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export async function initiatePayment(
  orderId: string,
  userId: string,
  gateway: string,
  method: string
) {
  const order = await prisma.order.findFirst({ where: { id: orderId, customerId: userId } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  if (order.status !== "PENDING_PAYMENT") throw new AppError("Order is not pending payment", 400, "ORDER_NOT_PENDING");

  const gatewayResponse = {
    amount: Number(order.totalAmount),
    currency: order.currency,
    orderNumber: order.orderNumber,
    returnUrl: `${process.env.FRONTEND_URL}/orders/${orderId}/confirmation`,
    cancelUrl: `${process.env.FRONTEND_URL}/orders/${orderId}/payment-failed`,
    notifyUrl: `${process.env.API_URL}/api/v1/payments/notify/${gateway}`,
  };

  const transaction = await prisma.paymentTransaction.create({
    data: {
      orderId,
      userId,
      vendorId: order.vendorId,
      amount: order.totalAmount,
      currency: order.currency,
      gatewayName: gateway,
      paymentMethod: method,
      status: "PENDING",
      commissionAmount: order.commissionAmount,
      vendorAmount: order.vendorPayoutAmount,
      platformFee: order.commissionAmount,
    },
  });

  return { transaction, gatewayResponse };
}

export async function handlePayHereNotify(data: Record<string, string>) {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    payment_id,
  } = data;

  const localMd5 = crypto
    .createHash("md5")
    .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${merchantSecret}`)
    .digest("hex")
    .toUpperCase();

  if (localMd5 !== md5sig) {
    throw new AppError("Invalid PayHere signature", 400, "INVALID_SIGNATURE");
  }

  const order = await prisma.order.findUnique({ where: { orderNumber: order_id } });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  if (status_code === "2") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAYMENT_CONFIRMED",
          paymentStatus: "COMPLETED",
          paymentId: payment_id,
          paidAt: new Date(),
          processingAt: new Date(),
        },
      }),
      prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: {
          status: "COMPLETED",
          gatewayTransactionId: payment_id,
          gatewayResponse: data as any,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "PAYMENT_CONFIRMED",
          note: "Payment confirmed via PayHere",
        },
      }),
    ]);

    // Process referral commission if this user was referred
    const referral = await prisma.referral.findUnique({
      where: { referredUserId: order.customerId },
    });
    if (referral) {
      const referralCommission = Math.round(Number(order.subtotal) * 0.05 * 100) / 100;
      await prisma.$transaction([
        prisma.referral.update({
          where: { referredUserId: order.customerId },
          data: {
            rewardAmount: referralCommission,
            status: "completed",
            completedAt: new Date(),
          },
        }),
        prisma.referralCode.update({
          where: { userId: referral.referrerId },
          data: { totalEarnings: { increment: referralCommission } },
        }),
      ]);
    }

    // Send payment confirmation notification to customer
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        type: "PAYMENT_RECEIVED",
        channel: "IN_APP",
        title: "Payment Confirmed ✅",
        body: `Your payment of ${Number(order.totalAmount).toLocaleString()} LKR for order #${order.orderNumber} has been confirmed. Your order is now being processed.`,
        data: { orderId: order.id, orderNumber: order.orderNumber },
      },
    });

    // Sync loyalty account with spending
    const profile = await prisma.customerProfile.findUnique({
      where: { userId: order.customerId },
    });
    if (profile) {
      await prisma.loyaltyAccount.upsert({
        where: { userId: order.customerId },
        create: { userId: order.customerId, totalSpent: profile.totalSpent },
        update: { totalSpent: profile.totalSpent },
      });
    }
  } else if (status_code === "0") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      }),
      prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: { status: "FAILED", gatewayResponse: data as any },
      }),
    ]);
  }

  return { success: true };
}

export async function handlePayableNotify(data: Record<string, unknown>) {
  const { payment_id, order_id, status } = data;

  const order = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: order_id as string }, { id: order_id as string }] },
  });
  if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

  if (status === "succeeded" || status === "completed") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAYMENT_CONFIRMED",
          paymentStatus: "COMPLETED",
          paymentId: payment_id as string,
          paidAt: new Date(),
          processingAt: new Date(),
        },
      }),
      prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: {
          status: "COMPLETED",
          gatewayTransactionId: payment_id as string,
          gatewayResponse: data as any,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "PAYMENT_CONFIRMED",
          note: "Payment confirmed via Payable",
        },
      }),
    ]);

    const referral = await prisma.referral.findUnique({
      where: { referredUserId: order.customerId },
    });
    if (referral) {
      const referralCommission = Math.round(Number(order.subtotal) * 0.05 * 100) / 100;
      await prisma.$transaction([
        prisma.referral.update({
          where: { referredUserId: order.customerId },
          data: {
            rewardAmount: referralCommission,
            status: "completed",
            completedAt: new Date(),
          },
        }),
        prisma.referralCode.update({
          where: { userId: referral.referrerId },
          data: { totalEarnings: { increment: referralCommission } },
        }),
      ]);
    }

    await prisma.notification.create({
      data: {
        userId: order.customerId,
        type: "PAYMENT_RECEIVED",
        channel: "IN_APP",
        title: "Payment Confirmed ✅",
        body: `Your payment of ${Number(order.totalAmount).toLocaleString()} LKR for order #${order.orderNumber} has been confirmed. Your order is now being processed.`,
        data: { orderId: order.id, orderNumber: order.orderNumber },
      },
    });
  } else if (status === "failed") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      }),
      prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: { status: "FAILED", gatewayResponse: data as any },
      }),
    ]);
  }

  return { success: true };
}

export async function getPaymentStatus(paymentId: string) {
  const payment = await prisma.paymentTransaction.findUnique({
    where: { id: paymentId },
    include: { order: { select: { id: true, orderNumber: true, status: true } } },
  });

  if (!payment) throw new AppError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  return payment;
}

export async function processPayout(
  vendorId: string,
  periodStart: Date,
  periodEnd: Date
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");

  const orders = await prisma.order.findMany({
    where: {
      vendorId,
      status: { in: ["DELIVERED", "COMPLETED"] },
      vendorPayoutStatus: null,
      deliveredAt: { gte: periodStart, lte: periodEnd },
    },
  });

  if (orders.length === 0) {
    return { message: "No orders to payout for this period" };
  }

  const bankDetail = await prisma.vendorBankDetail.findFirst({
    where: { vendorId, isPrimary: true, deletedAt: null },
  });
  if (!bankDetail) throw new AppError("No bank details found", 400, "NO_BANK_DETAILS");

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.vendorPayoutAmount), 0);
  const totalCommission = orders.reduce((sum, o) => sum + Number(o.commissionAmount), 0);

  const payout = await prisma.payoutSchedule.create({
    data: {
      vendorId,
      periodStart,
      periodEnd,
      totalOrders: orders.length,
      totalRevenue,
      totalCommission,
      payoutAmount: totalRevenue,
      status: "PENDING",
      bankDetailUsed: bankDetail.id,
    },
  });

  await Promise.all(
    orders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: { vendorPayoutStatus: "PENDING" },
      })
    )
  );

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      pendingPayoutAmount: { decrement: totalRevenue },
      totalPayoutAmount: { increment: totalRevenue },
    },
  });

  return payout;
}

export async function processAllPayouts() {
  const vendors = await prisma.vendor.findMany({
    where: { status: "VERIFIED", pendingPayoutAmount: { gt: 0 } },
  });

  const results = [];
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = now;

  for (const vendor of vendors) {
    try {
      const result = await processPayout(vendor.id, periodStart, periodEnd);
      results.push({ vendorId: vendor.id, storeName: vendor.storeName, ...result });
    } catch (error: any) {
      results.push({ vendorId: vendor.id, storeName: vendor.storeName, error: error.message });
    }
  }

  return results;
}

export async function handlePayoutCallback(data: Record<string, unknown>) {
  const { payout_id, status, transaction_id } = data;

  const payoutStatus = status === "completed" ? "COMPLETED" : status === "failed" ? "FAILED" : "PROCESSING";

  const payout = await prisma.payoutSchedule.findUnique({ where: { id: payout_id as string } });
  if (!payout) throw new AppError("Payout not found", 404, "PAYOUT_NOT_FOUND");

  await prisma.payoutSchedule.update({
    where: { id: payout_id as string },
    data: {
      status: payoutStatus as any,
      transactionId: transaction_id as string,
      processedAt: payoutStatus === "COMPLETED" ? new Date() : undefined,
      notes: payoutStatus === "FAILED" ? `Failed: ${JSON.stringify(data)}` : undefined,
    },
  });

  if (payoutStatus === "COMPLETED") {
    const orders = await prisma.order.findMany({
      where: {
        vendorId: payout.vendorId,
        vendorPayoutStatus: "PENDING",
      },
    });

    await Promise.all(
      orders.map((order) =>
        prisma.order.update({
          where: { id: order.id },
          data: { vendorPayoutStatus: "COMPLETED" },
        })
      )
    );
  }

  return { success: true };
}
