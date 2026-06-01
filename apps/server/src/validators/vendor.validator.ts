import { z } from "zod";

export const vendorApplicationSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(100, "Store name must be at most 100 characters")
    .transform((v) => v.trim()),
  storeDescription: z
    .string()
    .min(20, "Store description must be at least 20 characters")
    .max(2000, "Store description must be at most 2000 characters")
    .transform((v) => v.trim()),
  businessType: z.enum([
    "INDIVIDUAL",
    "SOLE_PROPRIETORSHIP",
    "PARTNERSHIP",
    "LLC",
    "CORPORATION",
    "OTHER",
  ]),
  businessRegistrationNumber: z
    .string()
    .min(1, "Business registration number is required")
    .max(100)
    .optional()
    .nullable(),
  taxId: z.string().max(100).optional().nullable(),
  contactEmail: z.string().email("Invalid contact email").max(255).transform((v) => v.toLowerCase().trim()),
  contactPhone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  website: z.string().url("Invalid URL").max(500).optional().nullable(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().nullable(),
      instagram: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
      linkedin: z.string().url().optional().nullable(),
      youtube: z.string().url().optional().nullable(),
      tiktok: z.string().url().optional().nullable(),
    })
    .optional(),
  categories: z
    .array(z.string().uuid("Invalid category ID"))
    .min(1, "Select at least one product category")
    .max(20, "Maximum 20 categories"),
  address: z.object({
    addressLine1: z.string().min(5).max(200),
    addressLine2: z.string().max(200).optional().nullable(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    postalCode: z.string().min(3).max(20),
    country: z.string().min(2).max(100),
  }),
  bankDetails: z.object({
    bankName: z.string().min(2, "Bank name is required").max(100),
    accountHolderName: z.string().min(2, "Account holder name is required").max(100),
    accountNumber: z.string().min(5, "Account number is required").max(50),
    bankCode: z.string().min(2, "Bank/Sort code is required").max(50),
    branchName: z.string().min(2, "Branch name is required").max(100),
    branchCode: z.string().max(50).optional().nullable(),
    swiftCode: z.string().max(20).optional().nullable(),
    iban: z.string().max(50).optional().nullable(),
    routingNumber: z.string().max(50).optional().nullable(),
  }),
  agreeToTerms: z.boolean().refine((v) => v === true, "You must agree to the vendor terms"),
});

export const updateVendorSchema = z.object({
  storeName: z.string().min(3).max(100).transform((v) => v.trim()).optional(),
  storeDescription: z.string().min(20).max(2000).transform((v) => v.trim()).optional(),
  businessType: z
    .enum(["INDIVIDUAL", "SOLE_PROPRIETORSHIP", "PARTNERSHIP", "LLC", "CORPORATION", "OTHER"])
    .optional(),
  businessRegistrationNumber: z.string().min(1).max(100).optional().nullable(),
  taxId: z.string().max(100).optional().nullable(),
  contactEmail: z.string().email().max(255).transform((v) => v.toLowerCase().trim()).optional(),
  contactPhone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number").optional(),
  website: z.string().url().max(500).optional().nullable(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().nullable(),
      instagram: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
      linkedin: z.string().url().optional().nullable(),
      youtube: z.string().url().optional().nullable(),
      tiktok: z.string().url().optional().nullable(),
    })
    .optional(),
  categories: z.array(z.string().uuid()).min(1).max(20).optional(),
  returnPolicy: z.string().max(2000).optional().nullable(),
  shippingPolicy: z.string().max(2000).optional().nullable(),
});

export const bankDetailSchema = z.object({
  bankName: z.string().min(2, "Bank name is required").max(100),
  accountHolderName: z.string().min(2, "Account holder name is required").max(100),
  accountNumber: z.string().min(5, "Account number is required").max(50),
  bankCode: z.string().min(2, "Bank/Sort code is required").max(50),
  branchName: z.string().min(2, "Branch name is required").max(100),
  branchCode: z.string().max(50).optional().nullable(),
  swiftCode: z.string().max(20).optional().nullable(),
  iban: z.string().max(50).optional().nullable(),
  routingNumber: z.string().max(50).optional().nullable(),
  isDefault: z.boolean().optional(),
});

export const storefrontSettingsSchema = z.object({
  theme: z.string().max(50).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
  font: z.string().max(100).optional(),
  displayOutOfStock: z.boolean().optional(),
  showReviews: z.boolean().optional(),
  enableChat: z.boolean().optional(),
  headerLayout: z.enum(["STANDARD", "MINIMAL", "FEATURED"]).optional(),
  productCardStyle: z.enum(["GRID", "LIST", "COMPACT"]).optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  customCss: z.string().max(10000).optional().nullable(),
  customScripts: z.string().max(5000).optional().nullable(),
});

export const vendorQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE"]).optional(),
  category: z.string().optional(),
  sortBy: z.enum(["storeName", "createdAt", "totalSales", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  isVerified: z.string().optional(),
  isFeatured: z.string().optional(),
});

export type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type BankDetailInput = z.infer<typeof bankDetailSchema>;
export type StorefrontSettingsInput = z.infer<typeof storefrontSettingsSchema>;
