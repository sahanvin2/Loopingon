import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function getThreads(userId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);

  const [threads, total] = await Promise.all([
    prisma.messageThread.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          select: { id: true, fullName: true, avatar: true, role: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { id: true, content: true, createdAt: true, isRead: true, senderId: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.messageThread.count({
      where: { participants: { some: { id: userId } } },
    }),
  ]);

  const threadsWithUnread = await Promise.all(
    threads.map(async (thread) => {
      const unreadCount = await prisma.message.count({
        where: { threadId: thread.id, senderId: { not: userId }, isRead: false },
      });
      return { ...thread, unreadCount };
    })
  );

  return buildPaginationResult(threadsWithUnread, total, p, l);
}

export async function createThread(
  userId: string,
  participantId: string,
  subject?: string,
  orderId?: string
) {
  const [user, participant] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.user.findUnique({ where: { id: participantId } }),
  ]);

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!participant) throw new AppError("Participant not found", 404, "USER_NOT_FOUND");

  const existingThreads = await prisma.messageThread.findMany({
    where: {
      AND: [
        { participants: { some: { id: userId } } },
        { participants: { some: { id: participantId } } },
      ],
    },
    include: { participants: { select: { id: true, fullName: true, avatar: true } } },
  });

  const directThread = existingThreads.find(
    (t) => t.participants.length === 2 && !t.orderId
  );

  if (directThread) {
    return directThread;
  }

  return prisma.messageThread.create({
    data: {
      subject,
      orderId,
      participants: {
        connect: [{ id: userId }, { id: participantId }],
      },
    },
    include: {
      participants: { select: { id: true, fullName: true, avatar: true } },
    },
  });
}

export async function getThread(threadId: string, userId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);

  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      participants: { some: { id: userId } },
    },
    include: {
      participants: { select: { id: true, fullName: true, avatar: true, role: true } },
    },
  });

  if (!thread) throw new AppError("Thread not found", 404, "THREAD_NOT_FOUND");

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { threadId },
      include: { sender: { select: { id: true, fullName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.message.count({ where: { threadId } }),
  ]);

  return {
    thread,
    ...buildPaginationResult(messages.reverse(), total, p, l),
  };
}

export async function sendMessage(
  threadId: string,
  senderId: string,
  content: string,
  attachments?: string[]
) {
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      participants: { some: { id: senderId } },
    },
  });

  if (!thread) throw new AppError("Thread not found", 404, "THREAD_NOT_FOUND");

  const message = await prisma.message.create({
    data: {
      threadId,
      senderId,
      content,
      attachments: attachments || [],
    },
    include: {
      sender: { select: { id: true, fullName: true, avatar: true } },
    },
  });

  await prisma.messageThread.update({
    where: { id: threadId },
    data: {
      lastMessageAt: new Date(),
      lastMessage: content.substring(0, 200),
    },
  });

  return message;
}

export async function markThreadRead(threadId: string, userId: string) {
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      participants: { some: { id: userId } },
    },
  });

  if (!thread) throw new AppError("Thread not found", 404, "THREAD_NOT_FOUND");

  await prisma.message.updateMany({
    where: {
      threadId,
      senderId: { not: userId },
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
