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
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm md:p-10">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block font-serif text-2xl font-bold text-rose-600">Loopingon</Link>
          </div>

          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted-100">
                <CheckCircle className="h-8 w-8 text-muted-600" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal-900">Check Your Email</h1>
              <p className="mt-2 text-sm text-muted-600">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-charcoal-800">{email}</span>. The link expires in 1 hour.
              </p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className={cn("mt-4 text-sm font-medium", cooldown > 0 ? "text-muted-400" : "text-rose-600 hover:text-rose-700")}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
              </button>
              <div className="mt-6">
                <Link href="/sign-in" className="inline-flex items-center gap-1 text-sm font-medium text-charcoal-600 hover:text-charcoal-800">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-center font-serif text-3xl font-bold text-charcoal-900">Forgot Password?</h1>
              <p className="mt-2 text-center text-sm text-muted-500">Enter your email and we&apos;ll send you a reset link.</p>

              {status === "error" && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                    <input id="email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com" className={cn("w-full rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-charcoal-200")} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-rose-600 text-sm font-semibold text-white shadow-soft transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isPending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Send className="h-4 w-4" /> Send Reset Link</>}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-500">
                <Link href="/sign-in" className="font-medium text-rose-600 hover:text-rose-700">Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
