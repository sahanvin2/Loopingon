import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { sendEmail } from "../config/email.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "notification";

type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP" | "PUSH";

interface NotificationJobData {
  userId: string;
  type:
    | "ORDER_CONFIRMATION"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "PAYMENT_RECEIVED"
    | "PAYOUT_PROCESSED"
    | "NEW_MESSAGE"
    | "NEW_REVIEW"
    | "VENDOR_VERIFIED"
    | "VENDOR_REJECTED"
    | "PRODUCT_APPROVED"
    | "PRODUCT_REJECTED"
    | "COMPETITION_ANNOUNCEMENT"
    | "PROMOTIONAL"
    | "SYSTEM_ALERT"
    | "REMINDER"
    | "REFERRAL_EARNED"
    | "LOYALTY_POINTS";
  channels: NotificationChannel[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  relatedId?: string;
}

const NOTIFICATION_TEMPLATES: Record<
  NotificationJobData["type"],
  { title: string; bodyTemplate: string; icon: string }
> = {
  ORDER_CONFIRMATION: {
    title: "Order Confirmed",
    bodyTemplate: "Your order #{{orderNumber}} has been confirmed and is being processed.",
    icon: "📦",
  },
  ORDER_SHIPPED: {
    title: "Order Shipped",
    bodyTemplate: "Your order #{{orderNumber}} is on its way! Track it with {{courierName}}.",
    icon: "🚚",
  },
  ORDER_DELIVERED: {
    title: "Order Delivered",
    bodyTemplate: "Your order #{{orderNumber}} has been delivered. Enjoy your handcrafted items!",
    icon: "✅",
  },
  PAYMENT_RECEIVED: {
    title: "Payment Received",
    bodyTemplate: "Payment of LKR {{amount}} for order #{{orderNumber}} has been received.",
    icon: "💰",
  },
  PAYOUT_PROCESSED: {
    title: "Payout Processed",
    bodyTemplate: "Your payout of LKR {{amount}} has been processed and will be credited to your bank account.",
    icon: "🏦",
  },
  NEW_MESSAGE: {
    title: "New Message",
    bodyTemplate: "You have a new message from {{senderName}} regarding {{subject}}.",
    icon: "💬",
  },
  NEW_REVIEW: {
    title: "New Review",
    bodyTemplate: "{{customerName}} left a {{rating}}-star review on your product \"{{productName}}\".",
    icon: "⭐",
  },
  VENDOR_VERIFIED: {
    title: "Store Verified",
    bodyTemplate: "Congratulations! Your store \"{{storeName}}\" has been verified on Loopingon.",
    icon: "🎉",
  },
  VENDOR_REJECTED: {
    title: "Store Verification Update",
    bodyTemplate: "Your store \"{{storeName}}\" verification was not approved. Reason: {{reason}}.",
    icon: "📋",
  },
  PRODUCT_APPROVED: {
    title: "Product Approved",
    bodyTemplate: "Your product \"{{productName}}\" has been approved and is now live on the marketplace.",
    icon: "🛍️",
  },
  PRODUCT_REJECTED: {
    title: "Product Rejected",
    bodyTemplate: "Your product \"{{productName}}\" was not approved. Reason: {{reason}}.",
    icon: "📋",
  },
  COMPETITION_ANNOUNCEMENT: {
    title: "New Competition",
    bodyTemplate: "A new craft competition \"{{competitionTitle}}\" has been announced. Submit your entry now!",
    icon: "🏆",
  },
  PROMOTIONAL: {
    title: "Special Offer",
    bodyTemplate: "{{message}}",
    icon: "🎁",
  },
  SYSTEM_ALERT: {
    title: "System Alert",
    bodyTemplate: "{{message}}",
    icon: "⚠️",
  },
  REMINDER: {
    title: "Reminder",
    bodyTemplate: "{{message}}",
    icon: "🔔",
  },
  REFERRAL_EARNED: {
    title: "Referral Reward Earned",
    bodyTemplate: "You earned LKR {{amount}} from a referral! Keep sharing your code.",
    icon: "💸",
  },
  LOYALTY_POINTS: {
    title: "Loyalty Points Earned",
    bodyTemplate: "You earned {{points}} loyalty points! Check your balance and redeem rewards.",
    icon: "🌟",
  },
};

function resolveBodyTemplate(template: string, data?: Record<string, unknown>): string {
  if (!data) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? `{{${key}}}`));
}

