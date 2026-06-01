import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function getCompetitions(status?: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Record<string, unknown> = {};

  if (status) where.status = status;

  const [competitions, total] = await Promise.all([
    prisma.competition.findMany({
      where: where as any,
      include: { entries: { select: { id: true } } },
      orderBy: { startDate: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.competition.count({ where: where as any }),
  ]);

  return buildPaginationResult(
    competitions.map((c) => ({ ...c, entryCount: c.entries.length, entries: undefined })),
    total,
    p,
    l
  );
}

export async function getCompetitionBySlug(slug: string) {
  const competition = await prisma.competition.findUnique({
    where: { slug },
    include: { entries: { select: { id: true } } },
  });

  if (!competition) throw new AppError("Competition not found", 404, "COMPETITION_NOT_FOUND");

  return { ...competition, entryCount: competition.entries.length, entries: undefined };
}

export async function getCompetitionEntries(competitionId: string, page?: number, limit?: number) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where = { competitionId };

  const [entries, total] = await Promise.all([
    prisma.competitionEntry.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, avatar: true } },
        product: { select: { id: true, title: true, slug: true, images: { take: 1, orderBy: { sortOrder: "asc" } } } },
        votes: { select: { id: true, userId: true } },
      },
      orderBy: { voteCount: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.competitionEntry.count({ where }),
  ]);

  return buildPaginationResult(entries, total, p, l);
}

export async function enterCompetition(
  userId: string,
  competitionId: string,
  productId: string,
  title: string,
  description: string,
  images: string[]
) {
  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition) throw new AppError("Competition not found", 404, "COMPETITION_NOT_FOUND");
  if (competition.status !== "ACTIVE") throw new AppError("Competition is not active", 400, "COMPETITION_NOT_ACTIVE");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

  const existingEntry = await prisma.competitionEntry.findUnique({
    where: { competitionId_productId: { competitionId, productId } },
  });
  if (existingEntry) throw new AppError("Product already entered in this competition", 409, "ALREADY_ENTERED");

  const entryCount = await prisma.competitionEntry.count({ where: { competitionId } });
  if (entryCount >= competition.maxEntries) {
    throw new AppError("Competition has reached maximum entries", 400, "MAX_ENTRIES_REACHED");
  }

  return prisma.competitionEntry.create({
    data: {
      competitionId,
      userId,
      productId,
      title,
      description,
      images,
      status: "submitted",
    },
  });
}

export async function voteEntry(entryId: string, userId: string) {
  const entry = await prisma.competitionEntry.findUnique({ where: { id: entryId } });
  if (!entry) throw new AppError("Entry not found", 404, "ENTRY_NOT_FOUND");

  const competition = await prisma.competition.findUnique({ where: { id: entry.competitionId } });
  if (!competition || competition.status !== "ACTIVE") {
    throw new AppError("Competition is not active", 400, "COMPETITION_NOT_ACTIVE");
  }

  const existingVote = await prisma.competitionVote.findUnique({
    where: { entryId_userId: { entryId, userId } },
  });
  if (existingVote) throw new AppError("Already voted for this entry", 409, "ALREADY_VOTED");

  await prisma.competitionVote.create({
    data: { entryId, userId },
  });

  await prisma.competitionEntry.update({
    where: { id: entryId },
    data: { voteCount: { increment: 1 } },
  });
}

export async function getWinners(competitionId: string) {
  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition) throw new AppError("Competition not found", 404, "COMPETITION_NOT_FOUND");

  if (competition.status !== "COMPLETED") {
    throw new AppError("Winners not yet announced", 400, "COMPETITION_NOT_COMPLETED");
  }

  return prisma.competitionEntry.findMany({
    where: { competitionId },
    include: {
      user: { select: { id: true, fullName: true, avatar: true } },
      product: { select: { id: true, title: true, slug: true, images: { take: 1, orderBy: { sortOrder: "asc" } } } },
    },
    orderBy: { voteCount: "desc" },
    take: 3,
  });
}
