import { type Request, type Response, type NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";
import { AppError } from "./errorHandler.middleware.js";

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));
}

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        throw new AppError("Validation failed", 400, "VALIDATION_ERROR", errors);
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        throw new AppError("Invalid query parameters", 400, "QUERY_VALIDATION_ERROR", errors);
      }
      throw error;
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.params);
      (req as any)._validatedParams = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        throw new AppError("Invalid URL parameters", 400, "PARAM_VALIDATION_ERROR", errors);
      }
      throw error;
    }
  };
}
