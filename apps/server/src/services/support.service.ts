import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";
import { generateTicketNumber } from "../utils/slug.js";

export async function createTicket(
  userId: string,
  subject: string,
  category: string,
  description: string,
  orderId?: string
) {
  const ticketNumber = generateTicketNumber();

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      userId,
      subject,
      category,
      priority: "normal",
      status: "open",
      orderId,
    },
  });

  await prisma.supportTicketReply.create({
    data: {
      ticketId: ticket.id,
      userId,
      content: description,
      attachments: [],
    },
  });

  return ticket;
}

export async function getTickets(userId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = { userId };

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        replies: { take: 1, orderBy: { createdAt: "desc" }, select: { content: true, createdAt: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return buildPaginationResult(tickets, total, p, l);
}

export async function getTicketDetail(ticketId: string, userId: string) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: {
      replies: {
        include: { user: { select: { id: true, fullName: true, avatar: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");
  return ticket;
}

export async function addReply(
  ticketId: string,
  userId: string,
  content: string,
  attachments?: string[]
) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
  });

  if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");
  if (ticket.status === "closed") throw new AppError("Ticket is closed", 400, "TICKET_CLOSED");

  const reply = await prisma.supportTicketReply.create({
    data: {
      ticketId,
      userId,
      content,
      attachments: attachments || [],
    },
    include: { user: { select: { id: true, fullName: true, avatar: true } } },
  });

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { updatedAt: new Date(), status: ticket.status === "resolved" ? "open" : ticket.status },
  });

  return reply;
}
