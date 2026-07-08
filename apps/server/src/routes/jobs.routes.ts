import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";
import * as jobsService from "../services/jobs.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

// Public route: Get all jobs
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeClosed = req.query.includeClosed === "true";
    const jobs = await jobsService.getJobs(includeClosed);
    successResponse(res, jobs);
  } catch (err) {
    next(err);
  }
});

// The following routes are protected (Admin only)
router.use(authenticate);
router.use(requireRole("SUPER_ADMIN", "ADMIN"));
router.use(auditMiddleware);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobsService.createJob(req.body);
    createdResponse(res, job);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobsService.updateJob(req.params.id, req.body);
    successResponse(res, job);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isOpen } = req.body;
    const job = await jobsService.toggleJobStatus(req.params.id, isOpen);
    successResponse(res, job);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await jobsService.deleteJob(req.params.id);
    noContentResponse(res);
  } catch (err) {
    next(err);
  }
});

export default router;
