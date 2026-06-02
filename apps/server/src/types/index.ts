import { type Request, type Response, type NextFunction } from "express";
import { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        fullName: string;
        isActive: boolean;
        isVerified: boolean;
        avatar?: string | null;
        vendor?: {
          id: string;
          storeName: string;
          storeSlug: string;
          status: string;
          isVerified: boolean;
        } | null;
      };
      currentToken?: {
        sub: string;
        email?: string;
        role: string;
        type?: string;
        sessionId?: string;
      };
    }
  }
}

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "VENDOR"
  | "CUSTOMER"
  | "SUPPORT"
  | "CONTENT_MANAGER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED" | "PENDING";

export type VendorStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE" | "REJECTED";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "ON_HOLD"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELLED"
  | "PROCESSING";

export type PaymentMethod =
  | "PAYHERE"
  | "PAYABLE"
  | "COD"
  | "WALLET"
  | "BANK_TRANSFER"
  | "STORE_CREDIT";

export type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED" | "CANCELLED";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";

export type ReturnReason =
  | "DEFECTIVE"
  | "WRONG_ITEM"
  | "NOT_AS_DESCRIBED"
  | "DAMAGED"
  | "SIZE_ISSUE"
  | "COLOR_ISSUE"
  | "CHANGED_MIND"
  | "OTHER";

export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "INSPECTED"
  | "COMPLETED"
  | "CANCELLED";

export type RefundMethod = "ORIGINAL" | "WALLET" | "STORE_CREDIT";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  isActive: boolean;
  isVerified: boolean;
  avatar?: string | null;
  vendor?: {
    id: string;
    storeName: string;
    storeSlug: string;
    isActive: boolean;
    isVerified: boolean;
  } | null;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type AsyncRequestHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, string>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export {};
