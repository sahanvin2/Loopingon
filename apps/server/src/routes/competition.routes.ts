import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as competitionService from "../services/competition.service.js";
import { successResponse, paginatedResponse, createdResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await competitionService.getCompetitions(status, page, limit);
      paginatedResponse(res, result.data, {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.hasNext,
        hasPreviousPage: result.pagination.hasPrevious,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competition = await competitionService.getCompetitionBySlug(req.params.slug);
      successResponse(res, competition);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:competitionId/entries",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const result = await competitionService.getCompetitionEntries(req.params.competitionId, page, limit);
      paginatedResponse(res, result.data, {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.hasNext,
        hasPreviousPage: result.pagination.hasPrevious,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:competitionId/winners",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const winners = await competitionService.getWinners(req.params.competitionId);
      successResponse(res, winners);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:competitionId/enter",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entry = await competitionService.enterCompetition(
        req.user!.id,
        req.params.competitionId,
        req.body.productId,
        req.body.title,
        req.body.description,
        req.body.images || []
      );
      createdResponse(res, entry);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/entries/:entryId/vote",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await competitionService.voteEntry(req.params.entryId, req.user!.id);
      successResponse(res, { message: "Vote recorded" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
