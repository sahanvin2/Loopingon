import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "kandyam-access-secret-dev";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "kandyam-refresh-secret-dev";
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || "reset-secret-dev";
const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || "email-verify-secret-dev";

export interface TokenPayload {
  sub: string;
  email?: string;
  role: string;
  type?: string;
  sessionId?: string;
}

export function signAccessToken(payload: Omit<TokenPayload, "type" | "sessionId"> & { sessionId?: string }): string {
  return jwt.sign({ ...payload, type: "access" }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: Omit<TokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

export function signResetToken(sub: string): string {
  return jwt.sign({ sub, type: "reset" }, RESET_TOKEN_SECRET, { expiresIn: "1h" } as jwt.SignOptions);
}

export function verifyResetToken(token: string): { sub: string } {
  return jwt.verify(token, RESET_TOKEN_SECRET) as { sub: string };
}

export function signEmailVerificationToken(sub: string, email: string): string {
  return jwt.sign({ sub, email, type: "email_verify" }, EMAIL_VERIFY_SECRET, { expiresIn: "24h" } as jwt.SignOptions);
}

export function verifyEmailToken(token: string): { sub: string; email: string } {
  return jwt.verify(token, EMAIL_VERIFY_SECRET) as { sub: string; email: string };
}

export function generateTokenFamily(): string {
  return uuidv4();
}
