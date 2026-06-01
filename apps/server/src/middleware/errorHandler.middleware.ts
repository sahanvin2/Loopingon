import { type Request, type Response, type NextFunction } from "express";
import winston from "winston";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "loopingon-server" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
        })
      ),
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

function handlePrismaError(error: any): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const target = (error.meta?.target as string[]) || [];
        return new AppError(
          `A record with this ${target.join(", ")} already exists.`,
          409,
          "UNIQUE_CONSTRAINT",
          { fields: target }
        );
      case "P2025":
        return new AppError("The requested record was not found.", 404, "NOT_FOUND");
      case "P2003":
        return new AppError("Referenced record does not exist.", 400, "FOREIGN_KEY_ERROR");
      case "P2014":
        return new AppError(
          "Cannot delete this record because it is referenced by other records.",
          409,
          "RELATION_VIOLATION"
        );
      case "P2000":
        return new AppError("Input value is too long for this field.", 400, "VALUE_TOO_LONG");
      case "P2001":
        return new AppError("Record not found.", 404, "NOT_FOUND");
      default:
        return new AppError(
          `Database error: ${error.message}`,
          500,
          "DATABASE_ERROR"
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError("Invalid data provided.", 400, "INVALID_DATA");
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError("Database connection error.", 503, "DATABASE_UNAVAILABLE");
  }

  return new AppError("Internal server error.", 500, "INTERNAL_ERROR");
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal server error.";
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Validation failed.";
    details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    code = "INVALID_JSON";
    message = "Invalid JSON in request body.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid or expired token.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    code = "TOKEN_EXPIRED";
    message = "Token has expired.";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    code = "FILE_UPLOAD_ERROR";
    message = err.message;
  } else {
    const prismaError = handlePrismaError(err);
    if (prismaError.statusCode !== 500) {
      statusCode = prismaError.statusCode;
      code = prismaError.code;
      message = prismaError.message;
      details = prismaError.details;
    }
  }

  const logMeta: Record<string, unknown> = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode,
  };

  if (req.user) {
    logMeta.userId = req.user.id;
  }

  if (statusCode >= 500) {
    logger.error(message, { ...logMeta, stack: err.stack, error: err });
  } else if (statusCode >= 400) {
    logger.warn(message, logMeta);
  }

  const response: ErrorResponse = {
    error: {
      code,
      message,
    },
  };

  if (details && process.env.NODE_ENV !== "production") {
    response.error.details = details;
  }

  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    response.error.message = "Internal server error.";
    response.error.code = "INTERNAL_ERROR";
  }

  res.status(statusCode).json(response);
}
