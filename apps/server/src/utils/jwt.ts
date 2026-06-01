import jwt from "jsonwebtoken";

export function sign(
  payload: string | Buffer | object,
  secret: string,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, secret, options);
}

export function verify<T = unknown>(
  token: string,
  secret: string,
  options?: jwt.VerifyOptions
): T {
  return jwt.verify(token, secret, options) as T;
}

export function decode<T = unknown>(token: string): T | null {
  return jwt.decode(token) as T | null;
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return null;
}

import { v4 as uuidv4 } from "uuid";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret-dev";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret-dev";
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || "reset-secret-dev";
const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || "email-verify-secret-dev";

export interface TokenPayload {
  userId: string;
  role: string;
  sessionId?: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: TokenPayload): string {
  return sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return verify<TokenPayload>(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string): TokenPayload {
  return verify<TokenPayload>(token, REFRESH_TOKEN_SECRET);
}

export function signResetToken(userId: string): string {
  return sign({ userId }, RESET_TOKEN_SECRET, { expiresIn: "1h" });
}

export function verifyResetToken(token: string): { userId: string } {
  return verify<{ userId: string }>(token, RESET_TOKEN_SECRET);
}

export function signEmailVerificationToken(userId: string, email: string): string {
  return sign({ userId, email }, EMAIL_VERIFY_SECRET, { expiresIn: "24h" });
}

export function verifyEmailToken(token: string): { userId: string; email: string } {
  return verify<{ userId: string; email: string }>(token, EMAIL_VERIFY_SECRET);
}

export function generateTokenFamily(): string {
  return uuidv4();
}
