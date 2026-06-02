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
      <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-soft-sm">
          <h1 className="font-serif text-2xl font-bold text-charcoal-900">Invalid Reset Link</h1>
          <p className="mt-2 text-sm text-muted-600">This password reset link is missing or invalid. Please request a new one.</p>
          <Link href="/forgot-password" className="mt-4 inline-block text-sm font-medium text-rose-600 hover:text-rose-700">Request New Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm md:p-10">
          <div className="mb-6 text-center"><Link href="/" className="font-serif text-2xl font-bold text-rose-600">Loopingon</Link></div>
          <h1 className="text-center font-serif text-3xl font-bold text-charcoal-900">Reset Password</h1>
          <p className="mt-1 text-center text-sm text-muted-500">Create a new password for your account.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-charcoal-700">New Password</label>
              <div className="relative mt-1.5"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input type={showPw ? "text" : "password"} {...register("password")} placeholder="Min 8 characters" className={cn("w-full rounded-lg border py-3 pl-10 pr-12 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.password ? "border-red-400" : "border-charcoal-200")} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal-700">Confirm Password</label>
              <div className="relative mt-1.5"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input type={showCpw ? "text" : "password"} {...register("confirmPassword")} placeholder="Re-enter password" className={cn("w-full rounded-lg border py-3 pl-10 pr-12 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.confirmPassword ? "border-red-400" : "border-charcoal-200")} /><button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400">{showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center rounded-lg bg-rose-600 text-sm font-semibold text-white shadow-soft hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Reset Password"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm"><Link href="/sign-in" className="inline-flex items-center gap-1 text-charcoal-600 hover:text-charcoal-800"><ArrowLeft className="h-4 w-4" /> Back to Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
