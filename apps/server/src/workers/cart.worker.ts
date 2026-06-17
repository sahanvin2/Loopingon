import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { logger } from "../middleware/errorHandler.middleware.js";
import { addAbandonedCartReminderJob } from "./email.worker.js";

const QUEUE_NAME = "cart-cron";

interface ProcessAbandonedCartsJob {
  type: "processAbandonedCarts";
}

let cartCronQueue: Queue<ProcessAbandonedCartsJob> | null = null;

export function getCartCronQueue(): Queue<ProcessAbandonedCartsJob> {
  if (!cartCronQueue) {
    cartCronQueue = new Queue<ProcessAbandonedCartsJob>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
    });
  }
  return cartCronQueue;
}

export async function setupCartCron() {
  const queue = getCartCronQueue();
  // Run every hour
  await queue.add(
    "processAbandonedCarts",
    { type: "processAbandonedCarts" },
    { repeat: { pattern: "0 * * * *" } }
  );
  logger.info("Cart cron job setup completed");
}

const cartWorker = new Worker<ProcessAbandonedCartsJob>(
  QUEUE_NAME,
  async (job: Job<ProcessAbandonedCartsJob>) => {
    logger.info("Running abandoned cart processor...");

    // Find carts that haven't been updated recently
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const carts = await prisma.cart.findMany({
      where: {
        updatedAt: { lte: oneHourAgo },
        items: { some: {} }, // Must have items
      },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
            },
          },
        },
      },
    });

    for (const cart of carts) {
      // Check if user has made an order AFTER the cart was updated
      const recentOrder = await prisma.order.findFirst({
        where: {
          customerId: cart.userId,
          createdAt: { gt: cart.updatedAt },
        },
      });

      if (recentOrder) {
        // They bought something since cart update. Maybe we just clear their cart or skip.
        // Let's clear the cart since it's stale and they already ordered.
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        continue;
      }

      let stageToSet = cart.abandonedEmailStage;
      let hoursAbandoned = 0;

      if (cart.updatedAt <= sevenDaysAgo && cart.abandonedEmailStage < 5) {
        stageToSet = 5;
        hoursAbandoned = 168;
      } else if (cart.updatedAt <= threeDaysAgo && cart.abandonedEmailStage < 4) {
        stageToSet = 4;
        hoursAbandoned = 72;
      } else if (cart.updatedAt <= oneDayAgo && cart.abandonedEmailStage < 3) {
        stageToSet = 3;
        hoursAbandoned = 24;
      } else if (cart.updatedAt <= twelveHoursAgo && cart.abandonedEmailStage < 2) {
        stageToSet = 2;
        hoursAbandoned = 12;
      } else if (cart.updatedAt <= oneHourAgo && cart.abandonedEmailStage < 1) {
        stageToSet = 1;
        hoursAbandoned = 1;
      }

      if (stageToSet > cart.abandonedEmailStage) {
        // Send email
        const cartTotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const firstItem = cart.items[0];

        try {
          await addAbandonedCartReminderJob(
            cart.user.email,
            cartItemCount,
            cartTotal,
            firstItem.product.title,
            hoursAbandoned,
            cart.user.fullName,
            firstItem.product.images[0]?.url
          );

          await prisma.cart.update({
            where: { id: cart.id },
            data: { abandonedEmailStage: stageToSet },
          });
          logger.info(`Queued abandoned cart email (stage ${stageToSet}) for user ${cart.userId}`);
        } catch (err) {
          logger.error(`Failed to send abandoned cart email for cart ${cart.id}`, err);
        }
      }
    }

    logger.info("Abandoned cart processor finished");
  },
  {
    connection: { url: REDIS_URL },
  }
);

cartWorker.on("failed", (job, err) => {
  logger.error(`Cart cron job failed: ${err.message}`, { jobId: job?.id, error: err });
});

export { cartWorker };
