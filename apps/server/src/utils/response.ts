import { type Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export function successResponse<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: unknown
): void {
  const error: Record<string, unknown> = {
    code: code || "ERROR",
    message,
  };

  if (details && process.env.NODE_ENV !== "production") {
    error.details = details;
  }

  res.status(statusCode).json({
    success: false,
    error,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  }
): void {
  res.status(200).json({
    success: true,
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages,
      hasNextPage: meta.hasNextPage ?? meta.page < meta.totalPages,
      hasPreviousPage: meta.hasPreviousPage ?? meta.page > 1,
    },
  });
}

export function createdResponse<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>
): void {
  successResponse(res, data, meta, 201);
}

export function noContentResponse(res: Response): void {
  res.status(204).send();
}
