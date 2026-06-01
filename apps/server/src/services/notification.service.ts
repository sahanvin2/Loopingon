import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";
import { sendEmail } from "../utils/email.js";

export async function getNotifications(
  userId: string,
  page?: number,
  limit?: number,
  type?: string
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.notification.count({ where: where as any }),
  ]);

  return buildPaginationResult(notifications, total, p, l);
}

export async function markAllRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) throw new AppError("Notification not found", 404, "NOTIFICATION_NOT_FOUND");

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function updateSettings(
  userId: string,
  preferences: {
    email?: { orderConfirmation?: boolean; marketing?: boolean; newsletter?: boolean };
    push?: { enabled?: boolean; orderUpdates?: boolean; messages?: boolean };
    sms?: { enabled?: boolean };
    whatsapp?: { enabled?: boolean };
  }
) {
  // Store notification preferences in SystemSetting or a dedicated table
  // For now, store as JSON in user metadata (requires extending schema)
  return preferences;
}

export async function createNotification(
  userId: string,
  type: string,
  channel: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: {
      userId,
      type: type as any,
      channel: channel as any,
      title,
      body,
      data: data as any,
    },
  });
}

export async function sendEmailNotification(to: string, subject: string, html: string) {
  await sendEmail(to, subject, html);
}

export async function sendSMSNotification(phone: string, message: string) {
  // In production, use Twilio:
  // await twilioClient.messages.create({ body: message, to: phone, from: process.env.TWILIO_PHONE });
  return { sent: true, phone, messageLength: message.length };
}

export async function sendWhatsAppNotification(phone: string, message: string) {
  // In production, use WhatsApp Business API
  return { sent: true, phone, messageLength: message.length };
}
