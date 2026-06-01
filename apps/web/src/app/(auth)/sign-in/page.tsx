"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLogin, useRefreshToken } from "@/hooks/use-auth";
import { signInSchema, type SignInInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const login = useLogin();
  const refreshToken = useRefreshToken();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: SignInInput) => {
    setError("");
    try {
      const result = await login.mutateAsync(data);
      if (result.user.role === "VENDOR") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm md:p-10">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block font-serif text-2xl font-bold text-terracotta-600">
              Loopingon
            </Link>
          </div>

          <h1 className="text-center font-serif text-3xl font-bold text-charcoal-900">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-warm-gray-500">Sign in to your Loopingon account</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray-400" />
                <input
                  id="email" type="email" autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={cn("w-full rounded-lg border py-3 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-warm-gray-400 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-charcoal-200")}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-charcoal-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray-400" />
                <input
                  id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={cn("w-full rounded-lg border py-3 pl-10 pr-12 text-sm text-charcoal-900 placeholder:text-warm-gray-400 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 focus:outline-none", errors.password ? "border-red-400" : "border-charcoal-200")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-charcoal-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-charcoal-300 text-terracotta-600 focus:ring-terracotta-500" />
                <span className="text-sm text-warm-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-terracotta-600 hover:text-terracotta-700">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-terracotta-600 text-sm font-semibold text-white shadow-soft transition-all hover:bg-terracotta-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-charcoal-200" />
            <span className="text-xs text-warm-gray-400">or continue with</span>
            <div className="h-px flex-1 bg-charcoal-200" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-charcoal-200 bg-white text-sm font-medium text-charcoal-700 transition-colors hover:bg-charcoal-50">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1877F2] text-sm font-medium text-white transition-colors hover:bg-[#166FE5]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-warm-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up/customer" className="font-medium text-terracotta-600 hover:text-terracotta-700">Sign Up</Link>
          </p>
        </div>
      </motion.div>

      <div className="pointer-events-none fixed inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q25 30 50 50 T100 50" stroke="#C75B39" fill="none" strokeWidth="1" />
              <circle cx="50" cy="50" r="3" fill="#D4A843" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
    </div>
  );
}
