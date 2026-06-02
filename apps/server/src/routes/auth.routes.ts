import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  refreshTokenSchema,
  otpSchema,
} from "../validators/auth.validator.js";
import * as authService from "../services/auth.service.js";
import { successResponse, createdResponse, noContentResponse } from "../utils/response.js";

const router = Router();

router.post(
  "/signup",
  authLimiter,
  validate(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req.body);
      createdResponse(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/signin",
  authLimiter,
  validate(signinSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || undefined;
      const result = await authService.signin(req.body.email, req.body.password, ip);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/signout",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.signout(req.user!.id, req.body.refreshToken || "");
      noContentResponse(res);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.forgotPassword(req.body.email);
      successResponse(res, { message: "If account exists, reset email sent" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      successResponse(res, { message: "Password reset successfully" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.verifyEmail(req.body.token);
      successResponse(res, { message: "Email verified successfully" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword("", req.body.newPassword);
      // TODO: Implement proper change-password flow (requires current password verification)
      successResponse(res, { message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.sendOTP(req.body.phone);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.verifyOTP(req.body.phone, req.body.code);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/2fa/setup",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.setup2FA(req.user!.id);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/2fa/enable",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.enable2FA(req.user!.id, req.body.token);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/2fa/disable",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.disable2FA(req.user!.id, req.body.token);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/2fa/verify",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.verify2FA(req.user!.id, req.body.token);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/google/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = {
        id: req.query.id as string,
        email: req.query.email as string,
        name: req.query.name as string,
        picture: req.query.picture as string | undefined,
      };
      const result = await authService.googleAuth(profile);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/facebook/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = {
        id: req.query.id as string,
        email: req.query.email as string,
        name: req.query.name as string,
        picture: req.query.picture as string | undefined,
      };
      const result = await authService.facebookAuth(profile);
      successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
