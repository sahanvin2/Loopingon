"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/hooks/use-auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { mutateAsync, isPending } = useForgotPassword();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const email = watch("email");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError("");
    try {
      await mutateAsync(data.email);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    try {
      await mutateAsync(email);
      setCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-50 via-white to-accent-50 px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary-100/30 rounded-full blur-3xl" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_-20px_rgba(176,86,110,0.3)] border border-white/50">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-[0_8px_24px_-8px_rgba(176,86,110,0.6)] hover:scale-105 hover:shadow-[0_12px_28px_-8px_rgba(176,86,110,0.7)] transition-all mb-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
              </svg>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-text-900 tracking-tight">Forgot password?</h1>
            <p className="mt-1.5 text-sm text-muted-500">Enter your email and we'll send you a reset link</p>
          </div>

          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-text-900">Check your email</h2>
              <p className="mt-2 text-sm text-muted-500">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-text-700">{email}</span>. The link expires in 1 hour.
              </p>
              <button onClick={handleResend} disabled={cooldown > 0} className={cn("mt-4 text-sm font-medium", cooldown > 0 ? "text-muted-400 cursor-default" : "text-primary-500 hover:text-primary-600 transition-colors")}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
              </button>
              <div className="mt-8 pt-6 border-t border-accent-100">
                <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-500 hover:text-text-700 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                    <input id="email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com"
                      className={cn("w-full rounded-xl border py-3.5 pl-12 pr-4 text-sm text-text-900 placeholder:text-muted-400 bg-white/80 focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 focus:outline-none transition-all", errors.email ? "border-red-400" : "border-accent-200")} />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isPending} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                  {isPending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Send className="h-4 w-4" /> Send Reset Link</>}
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-accent-100 text-center">
                <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-500 hover:text-text-700 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
