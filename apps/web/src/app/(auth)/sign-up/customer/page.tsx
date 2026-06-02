"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useSignup } from "@/hooks/use-auth";
import { post } from "@/lib/api-client";
import { customerSignUpSchema, type CustomerSignUpInput } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export default function SignUpCustomerPage() {
  const router = useRouter();
  const signup = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerSignUpInput>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", acceptTerms: true as unknown as true, newsletterOptIn: false },
  });

  const password = watch("password");
  const email = watch("email");
  const debouncedEmail = useDebounce(email, 500);

  useEffect(() => {
    if (!debouncedEmail || debouncedEmail.length < 3 || !debouncedEmail.includes("@")) {
      setEmailAvailable(null);
      return;
    }
    let cancelled = false;
    setCheckingEmail(true);
    post("/auth/check-email", { email: debouncedEmail })
      .then(() => { if (!cancelled) setEmailAvailable(true); })
      .catch(() => { if (!cancelled) setEmailAvailable(false); })
      .finally(() => { if (!cancelled) setCheckingEmail(false); });
    return () => { cancelled = true; };
  }, [debouncedEmail]);

  const passwordStrength = (p: string): { label: string; color: string; width: string } => {
    if (!p) return { label: "", color: "bg-transparent", width: "0%" };
    if (p.length < 8) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (p.length < 12) return { label: "Medium", color: "bg-blush-500", width: "50%" };
    return { label: "Strong", color: "bg-muted-500", width: "100%" };
  };

  const strength = passwordStrength(password || "");

  const onSubmit = async (data: CustomerSignUpInput) => {
    setError("");
    try {
      await signup.mutateAsync(data);
      router.push("/verify-email");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-50 via-white to-blush-50 px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blush-200/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_-20px_rgba(176,86,110,0.3)] border border-white/50">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-serif text-xl shadow-[0_8px_24px_-8px_rgba(176,86,110,0.6)] hover:scale-105 transition-transform mb-4">
              L
            </Link>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-500">Join Loopingon and discover unique Sri Lankan crafts</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-charcoal-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                <input id="fullName" autoComplete="name" {...register("fullName")} placeholder="John Doe"
                  className={cn("w-full rounded-xl border py-3.5 pl-12 pr-4 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.fullName ? "border-red-400" : "border-blush-200")} />
              </div>
              {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                <input id="email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com"
                  className={cn("w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.email ? "border-red-400" : "border-blush-200")} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {checkingEmail && <span className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal-300 border-t-rose-500" />}
                  {!checkingEmail && emailAvailable === true && <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center"><svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
                  {!checkingEmail && emailAvailable === false && <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center"><svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></span>}
                </div>
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                      <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password")} placeholder="8+ chars, Aa1!"
                    className={cn("w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.password ? "border-red-400" : "border-blush-200")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal-600">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
                  <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword")} placeholder="Re-enter"
                    className={cn("w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm text-charcoal-900 placeholder:text-muted-400 bg-white/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all", errors.confirmPassword ? "border-red-400" : "border-blush-200")} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal-600">
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {password && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-500">Password strength</span>
                  <span className="text-xs font-medium text-charcoal-700">{strength.label}</span>
                </div>
                <div className="h-1.5 rounded-full bg-charcoal-200 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} className={cn("h-full rounded-full", strength.color)} transition={{ duration: 0.3 }} />
                </div>
              </div>
            )}
            {(errors.password || errors.confirmPassword) && (
              <p className="text-xs text-red-500">{errors.password?.message || errors.confirmPassword?.message}</p>
            )}

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 h-4 w-4 rounded border-charcoal-300 text-rose-500 focus:ring-rose-400" />
                <span className="text-xs text-muted-600 leading-relaxed group-hover:text-charcoal-700 transition-colors">
                  I agree to the{" "}
                  <a href="/terms-of-service" target="_blank" className="text-rose-500 hover:underline font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy-policy" target="_blank" className="text-rose-500 hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blush-200 to-transparent" />
            <span className="text-xs font-medium text-muted-400 uppercase tracking-wider">or continue with</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blush-200 to-transparent" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-blush-200 bg-white text-sm font-medium text-charcoal-700 transition-all hover:bg-blush-50 hover:border-blush-300 hover:shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] text-sm font-medium text-white transition-all hover:bg-[#166FE5] hover:shadow-md">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-rose-500 hover:text-rose-600 transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link href="/sign-up/vendor" className="inline-flex items-center gap-1 text-xs text-muted-400 hover:text-rose-500 transition-colors group">
              <Sparkles className="h-3 w-3" /> Want to sell your crafts?{" "}
              <span className="font-medium text-rose-500 group-hover:underline">Apply as a vendor →</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
