"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useResetPassword } from "@/hooks/use-auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError("");
    try {
      await mutateAsync(data);
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-50 via-white to-blush-50 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_-20px_rgba(176,86,110,0.3)] border border-white/50 text-center">
            <h1 className="font-serif text-2xl font-bold text-charcoal-900">Invalid Reset Link</h1>
            <p className="mt-2 text-sm text-muted-500">This password reset link is missing or invalid. Please request a new one.</p>
            <Link href="/forgot-password" className="mt-5 inline-flex items-center justify-center h-11 px-6 rounded-xl bg-rose-500 text-sm font-medium text-white shadow-sm hover:bg-rose-600 transition-colors">
              Request New Link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-50 via-white to-blush-50 px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-3xl" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blush-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_-20px_rgba(176,86,110,0.3)] border border-white/50">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-serif text-xl shadow-[0_8px_24px_-8px_rgba(176,86,110,0.6)] mb-4">L</Link>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 tracking-tight">Reset password</h1>
            <p className="mt-1.5 text-sm text-muted-500">Create a new password for your account</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                <input id="password" type={showPw ? "text" : "password"} {...register("password")} placeholder="Min 8 characters"
                  className={cn("w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.password ? "border-red-400" : "border-blush-200")} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal-600 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                <input id="confirmPassword" type={showCpw ? "text" : "password"} {...register("confirmPassword")} placeholder="Re-enter password"
                  className={cn("w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.confirmPassword ? "border-red-400" : "border-blush-200")} />
                <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal-600 transition-colors">
                  {showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isPending} className="flex h-13 w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
              {isPending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-blush-100 text-center">
            <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-500 hover:text-charcoal-700 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
