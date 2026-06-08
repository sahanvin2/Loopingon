"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, X } from "lucide-react";
import { useLogin, useSignup } from "@/hooks/use-auth";
import { signInSchema, customerSignUpSchema, type SignInInput, type CustomerSignUpInput } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

export function AuthModal() {
  const { activeModal, closeModal } = useUIStore();
  const isOpen = activeModal === "signin" || activeModal === "signup";
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (activeModal === "signin") setMode("signin");
    if (activeModal === "signup") setMode("signup");
  }, [activeModal]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-text-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-3xl bg-white p-6 md:p-8 shadow-[0_30px_80px_-20px_rgba(176,86,110,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-accent-50 hover:bg-accent-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-400" />
            </button>

            <div className="mb-5 text-center">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-serif text-lg shadow-[0_8px_20px_-8px_rgba(176,86,110,0.6)] mb-3">L</span>
              <h2 className="font-serif text-2xl font-bold text-text-900">
                {mode === "signin" ? "Welcome Back" : "Create Your Account"}
              </h2>
              <p className="mt-1 text-sm text-muted-500">
                {mode === "signin" ? "Sign in to your Kandyam account" : "Join Kandyam and discover unique Sri Lankan crafts"}
              </p>
            </div>

            {mode === "signin" ? (
              <SignInForm onSwitch={switchMode} onSuccess={closeModal} />
            ) : (
              <SignUpForm onSwitch={switchMode} onSuccess={closeModal} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SignInForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: SignInInput) => {
    setError("");
    try {
      const result = await login.mutateAsync(data);
      onSuccess();
      if (result.user.role === "VENDOR") {
        router.push("/vendor/dashboard");
      } else if (result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="modal-email" className="block text-sm font-medium text-text-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input
              id="modal-email" type="email" autoComplete="email"
              {...register("email")}
              placeholder="you@example.com"
              className={cn("w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.email ? "border-red-400" : "border-accent-200")}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="modal-password" className="block text-sm font-medium text-text-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input
              id="modal-password" type={showPassword ? "text" : "password"} autoComplete="current-password"
              {...register("password")}
              placeholder="Enter your password"
              className={cn("w-full rounded-xl border py-3 pl-10 pr-12 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.password ? "border-red-400" : "border-accent-200")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-400 hover:text-text-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-text-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-muted-600">Remember me</span>
          </label>
          <button type="button" onClick={() => { onSuccess(); window.location.href = "/forgot-password"; }} className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary-500 text-sm font-semibold text-white shadow-sm shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-md hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-accent-200" />
        <span className="text-xs text-muted-400 font-medium">or continue with</span>
        <div className="h-px flex-1 bg-accent-200" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-accent-200 bg-white text-sm font-medium text-text-700 transition-colors hover:bg-accent-50">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1877F2] text-sm font-medium text-white transition-colors hover:bg-[#166FE5]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-500">
        Don&apos;t have an account?{" "}
        <button onClick={onSwitch} className="font-semibold text-primary-600 hover:text-primary-700">Create one</button>
      </p>
    </div>
  );
}

function SignUpForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const router = useRouter();
  const signup = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CustomerSignUpInput>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", acceptTerms: true as unknown as true, newsletterOptIn: false },
  });

  const password = watch("password");
  const strength = (p: string) => {
    if (!p) return null;
    if (p.length < 8) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (p.length < 12) return { label: "Medium", color: "bg-accent-500", width: "50%" };
    return { label: "Strong", color: "bg-muted-500", width: "100%" };
  };
  const pwStrength = strength(password || "");

  const onSubmit = async (data: CustomerSignUpInput) => {
    setError("");
    try {
      await signup.mutateAsync(data);
      onSuccess();
      router.push("/verify-email");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="modal-signup-name" className="block text-sm font-medium text-text-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="modal-signup-name" autoComplete="name" {...register("fullName")} placeholder="John Doe"
              className={cn("w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.fullName ? "border-red-400" : "border-accent-200")} />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="modal-signup-email" className="block text-sm font-medium text-text-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="modal-signup-email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com"
              className={cn("w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.email ? "border-red-400" : "border-accent-200")} />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="modal-signup-pw" className="block text-sm font-medium text-text-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
              <input id="modal-signup-pw" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password")} placeholder="8+ chars, Aa1!"
                className={cn("w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.password ? "border-red-400" : "border-accent-200")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400">
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="modal-signup-cpw" className="block text-sm font-medium text-text-700 mb-1.5">Confirm</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
              <input id="modal-signup-cpw" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword")} placeholder="Re-enter"
                className={cn("w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-shadow", errors.confirmPassword ? "border-red-400" : "border-accent-200")} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400">
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {pwStrength && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-500">Password strength</span>
              <span className="text-xs font-medium text-text-700">{pwStrength.label}</span>
            </div>
            <div className="h-1.5 rounded-full bg-text-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: pwStrength.width }}
                className={cn("h-full rounded-full", pwStrength.color)}
              />
            </div>
          </div>
        )}
        {(errors.password || errors.confirmPassword) && (
          <p className="text-xs text-red-500">
            {errors.password?.message || errors.confirmPassword?.message}
          </p>
        )}

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 h-4 w-4 rounded border-text-300 text-primary-600 focus:ring-primary-500" />
          <span className="text-xs text-muted-600 leading-relaxed">
            I agree to the{" "}
            <a href="/terms-of-service" target="_blank" className="text-primary-600 hover:underline font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy-policy" target="_blank" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary-500 text-sm font-semibold text-white shadow-sm shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-md hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Create Account"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-accent-200" />
        <span className="text-xs text-muted-400 font-medium">or continue with</span>
        <div className="h-px flex-1 bg-accent-200" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-accent-200 bg-white text-sm font-medium text-text-700 transition-colors hover:bg-accent-50">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1877F2] text-sm font-medium text-white transition-colors hover:bg-[#166FE5]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-500">
        Already have an account?{" "}
        <button onClick={onSwitch} className="font-semibold text-primary-600 hover:text-primary-700">Sign in</button>
      </p>

      <p className="mt-3 text-center text-xs text-muted-400">
        Want to sell your crafts?{" "}
        <a href="/sign-up/vendor" target="_blank" className="font-medium text-primary-600 hover:text-primary-700">Apply as a vendor →</a>
      </p>
    </div>
  );
}
