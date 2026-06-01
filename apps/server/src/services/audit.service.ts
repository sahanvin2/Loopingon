import { prisma } from "../config/database.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function logAction(data: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId || null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      oldValue: (data.oldValue as any) || null,
      newValue: (data.newValue as any) || null,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      metadata: (data.metadata as any) || null,
    },
  });
}

export async function getAuditLogs(
  page?: number,
  limit?: number,
  filters?: { userId?: string; action?: string; entity?: string; entityId?: string; fromDate?: Date; toDate?: Date }
) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Record<string, unknown> = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.action) where.action = filters.action;
  if (filters?.entity) where.entity = filters.entity;
  if (filters?.entityId) where.entityId = filters.entityId;
  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) (where.createdAt as any).gte = filters.fromDate;
    if (filters.toDate) (where.createdAt as any).lte = filters.toDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: where as any,
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.auditLog.count({ where: where as any }),
  ]);

  return buildPaginationResult(logs, total, p, l);
}
