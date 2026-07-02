import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const trackAnalytics = async (req: Request, res: Response) => {
  try {
    const {
      cookieId,
      path,
      title,
      referrer,
      durationSeconds,
      maxScrollDepth,
      interactions = [],
      searchQueries = []
    } = req.body;

    if (!cookieId || !path) {
      return errorResponse(res, 'Missing required tracking data', 400);
    }

    // Upsert session
    let session = await prisma.trackingSession.findFirst({
      where: { cookieId }
    });

    if (!session) {
      session = await prisma.trackingSession.create({
        data: {
          cookieId,
          deviceType: req.headers['user-agent'],
          ipAddress: req.ip,
        }
      });
    }

    // Record page visit
    await prisma.pageVisit.create({
      data: {
        sessionId: session.id,
        path,
        title,
        referrer,
        durationSeconds,
        maxScrollDepth
      }
    });

    // Record interactions
    if (interactions.length > 0) {
      await prisma.productInteraction.createMany({
        data: interactions.map((i: any) => ({
          sessionId: session!.id,
          productId: i.productId,
          type: i.type,
          metadata: i.metadata || {}
        }))
      });
    }

    // Record searches
    if (searchQueries.length > 0) {
      await prisma.searchQuery.createMany({
        data: searchQueries.map((s: any) => ({
          sessionId: session!.id,
          query: s.query,
          resultsCount: s.resultsCount || 0
        }))
      });
    }

    return successResponse(res, { tracked: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    return errorResponse(res, 'Failed to track data', 500);
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || '30d';
    // Simplified stats for now
    const pageVisits = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(id)::int as views
      FROM "page_visits"
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
      LIMIT 30
    `;

    const interactions = await prisma.productInteraction.groupBy({
      by: ['type'],
      _count: { id: true }
    });

    const topPages = await prisma.pageVisit.groupBy({
      by: ['path'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    const searchQueries = await prisma.searchQuery.groupBy({
      by: ['query'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    return successResponse(res, {
      pageVisits,
      interactions,
      topPages,
      searchQueries
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};
