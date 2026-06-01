export const APP_CONFIG = {
  platformName: "Loopingon",
  defaultCommissionRate: 20,
  payoutSchedule: "biweekly" as const,
  supportedCurrencies: ["LKR"] as string[],
  defaultCurrency: "LKR" as const,
  minWithdrawalAmount: 500,
  maxProductImages: 10,
  maxImageSizeBytes: 10 * 1024 * 1024,
  allowedImageMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  orderPrefix: "LOOP",
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;
