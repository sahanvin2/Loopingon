import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "./errorHandler.middleware.js";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "VENDOR"
  | "CUSTOMER"
  | "SUPPORT"
  | "CONTENT_MANAGER";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  SUPPORT: 60,
  CONTENT_MANAGER: 50,
  VENDOR: 40,
  CUSTOMER: 10,
};

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
    }

    const userRole = req.user.role as UserRole;
    const userRoleLevel = ROLE_HIERARCHY[userRole] || 0;

    const hasExactRole = roles.includes(userRole);
    const hasHigherRole = roles.some((role) => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userRoleLevel >= requiredLevel;
    });

    if (!hasExactRole && !hasHigherRole) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403,
        "FORBIDDEN"
      );
    }

    next();
  };
}

export function requireVendor(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }

  const allowedRoles = ["VENDOR", "ADMIN", "SUPER_ADMIN"];
  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError("Vendor account required.", 403, "VENDOR_REQUIRED");
  }

  if (!req.user.vendor) {
    throw new AppError(
      "You need to create a vendor store first.",
      403,
      "VENDOR_STORE_REQUIRED"
    );
  }

  if (req.user.vendor.status === "SUSPENDED" || req.user.vendor.status === "BANNED") {
    throw new AppError("Your vendor store is currently inactive.", 403, "VENDOR_INACTIVE");
  }

  // Admins bypass verification check
  if (req.user.role === "VENDOR" && !req.user.vendor.isVerified) {
    // Wait, vendor schema might not have 'isVerified' but checks 'status === VERIFIED'
    // Let's use status check
    if (req.user.vendor.status !== "VERIFIED") {
      throw new AppError(
        "Your vendor store is pending verification.",
        403,
        "VENDOR_NOT_VERIFIED"
      );
    }
  }

  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }

  const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
  if (!adminRoles.includes(req.user.role as UserRole)) {
    throw new AppError("Admin access required.", 403, "ADMIN_REQUIRED");
  }

  next();
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }

  if (req.user.role !== "SUPER_ADMIN") {
    throw new AppError("Super admin access required.", 403, "SUPER_ADMIN_REQUIRED");
  }

  next();
}

export function requireOwnership(
  resourceParam: string,
  ownerField: string = "userId"
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
    }

    const resourceId = req.params[resourceParam];
    if (!resourceId) {
      throw new AppError("Resource identifier is required.", 400, "MISSING_RESOURCE");
    }

    (req as any).__ownerField = ownerField;
    (req as any).__resourceParam = resourceParam;
    next();
  };
}

export async function requireVendorProductOwnership(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }

  if (!req.user.vendor) {
    throw new AppError("Vendor account required.", 403, "VENDOR_REQUIRED");
  }

  const { prisma } = await import("../config/database.js");
  const productId = req.params.productId || req.params.id;

  if (!productId) {
    throw new AppError("Product ID is required.", 400, "MISSING_PRODUCT_ID");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { vendorId: true },
  });

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  if (product.vendorId !== req.user.vendor.id) {
    const isAdmin = req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN";
    if (!isAdmin) {
      throw new AppError("You do not own this product.", 403, "NOT_PRODUCT_OWNER");
    }
  }

  next();
}
