import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import * as shippingService from "../services/shipping.service.js";
import { successResponse } from "../utils/response.js";

const router = Router();

router.get(
  "/rates",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const weight = req.query.weight ? parseFloat(req.query.weight as string) : undefined;
      const dimensions = req.query.dimensions
        ? JSON.parse(req.query.dimensions as string)
        : undefined;
      const destination = req.query.destination as string | undefined;
      const rates = await shippingService.getShippingRates(weight, dimensions, destination);
      successResponse(res, rates);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/calculate",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shippingService.calculateShipping(
        req.body.address || {},
        req.body.items || []
      );
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/track/:trackingNumber",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await shippingService.trackShipment(req.params.trackingNumber);
      successResponse(res, shipment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
