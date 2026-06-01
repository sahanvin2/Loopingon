import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .transform((v) => v.trim())
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional()
    .nullable(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  language: z.string().length(2).max(5).optional(),
  currency: z.string().length(3).optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
      marketing: z.boolean().optional(),
      orderUpdates: z.boolean().optional(),
      promotions: z.boolean().optional(),
      newsletter: z.boolean().optional(),
    })
    .optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100).transform((v) => v.trim()),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(200).transform((v) => v.trim()),
  addressLine2: z.string().max(200).transform((v) => v.trim()).optional().nullable(),
  city: z.string().min(2, "City is required").max(100).transform((v) => v.trim()),
  state: z.string().min(2, "State/Province is required").max(100).transform((v) => v.trim()),
  postalCode: z.string().min(3, "Postal code is required").max(20).transform((v) => v.trim()),
  country: z.string().min(2, "Country is required").max(100),
  isDefault: z.boolean().optional(),
  label: z.enum(["HOME", "WORK", "OTHER"]).optional(),
  landmark: z.string().max(200).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export const updateAddressSchema = addressSchema.partial();

export const wishlistItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  variantId: z.string().uuid("Invalid variant ID").optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be at least 0").max(999),
});

export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"]).optional(),
  isVerified: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(["fullName", "email", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const notificationPreferencesSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  newsletter: z.boolean(),
  priceDrops: z.boolean(),
  backInStock: z.boolean(),
  chatMessages: z.boolean(),
  vendorUpdates: z.boolean(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
