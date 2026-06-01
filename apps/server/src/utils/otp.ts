import { v4 as uuidv4 } from "uuid";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateReferralCode(): string {
  return uuidv4().substring(0, 8).toUpperCase();
}

export function generateShareToken(): string {
  return uuidv4().replace(/-/g, "").substring(0, 12);
}
