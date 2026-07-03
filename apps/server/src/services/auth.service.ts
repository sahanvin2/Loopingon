import argon2 from "argon2";
import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  signResetToken,
  verifyResetToken,
  signEmailVerificationToken,
  verifyEmailToken,
  generateTokenFamily,
  type TokenPayload,
} from "../utils/jwt.js";
import { generateOTP } from "../utils/otp.js";
import { sendSMS } from "../utils/sms.js";
import { generateTOTPSecret, generateBackupCodes, verifyTOTP } from "../utils/totp.js";

// In-memory store for OTPs (since Redis is mocked)
const otpStore = new Map<string, { code: string; expiresAt: number }>();
import { logger } from "../middleware/errorHandler.middleware.js";
import {
  addVerificationEmailJob,
  addPasswordResetEmailJob,
  addWelcomeEmailJob,
} from "../workers/email.worker.js";

export async function signup(data: {
  email: string;
  password: string;
  fullName: string;
  role?: "CUSTOMER" | "VENDOR";
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError("Email already registered", 409, "EMAIL_EXISTS");

  const passwordHash = await argon2.hash(data.password);
  const verificationToken = signEmailVerificationToken("pending", data.email);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: data.role === "VENDOR" ? "VENDOR" : "CUSTOMER",
      customerProfile:
        data.role !== "VENDOR"
          ? { create: {} }
          : undefined,
    },
  });

  if (data.role === "VENDOR") {
    await prisma.vendor.create({
      data: {
        userId: user.id,
        storeName: data.fullName,
        storeSlug: `${data.fullName.toLowerCase().replace(/\s+/g, "-")}-${user.id.substring(0, 8)}`,
        storeDescription: "",
        status: "PENDING",
      },
    });
  }

  const updatedToken = signEmailVerificationToken(user.id, data.email);
  try {
    await addVerificationEmailJob(data.email, updatedToken, data.fullName);
    await addWelcomeEmailJob(data.email, data.fullName);
  } catch (err) {
    logger.warn("Failed to queue verification or welcome email", err);
  }

  const tokenPayload: TokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      family: tokenPayload.sub + Date.now().toString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function signin(email: string, password: string, ipAddress?: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account locked. Try again in ${remainingMinutes} minutes`,
      423,
      "ACCOUNT_LOCKED"
    );
  }

  if (!user.passwordHash) {
    throw new AppError("Account uses social login. Please sign in with Google or Facebook.", 400, "SOCIAL_LOGIN_REQUIRED");
  }

  const validPassword = await argon2.verify(user.passwordHash, password);
  if (!validPassword) {
    const newAttempts = user.failedLoginAttempts + 1;
    const lockedUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil,
      },
    });

    if (newAttempts >= 5) {
      throw new AppError("Account locked due to too many failed attempts. Try again in 15 minutes.", 423, "ACCOUNT_LOCKED");
    }
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated", 403, "ACCOUNT_DEACTIVATED");
  }

  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshTokenFamily = generateTokenFamily();
  const refreshToken = signRefreshToken({ ...tokenPayload, sessionId: refreshTokenFamily });

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        family: refreshTokenFamily,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
  ]);

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const existingToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!existingToken || existingToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { family: payload.sessionId! },
      data: { revokedAt: new Date() },
    });
    throw new AppError("Token has been revoked - possible reuse detected", 401, "TOKEN_REVOKED");
  }

  await prisma.refreshToken.update({
    where: { id: existingToken.id },
    data: { revokedAt: new Date() },
  });

  const newRefreshToken = signRefreshToken(payload);
  await prisma.refreshToken.create({
    data: {
      userId: payload.sub,
      token: newRefreshToken,
      family: payload.sessionId!,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const accessToken = signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function signout(userId: string, refreshTokenStr: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, token: refreshTokenStr },
    data: { revokedAt: new Date() },
  });
  await prisma.session.deleteMany({ where: { userId } });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = signResetToken(user.id);
  try {
    await addPasswordResetEmailJob(email, token, user.fullName);
  } catch (err) {
    logger.warn("Failed to queue password reset email", err);
  }
}

export async function resetPassword(token: string, newPassword: string) {
  let payload: { sub: string };
  try {
    payload = verifyResetToken(token);
  } catch {
    throw new AppError("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
  }

  const passwordHash = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { id: payload.sub },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
  });
}

export async function verifyEmail(token: string) {
  let payload: { sub: string; email: string };
  try {
    payload = verifyEmailToken(token);
  } catch {
    throw new AppError("Invalid or expired verification token", 400, "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifiedAt: new Date() },
  });
}

export async function googleAuth(profile: { id: string; authUserId?: string; email: string; name: string; picture?: string }) {
  let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.id, emailVerified: true, avatar: user.avatar || profile.picture },
      });
    } else {
      user = await prisma.user.create({
        data: {
          id: profile.authUserId,
          email: profile.email,
          fullName: profile.name,
          googleId: profile.id,
          emailVerified: true,
          role: "CUSTOMER",
          avatar: profile.picture,
          customerProfile: { create: {} },
        },
      });
      try {
        await addWelcomeEmailJob(user.email, user.fullName);
      } catch (err) {
        logger.warn("Failed to queue welcome email", err);
      }
    }
  }

  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshTokenFamily = generateTokenFamily();
  const refreshTokenValue = signRefreshToken({ ...tokenPayload, sessionId: refreshTokenFamily });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenValue,
      family: refreshTokenFamily,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken: refreshTokenValue };
}




export async function facebookAuth(profile: { id: string; authUserId?: string; email: string; name: string; picture?: string }) {
  let user = await prisma.user.findUnique({ where: { facebookId: profile.id } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { facebookId: profile.id, emailVerified: true, avatar: user.avatar || profile.picture },
      });
    } else {
      user = await prisma.user.create({
        data: {
          id: profile.authUserId,
          email: profile.email,
          fullName: profile.name,
          facebookId: profile.id,
          emailVerified: true,
          role: "CUSTOMER",
          avatar: profile.picture,
          customerProfile: { create: {} },
        },
      });
      try {
        await addWelcomeEmailJob(user.email, user.fullName);
      } catch (err) {
        logger.warn("Failed to queue welcome email", err);
      }
    }
  }

  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshTokenFamily = generateTokenFamily();
  const refreshTokenValue = signRefreshToken({ ...tokenPayload, sessionId: refreshTokenFamily });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenValue,
      family: refreshTokenFamily,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken: refreshTokenValue };
}

export async function sendOTP(phone: string) {
  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    // If not found in User, we might still want to verify phone numbers for signup or guests.
    // For now, we will allow generating OTPs for any phone number.
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
  otpStore.set(phone, { code: otp, expiresAt });

  const message = `Kandyam: Your verification code is ${otp}. Valid for 5 minutes.`;
  await sendSMS({ recipient: phone, message });

  return { message: "OTP sent successfully" };
}

export async function verifyOTP(phone: string, code: string) {
  const stored = otpStore.get(phone);
  if (!stored) throw new AppError("OTP not found or expired", 400, "INVALID_OTP");
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    throw new AppError("OTP has expired", 400, "EXPIRED_OTP");
  }

  if (stored.code !== code) {
    throw new AppError("Invalid OTP", 400, "INVALID_OTP");
  }

  // Clear OTP
  otpStore.delete(phone);

  const user = await prisma.user.findFirst({ where: { phone } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });
  }

  return { message: "Phone verified successfully" };
}

export async function setup2FA(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const secret = generateTOTPSecret();
  const backupCodes = generateBackupCodes();

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
    },
  });

  const qrData = `otpauth://totp/Kandyam:${user.email}?secret=${secret}&issuer=Kandyam`;

  return { secret, backupCodes, qrData };
}

export async function enable2FA(userId: string, token: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!user.twoFactorSecret) throw new AppError("2FA not set up. Call setup2FA first.", 400, "2FA_NOT_SETUP");

  const valid = verifyTOTP(user.twoFactorSecret, token);
  if (!valid) throw new AppError("Invalid 2FA token", 400, "INVALID_2FA_TOKEN");

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  return { enabled: true };
}

export async function disable2FA(userId: string, token: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError("2FA is not enabled", 400, "2FA_NOT_ENABLED");
  }

  const valid = verifyTOTP(user.twoFactorSecret, token);
  if (!valid) throw new AppError("Invalid 2FA token", 400, "INVALID_2FA_TOKEN");

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    },
  });

  return { disabled: true };
}

export async function verify2FA(userId: string, token: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError("2FA is not enabled", 400, "2FA_NOT_ENABLED");
  }

  const valid = verifyTOTP(user.twoFactorSecret, token);
  if (!valid) throw new AppError("Invalid 2FA token", 400, "INVALID_2FA_TOKEN");

  return { verified: true };
}
