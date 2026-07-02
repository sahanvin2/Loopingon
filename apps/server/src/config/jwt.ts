import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "kandyam-access-secret-dev";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "kandyam-refresh-secret-dev";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";
const JWT_ISSUER = process.env.JWT_ISSUER || "kandyam";

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  type?: string;
}

export function generateAccessToken(payload: Omit<TokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
    issuer: JWT_ISSUER,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: Omit<TokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
    issuer: JWT_ISSUER,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

export { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, JWT_ISSUER };
