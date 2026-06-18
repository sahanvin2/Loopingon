import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signUpBaseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean(),
});

export const signUpSchema = signUpBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const customerSignUpSchema = signUpBaseSchema
  .extend({
    phone: z
      .string()
      .regex(/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)")
      .optional(),
    preferredLanguage: z.enum(["en", "si", "ta"]).optional(),
    newsletterOptIn: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const vendorApplicationSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s&\-']+$/, "Store name can only contain letters, numbers, spaces, &, -, and '"),
  storeDescription: z
    .string()
    .min(50, "Please write at least 50 characters describing your craft and store")
    .max(2000, "Description must be less than 2000 characters"),
  businessName: z.string().min(2, "Business name is required").optional(),
  businessRegistrationNo: z.string().optional(),
  businessType: z.enum(["individual", "sole_proprietorship", "partnership", "private_limited", "cooperative", "ngo"]).optional(),
  craftType: z.array(z.string()).min(1, "Select at least one craft type"),
  craftDescription: z
    .string()
    .min(30, "Please describe your craft in at least 30 characters")
    .max(1000),
  yearsOfExperience: z
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .max(100)
    .optional(),
  employeeCount: z.number().int().min(0).max(10000).optional(),
  workshopLocation: z.string().optional(),
  workshopCity: z.string().optional(),
  workshopDistrict: z.string().optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)"),
  taxId: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  facebookUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  tiktokUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  acceptTerms: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("LK"),
  isDefault: z.boolean().optional(),
  isBilling: z.boolean().optional(),
  deliveryNotes: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100).optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review must be less than 2000 characters")
    .optional(),
  images: z.array(z.string()).max(5, "Maximum 5 images allowed").optional(),
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),
  shippingMethod: z.enum(["STANDARD", "EXPRESS", "FREE", "SAME_DAY", "INTERNATIONAL", "PICKUP"]),
  couponCode: z.string().optional(),
  customerNotes: z.string().max(500).optional(),
  giftMessage: z.string().max(200).optional(),
  isGift: z.boolean().optional(),
  giftWrap: z.boolean().optional(),
  paymentMethod: z.string().optional(),
  saveAddress: z.boolean().optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional(),
  bio: z.string().max(500).optional(),
  preferredLanguage: z.enum(["en", "si", "ta"]).optional(),
  currency: z.string().optional(),
  marketingOptIn: z.boolean().optional(),
  newsletterOptIn: z.boolean().optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  category: z.enum(["order", "payment", "product", "shipping", "account", "vendor", "technical", "other"]),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  message: z.string().min(20, "Please describe your issue in at least 20 characters").max(5000),
  orderId: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1).max(200).optional(),
  category: z.string().optional(),
  craftType: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  district: z.string().optional(),
  materials: z.string().optional(),
  onSale: z.coerce.boolean().optional(),
  isHandmade: z.coerce.boolean().optional(),
  isEcoFriendly: z.coerce.boolean().optional(),
  isFairTrade: z.coerce.boolean().optional(),
  isCustomizable: z.coerce.boolean().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject is required").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(5000),
  category: z.enum(["general", "support", "sales", "partnership", "press", "other"]),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(50, "Description must be at least 50 characters").max(10000),
  shortDescription: z.string().max(500).optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().min(0).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  quantity: z.coerce.number().int().min(0, "Quantity must be 0 or more"),
  sku: z.string().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  craftType: z.string().min(1, "Select a craft type"),
  materials: z.array(z.string()).optional(),
  dimensions: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      unit: z.enum(["cm", "in"]).default("cm"),
    })
    .optional(),
  weight: z.coerce.number().min(0).optional(),
  processingTime: z.coerce.number().int().min(0).optional(),
  shippingPrice: z.coerce.number().min(0).optional(),
  shippingPriceInternational: z.coerce.number().min(0).optional(),
  freeShippingDomestic: z.boolean().optional(),
  isHandmade: z.boolean().default(true),
  isCustomizable: z.boolean().default(false),
  isEcoFriendly: z.boolean().default(false),
  isFairTrade: z.boolean().default(false),
  madeToOrder: z.boolean().optional(),
  maxOrderQuantity: z.coerce.number().int().min(1).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW"]).default("DRAFT"),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  quantity: z.coerce.number().int().min(0).default(0),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const competitionEntrySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(2000),
  productId: z.string().min(1, "Select a product to enter"),
  images: z.array(z.string()).min(1, "Upload at least one image").max(10),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>;
export type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type CompetitionEntryInput = z.infer<typeof competitionEntrySchema>;