function buildEmailHtml(type: NotificationJobData["type"], title: string, body: string): string {
  const template = NOTIFICATION_TEMPLATES[type];
  const icon = template?.icon || "🔔";
  const platformName = process.env.PLATFORM_NAME || "Loopingon";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:32px 32px 16px 32px;text-align:center;">
              <span style="font-size:48px;">${icon}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 12px 0;text-align:center;">${title}</h2>
              <p style="color:#495057;font-size:16px;line-height:1.7;margin:0;text-align:center;">${body}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:16px 32px;border-top:1px solid #e9ecef;text-align:center;">
              <p style="color:#6c757d;font-size:12px;margin:0;">${platformName} - Where Sri Lankan Craft Meets the World</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

let notificationQueue: Queue<NotificationJobData> | null = null;

export function getNotificationQueue(): Queue<NotificationJobData> {
  if (!notificationQueue) {
    notificationQueue = new Queue<NotificationJobData>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: { age: 86400 },
        removeOnFail: { age: 604800 },
      },
    });
  }
  return notificationQueue;
}

const notificationWorker = new Worker<NotificationJobData>(
  QUEUE_NAME,
  async (job: Job<NotificationJobData>) => {
    const { userId, type, channels, title, body, data } = job.data;
    logger.info(`Processing notification job ${job.id} type=${type} userId=${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { id: true, email: true, phone: true, fullName: true },
    });

    if (!user) {
      logger.warn(`User ${userId} not found for notification job ${job.id}`);
      return;
    }

    const resolvedBody = resolveBodyTemplate(body, data);

    for (const channel of channels) {
      try {
        switch (channel) {
          case "IN_APP":
            await prisma.notification.create({
              data: {
                userId,
                type: type as any,
                channel: "IN_APP",
                title,
                body: resolvedBody,
                data: data as any,
              },
            });
            logger.info(`In-app notification created for user ${userId}`);
            break;

          case "EMAIL":
            if (user.email) {
              const emailHtml = buildEmailHtml(type, title, resolvedBody);
              await sendEmail({
                to: user.email,
                subject: `${title} - ${process.env.PLATFORM_NAME || "Loopingon"}`,
                html: emailHtml,
              });
            }
            break;

          case "SMS":
            if (user.phone) {
              const response = await sendSMS(user.phone, `${title}: ${resolvedBody}`);
              if (!response.sent) {
                logger.warn(`Failed to send SMS to user ${userId}`);
              }
            }
            break;

          case "WHATSAPP":
            if (user.phone) {
              await sendWhatsApp(user.phone, `${title}: ${resolvedBody}`);
            }
            break;

          case "PUSH":
            logger.info(`Push notification would be sent to user ${userId}`);
            break;

          default:
            logger.warn(`Unknown notification channel: ${channel}`);
        }
      } catch (error: any) {
        logger.error(`Failed to send ${channel} notification for job ${job.id}: ${error.message}`);
        throw error;
      }
    }

    logger.info(`Completed notification job ${job.id}`);
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 10,
    limiter: { max: 100, duration: 1000 },
  }
);

notificationWorker.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

notificationWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

async function sendSMS(phone: string, message: string): Promise<{ sent: boolean }> {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      // @ts-ignore - twilio is optional
      const twilio = await import("twilio") as any;
      const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      return { sent: true };
    } catch (error: any) {
      logger.error(`Twilio SMS failed: ${error.message}`);
      throw error;
    }
  }
  logger.info(`SMS (simulated) to ${phone}: ${message}`);
  return { sent: true };
}

async function sendWhatsApp(phone: string, message: string): Promise<void> {
  if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: { body: message },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }
    } catch (error: any) {
      logger.error(`WhatsApp notification failed: ${error.message}`);
      throw error;
    }
  } else {
    logger.info(`WhatsApp (simulated) to ${phone}: ${message}`);
  }
}

export async function addNotificationJob(
  userId: string,
  type: NotificationJobData["type"],
  channels: NotificationChannel[] = ["IN_APP"],
  customData?: Record<string, unknown>,
  relatedId?: string
) {
  const template = NOTIFICATION_TEMPLATES[type];
  const title = customData?.title as string || template.title;
  const body = customData?.body as string || template.bodyTemplate;

  return getNotificationQueue().add(type, {
    userId,
    type,
    channels,
    title,
    body,
    data: customData,
    relatedId,
  });
}

export { notificationWorker };
