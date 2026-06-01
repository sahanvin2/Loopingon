export const payHereConfig = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || "",
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || "",
  baseUrl:
    process.env.PAYHERE_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.payhere.lk"
      : "https://sandbox.payhere.lk"),
  notifyUrl: process.env.PAYHERE_NOTIFY_URL || "/api/v1/payments/payhere/notify",
  returnUrl: process.env.PAYHERE_RETURN_URL || "/payment/return",
  cancelUrl: process.env.PAYHERE_CANCEL_URL || "/payment/cancel",
};

export const payableConfig = {
  apiKey: process.env.PAYABLE_API_KEY || "",
  apiSecret: process.env.PAYABLE_API_SECRET || "",
  baseUrl:
    process.env.PAYABLE_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.payable.lk"
      : "https://sandbox-api.payable.lk"),
};

export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string
): string {
  const crypto = require("crypto");
  const hashString = `${merchantId}${orderId}${amount.toFixed(2)}${currency}${payHereConfig.merchantSecret.toUpperCase()}`;
  return crypto
    .createHash("md5")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
}

export function verifyPayHereHash(
  merchantId: string,
  orderId: string,
  payhereAmount: string,
  payhereCurrency: string,
  statusCode: string,
  receivedHash: string
): boolean {
  const crypto = require("crypto");
  const hashString = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${payHereConfig.merchantSecret.toUpperCase()}`;
  const calculatedHash = crypto
    .createHash("md5")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
  return calculatedHash === receivedHash;
}
