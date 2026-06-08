export const APP_CONFIG = {
  platformName: "Kandyam",
  defaultCommissionRate: 20,
  payoutSchedule: "threshold" as const,
  supportedCurrencies: ["LKR"] as string[],
  defaultCurrency: "LKR" as const,
  minWithdrawalAmount: 10000,
  maxProductImages: 10,
  maxImageSizeBytes: 10 * 1024 * 1024,
  allowedImageMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  orderPrefix: "KANDY",
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;
