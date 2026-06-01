import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { uploadSingle, uploadMultiple } from "../middleware/upload.middleware.js";
import * as mediaService from "../services/media.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/upload",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "VENDOR"),
  uploadSingle("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folder = req.body.folder || "general";
      const result = await mediaService.uploadSingle(req.file!, folder);
      createdResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/multiple",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "VENDOR"),
  uploadMultiple("files", 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folder = req.body.folder || "general";
      const results = await mediaService.uploadMultiple(req.files as Express.Multer.File[], folder);
      createdResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:key",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "VENDOR"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await mediaService.deleteMedia(req.params.key);
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/optimize",
  authenticate,
  requireRole("SUPER_ADMIN", "ADMIN", "VENDOR"),
  uploadSingle("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const optimized = await mediaService.optimizeImage(req.file!);
      res.set("Content-Type", "image/webp");
      res.send(optimized);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
