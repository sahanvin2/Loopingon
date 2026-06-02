"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, X } from "lucide-react";
import { useLogin, useSignup } from "@/hooks/use-auth";
import { post } from "@/lib/api-client";
import { signInSchema, customerSignUpSchema, type SignInInput, type CustomerSignUpInput } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useDebounce } from "@/hooks/use-debounce";

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
            className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(176,86,110,0.5)] md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-blush-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-400" />
            </button>

            <div className="mb-6 text-center">
              <span className="inline-block font-serif text-2xl font-bold text-rose-600">Loopingon</span>
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
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  return (
    <div>
      <h2 className="text-center font-serif text-2xl font-bold text-charcoal-900">Welcome Back</h2>
      <p className="mt-1 text-center text-sm text-muted-500">Sign in to your Loopingon account</p>

      {error && <div className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label htmlFor="signin-email" className="mb-1 block text-sm font-medium text-charcoal-700">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="signin-email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com"
              className={cn("w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-charcoal-200")} />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="signin-password" className="mb-1 block text-sm font-medium text-charcoal-700">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="signin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} placeholder="Enter your password"
              className={cn("w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.password ? "border-red-400" : "border-charcoal-200")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-charcoal-300 text-rose-600 focus:ring-rose-500" />
            <span className="text-sm text-muted-600">Remember me</span>
          </label>
          <button type="button" onClick={() => { onSuccess(); window.location.href = "/forgot-password"; }} className="text-sm font-medium text-rose-600 hover:text-rose-700">
            Forgot Password?
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className="flex h-11 w-full items-center justify-center rounded-xl bg-rose-500 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-charcoal-200" /><span className="text-xs text-muted-400">or continue with</span><div className="h-px flex-1 bg-charcoal-200" />
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

      <p className="mt-5 text-center text-sm text-muted-500">
        Don&apos;t have an account?{" "}
        <button onClick={onSwitch} className="font-medium text-rose-600 hover:text-rose-700">Sign Up</button>
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
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CustomerSignUpInput>({
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

  const strength = (p: string) => {
    if (p.length < 8) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (p.length < 12) return { label: "Medium", color: "bg-blush-500", width: "50%" };
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
      <h2 className="text-center font-serif text-2xl font-bold text-charcoal-900">Create Your Account</h2>
      <p className="mt-1 text-center text-sm text-muted-500">Join Loopingon and discover unique Sri Lankan crafts</p>

      {error && <div className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5">
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-charcoal-700">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="signup-name" autoComplete="name" {...register("fullName")} placeholder="John Doe"
              className={cn("w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.fullName ? "border-red-400" : "border-charcoal-200")} />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-charcoal-700">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
            <input id="signup-email" type="email" autoComplete="email" {...register("email")} placeholder="you@example.com"
              className={cn("w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-charcoal-200")} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingEmail && <span className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal-300 border-t-rose-500" />}
              {!checkingEmail && emailAvailable === true && <span className="text-muted-500 text-xs">✓</span>}
              {!checkingEmail && emailAvailable === false && <span className="text-red-500 text-xs">✗</span>}
            </div>
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-charcoal-700">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
              <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password")} placeholder="Min 8 chars"
                className={cn("w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.password ? "border-red-400" : "border-charcoal-200")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-400">
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="signup-confirm" className="mb-1 block text-sm font-medium text-charcoal-700">Confirm</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
              <input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword")} placeholder="Re-enter"
                className={cn("w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder:text-muted-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", errors.confirmPassword ? "border-red-400" : "border-charcoal-200")} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-400">
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
        {password && (
          <div>
            <div className="h-1.5 rounded-full bg-charcoal-200">
              <div className={cn("h-1.5 rounded-full transition-all", pwStrength.color)} style={{ width: pwStrength.width }} />
            </div>
            <p className="mt-0.5 text-xs text-muted-500">{pwStrength.label}</p>
          </div>
        )}
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 h-4 w-4 rounded border-charcoal-300 text-rose-600" />
          <span className="text-xs text-muted-600">I agree to the <a href="/terms-of-service" target="_blank" className="text-rose-600 hover:underline">Terms</a> and <a href="/privacy-policy" target="_blank" className="text-rose-600 hover:underline">Privacy</a></span>
        </label>

        <button type="submit" disabled={isSubmitting} className="flex h-11 w-full items-center justify-center rounded-xl bg-rose-500 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Create Account"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-charcoal-200" /><span className="text-xs text-muted-400">or continue with</span><div className="h-px flex-1 bg-charcoal-200" />
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

      <p className="mt-5 text-center text-sm text-muted-500">
        Already have an account?{" "}
        <button onClick={onSwitch} className="font-medium text-rose-600 hover:text-rose-700">Sign In</button>
      </p>
    </div>
  );
}
