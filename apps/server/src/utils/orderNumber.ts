import { randomBytes } from "crypto";
import { APP_CONFIG } from "../config/app.js";

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear().toString(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = randomBytes(3)
    .toString("hex")
    .toUpperCase()
    .substring(0, 6);

  return `${APP_CONFIG.orderPrefix}-${datePart}-${randomPart}`;
}

export function generateReturnNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear().toString(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = randomBytes(3)
    .toString("hex")
    .toUpperCase()
    .substring(0, 6);

  return `RTRN-${datePart}-${randomPart}`;
}

export function generateRefundNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear().toString(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = randomBytes(3)
    .toString("hex")
    .toUpperCase()
    .substring(0, 6);

  return `RFND-${datePart}-${randomPart}`;
}

export function generateTransactionId(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function isValidOrderNumber(orderNumber: string): boolean {
  const regex = new RegExp(`^${APP_CONFIG.orderPrefix}-\\d{8}-[A-F0-9]{6}$`);
  return regex.test(orderNumber);
}
