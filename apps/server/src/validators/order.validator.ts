import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  variantId: z.string().uuid("Invalid variant ID").optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Maximum quantity is 999"),
});

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(200),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State/Province is required").max(100),
  postalCode: z.string().min(3, "Postal code is required").max(20),
  country: z.string().min(2, "Country is required").max(100),
  isDefault: z.boolean().optional(),
  label: z.string().max(50).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required").max(50, "Maximum 50 items per order"),
  shippingAddressId: z.string().uuid("Invalid shipping address ID").optional(),
  shippingAddress: shippingAddressSchema.optional(),
  shippingMethod: z.string().min(1, "Shipping method is required").max(100),
  paymentMethod: z.string().min(1, "Payment method is required").max(100).optional(),
  couponCode: z.string().max(50).optional().nullable(),
  customerNotes: z.string().max(500).optional().nullable(),
  facebookPage: z.string().max(200).optional().nullable(),
  contactNumberTwo: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number").optional().nullable(),
  orderNote: z.string().max(1000).optional().nullable(),
  isGift: z.boolean().optional(),
  giftMessage: z.string().max(300).optional().nullable(),
  giftWrap: z.boolean().optional(),
  useWalletBalance: z.boolean().optional(),
  expectedDelivery: z.string().optional().nullable(),
});

export const checkoutSchema = z.object({
  orderId: z.string().uuid("Invalid order ID").optional(),
  paymentMethod: z.enum(["PAYHERE", "PAYABLE", "COD", "WALLET", "BANK_TRANSFER"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  paymentDetails: z
    .object({
      cardToken: z.string().optional(),
      bankReference: z.string().optional(),
      walletPin: z.string().optional(),
    })
    .optional(),
  billingAddressId: z.string().uuid("Invalid billing address ID").optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "FAILED",
    "ON_HOLD",
    "RETURN_REQUESTED",
    "RETURNED",
  ]),
  notes: z.string().max(1000).optional().nullable(),
  notifyCustomer: z.boolean().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(10, "Please provide a reason for cancellation").max(500),
  refundMethod: z.enum(["ORIGINAL", "WALLET", "STORE_CREDIT"]).optional(),
});

export const returnOrderSchema = z.object({
  items: z.array(
    z.object({
      orderItemId: z.string().uuid("Invalid order item ID"),
      quantity: z.number().int().min(1),
      reason: z.enum(["DEFECTIVE", "WRONG_ITEM", "NOT_AS_DESCRIBED", "DAMAGED", "OTHER"]),
      description: z.string().min(10, "Please describe the issue").max(1000).optional(),
    })
  ).min(1),
  returnType: z.enum(["REFUND", "REPLACEMENT", "STORE_CREDIT"]),
  refundMethod: z.enum(["ORIGINAL", "WALLET", "STORE_CREDIT"]).optional(),
});

export const orderQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(["createdAt", "total", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const shippingAddressCreateSchema = shippingAddressSchema;

export const shippingAddressUpdateSchema = shippingAddressSchema.partial();

export const couponValidateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  cartTotal: z.number().min(0),
  productIds: z.array(z.string().uuid()).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type ReturnOrderInput = z.infer<typeof returnOrderSchema>;
export type CouponValidateInput = z.infer<typeof couponValidateSchema>;
