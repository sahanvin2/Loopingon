import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/events",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { events, sessionId } = req.body;

      if (!events || !Array.isArray(events)) {
        return successResponse(res, { received: 0 });
      }

      // Store analytics events for processing
      console.info(
        `[analytics] Received ${events.length} events from session ${sessionId}: ` +
          events.map((e: any) => e.type).join(", "),
      );

      successResponse(res, { received: events.length });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
