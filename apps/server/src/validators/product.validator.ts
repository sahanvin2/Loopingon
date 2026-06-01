import { z } from "zod";

const moneySchema = z
  .number()
  .min(0, "Price must be non-negative")
  .max(99999999.99, "Price is too high")
  .multipleOf(0.01, "Price must have at most 2 decimal places");

const dimensionSchema = z
  .number()
  .min(0, "Dimension must be non-negative")
  .max(9999, "Dimension is too large")
  .optional()
  .nullable();

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be at most 200 characters")
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters")
    .transform((v) => v.trim()),
  price: moneySchema.refine((v) => v > 0, "Price must be greater than 0"),
  compareAtPrice: moneySchema.optional().nullable(),
  costPrice: moneySchema.optional().nullable(),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(100, "SKU must be at most 100 characters")
    .optional(),
  barcode: z.string().max(120).optional().nullable(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(9999999, "Quantity is too large"),
  lowStockThreshold: z.number().int().min(0).max(99999).optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
  tags: z.array(z.string().max(50)).max(20, "Maximum 20 tags").optional(),
  weight: z.number().min(0).max(999999, "Weight is too large").optional().nullable(),
  dimensions: z
    .object({
      length: dimensionSchema,
      width: dimensionSchema,
      height: dimensionSchema,
    })
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isReturnable: z.boolean().optional(),
  minOrderQuantity: z.number().int().min(1).max(9999).optional(),
  maxOrderQuantity: z.number().int().min(1).max(9999).optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  shippingWeight: z.number().min(0).optional().nullable(),
  warrantyInfo: z.string().max(500).optional().nullable(),
  attributes: z.record(z.string(), z.string().or(z.number()).or(z.boolean())).optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be at most 200 characters")
    .transform((v) => v.trim())
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters")
    .transform((v) => v.trim())
    .optional(),
  price: moneySchema.optional(),
  compareAtPrice: moneySchema.optional().nullable(),
  costPrice: moneySchema.optional().nullable(),
  sku: z.string().min(1).max(100).optional(),
  barcode: z.string().max(120).optional().nullable(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(9999999)
    .optional(),
  lowStockThreshold: z.number().int().min(0).max(99999).optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  weight: z.number().min(0).max(999999).optional().nullable(),
  dimensions: z
    .object({
      length: dimensionSchema,
      width: dimensionSchema,
      height: dimensionSchema,
    })
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isReturnable: z.boolean().optional(),
  minOrderQuantity: z.number().int().min(1).max(9999).optional(),
  maxOrderQuantity: z.number().int().min(1).max(9999).optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  shippingWeight: z.number().min(0).optional().nullable(),
  warrantyInfo: z.string().max(500).optional().nullable(),
  attributes: z.record(z.string(), z.string().or(z.number()).or(z.boolean())).optional(),
});

export const createVariantSchema = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(100),
  price: moneySchema.optional(),
  compareAtPrice: moneySchema.optional().nullable(),
  quantity: z.number().int().min(0).max(9999999),
  options: z.record(z.string(), z.string()),
  barcode: z.string().max(120).optional().nullable(),
  weight: z.number().min(0).max(999999).optional().nullable(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateVariantSchema = createVariantSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().max(200).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  vendor: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(["price", "name", "createdAt", "updatedAt", "popularity", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  inStock: z.string().optional(),
  isActive: z.string().optional(),
  isFeatured: z.string().optional(),
  tags: z.string().optional(),
  rating: z.string().optional(),
});

export const productReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().min(1, "Review title is required").max(200).transform((v) => v.trim()),
  body: z.string().min(10, "Review must be at least 10 characters").max(5000).transform((v) => v.trim()),
  images: z.array(z.string().url()).max(5, "Maximum 5 images").optional(),
  isAnonymous: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type ProductReviewInput = z.infer<typeof productReviewSchema>;
