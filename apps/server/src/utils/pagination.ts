export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function paginate(params: PaginationParams = {}): PaginationResult {
  const page = Math.max(1, parseInt(String(params.page || DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(String(params.limit || DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function getMeta(total: number, page: number, limit: number): PaginationMeta {
  const actualPage = Math.max(1, page || DEFAULT_PAGE);
  const actualLimit = Math.min(MAX_LIMIT, Math.max(1, limit || DEFAULT_LIMIT));
  const totalPages = Math.ceil(total / actualLimit) || 1;

  return {
    page: actualPage,
    limit: actualLimit,
    total,
    totalPages,
    hasNextPage: actualPage < totalPages,
    hasPreviousPage: actualPage > 1,
  };
}

export function parsePaginationQuery(query: Record<string, unknown>): PaginationParams {
  return {
    page: query.page ? parseInt(String(query.page), 10) : undefined,
    limit: query.limit ? parseInt(String(query.limit), 10) : undefined,
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export function getPaginationParams(page?: number, limit?: number): { page: number; limit: number } {
  return {
    page: Math.max(1, page || DEFAULT_PAGE),
    limit: Math.min(MAX_LIMIT, Math.max(1, limit || DEFAULT_LIMIT)),
  };
}

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}
